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
// will need to add public key to this for encryption from frontend...
const kcClientForm = require('express').Router();
kcClientForm.post('/', [
  body('serviceClientForm.applicationAcronym').isString(),
  body('serviceClientForm.applicationName').isString(),
  body('serviceClientForm.applicationDescription').isString(),
  body('serviceClientForm.commonServices').isArray(),
  body('serviceClientForm.keycloakEnvironment').isIn(['INT']),
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
    serviceClientForm,
    passwordPublicKey: publicKey
  } = req.body;

  try {
    const realmKey = `serviceClient.keyCloak.${serviceClientForm.keycloakEnvironment}`;
    const {
      endpoint: realmBaseUrl,
      username: clientId,
      password: clientSecret,
      realm: realmId} = config.get(realmKey);
    const realmSvc = new RealmAdminService({realmBaseUrl, clientId, clientSecret, realmId});
    const kcScMgr = new KeyCloakServiceClientManager(realmSvc);

    const response = await kcScMgr.manage(serviceClientForm);
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

module.exports = kcClientForm;
