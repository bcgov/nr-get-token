const keycloakRouter = require('express').Router();

const { body, validationResult } = require('express-validator');
const config = require('config');
const cryptico = require('cryptico-js');
const log = require('npmlog');
const Problem = require('api-problem');

const clients = require('../../components/clients');
const keycloak = require('../../components/keycloak');
const acronyms = require('../../components/acronyms');

const KeyCloakServiceClientManager = require('../../components/keyCloakServiceClientMgr');
const { lifecycleService } = require('../../services');
const permissionHelpers = require('../../components/permissionHelpers');
const RealmAdminService = require('../../components/realmAdminSvc');



// fetches all the service clients for all KC realms and related data from db
// used in admin service clients table
// current user must have role GETOK_ADMIN
keycloakRouter.get('/serviceClients', keycloak.protect('realm:GETOK_ADMIN'), async (req, res) => {
  // get service clients for each realm
  const serviceClients = await Promise.all([
    clients.getClientsFromEnv('dev'),
    clients.getClientsFromEnv('test'),
    clients.getClientsFromEnv('prod')
  ]);
  // join them all into one array
  const allServiceClients = serviceClients.flat();

  // reformat data to show in our data table of service clients
  const reduced = allServiceClients.reduce((a, b) => {

    //If this type wasn't previously stored
    if (!a[b.clientId]) {
      // create array placeholder
      a[b.clientId] = {
        acronym: b.clientId.replace('_SERVICE_CLIENT', ''),
        clientId: b.clientId,
        name: b.name,
        environments: {
        }
      };
    }
    // add array of environment data to a property
    let env = { name: b.name, created: '', updated: '' };
    a[b.clientId].environments[b.environment.toUpperCase()] = env;
    return a;
  }, {});


  // attach more app details from db to each service client object
  const getDetails = (myObj) => {

    // get a promise for each service client
    const promises = Object.keys(myObj).map(async function (key, index, object) {
      let obj = myObj[key];

      // app details
      const acronymnDetailsFromDb = await acronyms.getAcronym(obj.acronym);

      // if a corresponding acronym in db (there wont be in local dev enviroment)
      if (acronymnDetailsFromDb) {

        obj.acronymnDetails = acronymnDetailsFromDb.dataValues;

        // promotions (from lifecycle table for now)
        const promotions = await lifecycleService.findLatestPromotions(obj.acronymnDetails.acronymId);
        promotions.forEach(function (k) {
          obj.environments[k.dataValues.env].created = k.dataValues.createdAt;
          obj.environments[k.dataValues.env].updated = k.dataValues.updatedAt;
        });

        // users
        const usersList = await acronyms.getUsers(obj.acronym);
        obj.users = usersList;
      }
      return obj;
    });
    return Promise.all(promises);
  };

  getDetails(reduced)
    .then(data => {
      if (data === null) {
        return new Problem(404).send(res);
      } else {
        res.status(200).json(data);
      }
    });
});

// Creates a service client based on the configuration posted
keycloakRouter.post('/configForm', [
  body('configForm.applicationAcronym').isString(),
  body('configForm.applicationName').isString(),
  body('configForm.applicationDescription').isString(),
  body('configForm.commonServices').isArray(),
  body('configForm.clientEnvironment').isIn(['DEV', 'TEST', 'PROD']),
  body('passwordPublicKey').isString()
], async (req, res) => {
  const userid = req.kauth.grant.access_token.content.sub;

  // Validate for Bad Requests
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    log.debug('/configForm', 'Validation Error');
    return new Problem(422, {
      detail: 'Validation failed',
      errors: errors.array()
    }).send(res);
  }

  const {
    configForm,
    passwordPublicKey: publicKey
  } = req.body;

  // Check for required permissions. Can only create clients for the acronyms you are associated with
  const permissionErr = await permissionHelpers.checkAcronymPermission(userid, configForm.applicationAcronym);
  if (permissionErr) {
    return new Problem(403, { detail: permissionErr, }).send(res);
  }

  // TODO: too much logic in the routing layer, refactor along with some other stuff that does KC client operations
  // Group with the calls to "clients" component above and the one that's in Utils?
  try {
    const realmKey = `serviceClient.keycloak.${configForm.clientEnvironment.toLowerCase()}`;
    const {
      endpoint: realmBaseUrl,
      username: clientId,
      password: clientSecret,
      realm: realmId
    } = config.get(realmKey);
    const realmSvc = new RealmAdminService({ realmBaseUrl, clientId, clientSecret, realmId });
    const kcScMgr = new KeyCloakServiceClientManager(realmSvc);

    const response = await kcScMgr.manage(configForm);
    const encryptedPassword = cryptico.encrypt(response.generatedPassword, publicKey).cipher;

    // Write a lifecycle record
    await lifecycleService.create(configForm.applicationAcronym, configForm, configForm.clientEnvironment, userid);
    return res.status(200).json({
      oidcTokenUrl: response.oidcTokenUrl,
      generatedServiceClient: response.generatedServiceClient,
      generatedPassword: encryptedPassword
    });
  } catch (error) {
    log.error(error);
    return new Problem(500, { detail: error.message }).send(res);
  }
});

module.exports = keycloakRouter;
