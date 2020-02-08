const config = require('config');
const cryptico = require('cryptico-js');
const log = require('npmlog');

const KeyCloakServiceClientManager = require('../../components/keyCloakServiceClientMgr');
const RealmAdminService = require('../../components/realmAdminSvc');
const permissionHelpers = require('../../components/permissionHelpers');
const {
  lifecycleService
} = require('../../services');

const {
  body,
  validationResult
} = require('express-validator');

// submits a keycloak service client
const keyCloak = require('express').Router();

// fetches the service client details for an acronym in the KC realms
keyCloak.get('/clients/:kcEnvironment/:appAcronym', [
], async (req, res) => {
  // Check for required permissions. Can only fetch client for the acronyms you are associated with
  // If the user has "KC_CLIENt_READ_ALL" then they can get all
  if (!req.user.jwt.realm_access.roles.includes('KC_CLIENT_READ_ALL')) {
    const permissionErr = permissionHelpers.checkAcronymPermission(req.user.jwt, req.params.appAcronym);
    if (permissionErr) {
      return res.status(403).json({
        message: permissionErr
      });
    }
  }

  try {
    const realmKey = `serviceClient.keyCloak.${req.params.kcEnvironment}`;
    const {
      endpoint: realmBaseUrl,
      username: clientId,
      password: clientSecret,
      realm: realmId
    } = config.get(realmKey);
    const realmSvc = new RealmAdminService({ realmBaseUrl, clientId, clientSecret, realmId });
    const kcScMgr = new KeyCloakServiceClientManager(realmSvc);

    const clientDetails = await kcScMgr.fetchClient(req.params.appAcronym);
    if (clientDetails) {
      clientDetails.environment = req.params.kcEnvironment;
      return res.status(200).json(clientDetails);
    } else {
      return res.status(404);
    }
  } catch (error) {
    log.error(error);
    res.status(500).json({
      message: error.message
    });
    return res;
  }
});

keyCloak.post('/configForm', [
  body('configForm.applicationAcronym').isString(),
  body('configForm.applicationName').isString(),
  body('configForm.applicationDescription').isString(),
  body('configForm.commonServices').isArray(),
  body('configForm.clientEnvironment').isIn(['DEV', 'TEST', 'PROD']),
  body('passwordPublicKey').isString()
], async (req, res) => {
  // Validate for Bad Requests
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
      message: 'Validation failed'
    });
  }

  const {
    configForm,
    passwordPublicKey: publicKey
  } = req.body;

  try {
    const realmKey = `serviceClient.keyCloak.${configForm.clientEnvironment}`;
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
    await lifecycleService.create(configForm.applicationAcronym, configForm, configForm.clientEnvironment, req.user.jwt.sub);
    return res.status(200).json({
      oidcTokenUrl: response.oidcTokenUrl,
      generatedServiceClient: response.generatedServiceClient,
      generatedPassword: encryptedPassword
    });
  } catch (error) {
    log.error(error);
    res.status(500).json({
      message: error.message
    });
    return res;
  }
});

module.exports = keyCloak;
