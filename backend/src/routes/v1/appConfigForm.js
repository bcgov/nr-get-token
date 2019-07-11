const log = require('npmlog');

const appConfig = require('express').Router();
const {
  body,
  validationResult
} = require('express-validator');

const appConfigComponent = require('../../components/appConfig');

// submits a webade application configuration
appConfig.post('/', [
  body('configForm.applicationAcronym').isString(),
  body('configForm.applicationName').isString(),
  body('configForm.applicationDescription').isString(),
  body('configForm.commonServices').isArray(),
  body('configForm.webadeEnvironment').isIn(['INT', 'TEST', 'PROD']),
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

  // Check for required permission
  let acronyms = [];
  const roles = req.user.jwt.realm_access.roles;
  if (typeof roles === 'object' && roles instanceof Array) {
    acronyms = roles.filter(role => !role.match(/offline_access|uma_authorization/));
  }

  const {
    configForm,
    passwordPublicKey: publicKey
  } = req.body;

  const appAcronym = configForm.applicationAcronym;
  if (!acronyms.includes(configForm.applicationAcronym)) {
    return res.status(403).json({
      message: `User lacks permission for '${appAcronym}' acronym`
    });
  }

  try {
    const response = await appConfigComponent.postAppConfig(configForm, publicKey);
    return res.status(200).json(response);
  } catch (error) {
    log.error(error);
    res.status(500).json({
      message: error.message
    });
    return res;
  }
});

module.exports = appConfig;
