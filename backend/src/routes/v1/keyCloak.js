const config = require('config');
const cryptico = require('cryptico-js');
const log = require('npmlog');

const RealmAdminService = require('../../components/realmAdminSvc');
const KeyCloakServiceClientManager = require('../../components/keyCloakServiceClientMgr');

const {
  body,
  validationResult
} = require('express-validator');

// submits a keycloak service client
const keyCloak = require('express').Router();

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
  console.log(req.body);
  console.log(errors);
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
    const realmSvc = new RealmAdminService({realmBaseUrl, clientId, clientSecret, realmId});
    const kcScMgr = new KeyCloakServiceClientManager(realmSvc);

    const response = await kcScMgr.manage(configForm);
    const encryptedPassword = cryptico.encrypt(response.generatedPassword, publicKey).cipher;
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
