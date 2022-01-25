const keycloakRouter = require('express').Router();

const { body, validationResult } = require('express-validator');
const config = require('config');
const cryptico = require('cryptico-js');
const log = require('../../components/log')(module.filename);
const Problem = require('api-problem');

const clients = require('../../components/clients');
const keycloak = require('../../components/keycloak');
const permissionHelpers = require('../../components/permissionHelpers');
const KeyCloakServiceClientManager = require('../../components/keyCloakServiceClientMgr');
const RealmAdminService = require('../../components/realmAdminSvc');

const { deploymentHistoryService } = require('../../services');

// fetches all the service clients for all KC realms and related data from db
// used in admin service clients table
// current user must have role GETOK_ADMIN
keycloakRouter.get(
  '/serviceClients',
  keycloak.protect('realm:GETOK_ADMIN'),
  async (req, res) => {
    const result = await clients.getAllServiceClients();

    if (result === null) {
      return new Problem(404).send(res);
    } else {
      res.status(200).json(result);
    }
  }
);

// Creates a service client based on the configuration posted
keycloakRouter.post(
  '/configForm',
  [
    body('configForm.applicationAcronym').isString(),
    body('configForm.applicationName').isString(),
    body('configForm.applicationDescription').isString(),
    body('configForm.commonServices').isArray(),
    body('configForm.clientEnvironment').isIn(['DEV', 'TEST', 'PROD']),
    body('passwordPublicKey').isString(),
  ],
  async (req, res) => {
    const userid = req.kauth.grant.access_token.content.sub;

    // Validate for Bad Requests
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      log.debug('/configForm', 'Validation Error');
      return new Problem(422, {
        detail: 'Validation failed',
        errors: errors.array(),
      }).send(res);
    }

    const { configForm, passwordPublicKey: publicKey } = req.body;

    // Check for required permissions. Can only create clients for the acronyms you are associated with
    const permissionErr = await permissionHelpers.checkAcronymPermission(
      userid,
      configForm.applicationAcronym
    );
    if (permissionErr) {
      return new Problem(403, { detail: permissionErr }).send(res);
    }

    // TODO: too much logic in the routing layer, refactor along with some other stuff that does KC client operations
    // Group with the calls to "clients" component above and the one that's in Utils?
    try {
      const realmKey = `serviceClient.keycloak.${configForm.clientEnvironment.toLowerCase()}`;
      const {
        endpoint: realmBaseUrl,
        username: clientId,
        password: clientSecret,
        realm: realmId,
      } = config.get(realmKey);
      const realmSvc = new RealmAdminService({
        realmBaseUrl,
        clientId,
        clientSecret,
        realmId,
      });
      const kcScMgr = new KeyCloakServiceClientManager(realmSvc);

      const response = await kcScMgr.manage(configForm);
      const encryptedPassword = cryptico.encrypt(
        response.generatedPassword,
        publicKey
      ).cipher;

      // Write a history record
      await deploymentHistoryService.create(
        configForm.applicationAcronym,
        configForm,
        configForm.clientEnvironment,
        userid
      );
      return res.status(200).json({
        oidcTokenUrl: response.oidcTokenUrl,
        generatedServiceClient: response.generatedServiceClient,
        generatedPassword: encryptedPassword,
      });
    } catch (error) {
      log.error(error);
      return new Problem(500, { detail: error.message }).send(res);
    }
  }
);

module.exports = keycloakRouter;
