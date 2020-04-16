const webadeRouter = require('express').Router();

const { body, param, validationResult } = require('express-validator');
//const config = require('config');
const log = require('npmlog');
const Problem = require('api-problem');

const permissionHelpers = require('../../components/permissionHelpers');
const utils = require('../../components/utils');
const webadeComponent = require('../../components/webade');

// fetches the app config json for a acronym in a specified env
webadeRouter.get('/:webAdeEnv/:appAcronym/appConfig', [
  param('webAdeEnv').isIn(['INT', 'TEST', 'PROD']),
], async (req, res) => {
  try {
    // TODO: Move this into middleware or equivalent
    // Validate for Bad Requests
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return new Problem(422, {
        detail: 'Validation failed',
        errors: errors.array()
      }).send(res);
    }

    // Check for required permissions. Can only fetch cfgs for the acronyms you are associated with
    // If the user has "WEBADE_CFG_READ_ALL" then they can get all
    if (!req.kauth.grant.access_token.content.realm_access.roles.includes('WEBADE_CFG_READ_ALL')) {
      const permissionErr = await permissionHelpers.checkAcronymPermission(req.kauth.grant.access_token.content.sub, req.params.appAcronym);
      if (permissionErr) {
        return new Problem(403, { detail: permissionErr, }).send(res);
      }
    }

    const response = await webadeComponent.getAppConfig(req.params.webAdeEnv, req.params.appAcronym);
    if (response) {
      return res.status(200).json(response);
    } else {
      return new Problem(404).send(res);
    }
  } catch (error) {
    log.error(error);
    return new Problem(500, { detail: error.message }).send(res);
  }
});

// gets the big array of all webade configs for a specified env
webadeRouter.get('/:webAdeEnv/appConfigs', [
  param('webAdeEnv').isIn(['INT', 'TEST', 'PROD']),
], async (req, res) => {
  try {
    // TODO: Move this into middleware or equivalent
    // Validate for Bad Requests
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return new Problem(422, {
        detail: 'Validation failed',
        errors: errors.array()
      }).send(res);
    }

    // Only administrative users with WEBADE_CFG_READ_ALL can get this info
    const roles = req.kauth.grant.access_token.content.realm_access.roles;
    let hasReadAllRole = false;
    if (typeof roles === 'object' && roles instanceof Array) {
      hasReadAllRole = roles.includes('WEBADE_CFG_READ_ALL');
    }

    if (!hasReadAllRole) {
      return new Problem(403, { detail: 'User lacks permission to get all app configs', }).send(res);
    }

    const response = await webadeComponent.getAppConfigs(req.params.webAdeEnv);
    if (response) {
      return res.status(200).json(response);
    } else {
      return new Problem(404).send(res);
    }
  } catch (error) {
    log.error(error);
    return new Problem(500, { detail: error.message }).send(res);
  }
});

// submits a webade application configuration
webadeRouter.post('/configForm', [
  body('configForm.applicationAcronym').isString(),
  body('configForm.applicationName').isString(),
  body('configForm.applicationDescription').isString(),
  body('configForm.commonServices').isArray(),
  body('configForm.clientEnvironment').isIn(['INT', 'TEST', 'PROD']),
  body('passwordPublicKey').isString()
], async (req, res) => {
  // Validate for Bad Requests
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return new Problem(422, {
      detail: 'Validation failed',
      errors: errors.array()
    }).send(res);
  }

  const {
    configForm,
    passwordPublicKey: publicKey
  } = req.body;

  // Check if this is allowed, return the error message if not
  const err = await webadeComponent.getPermissionError(req.kauth.grant.access_token.content, configForm);
  if (err) {
    log.debug('GET /configForm', `No permission to Post WebADE config: ${err}`);
    return new Problem(403, { detail: err, }).send(res);
  }
  try {
    const response = await webadeComponent.postAppConfig(configForm, publicKey, req.kauth.grant.access_token.content.sub);
    return res.status(200).json(response);
  } catch (error) {
    log.error(error);
    return new Problem(500, { detail: error.message }).send(res);
  }
});

// fetches a list of other webade apps that are dependent on a supplied acronym in a specified env
webadeRouter.get('/:webAdeEnv/:appAcronym/dependencies', [
  param('webAdeEnv').isIn(['INT', 'TEST', 'PROD'])
], async (req, res) => {
  try {
    // TODO: Move this into middleware or equivalent
    // Validate for Bad Requests
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return new Problem(422, {
        detail: 'Validation failed',
        errors: errors.array()
      }).send(res);
    }

    // Check for required permissions. Can only fetch cfgs for the acronyms you are associated with
    // If the user has "WEBADE_CFG_READ_ALL" then they can get all
    if (!req.kauth.grant.access_token.content.realm_access.roles.includes('WEBADE_CFG_READ_ALL')) {
      const permissionErr = await permissionHelpers.checkAcronymPermission(req.kauth.grant.access_token.content.sub, req.params.appAcronym);
      if (permissionErr) {
        return new Problem(403, { detail: permissionErr, }).send(res);
      }
    }

    const response = await webadeComponent.getAppConfigs(req.params.webAdeEnv);
    if (response) {
      const filtered = utils.filterWebAdeDependencies(response, req.params.appAcronym);
      return res.status(200).json(filtered);
    } else {
      return new Problem(404).send(res);
    }
  } catch (error) {
    log.error(error.message);
    return new Problem(500, { detail: error.message }).send(res);
  }
});

// fetches a list of all application Preferences from the webade config list that match a search criteria in the pref name
// and have the secure indicator set to FALSE
webadeRouter.get('/:webAdeEnv/preferences/insecurePrefs', [
  param('webAdeEnv').isIn(['INT', 'TEST', 'PROD'])
], async (req, res) => {
  try {
    // TODO: Move this into middleware or equivalent
    // Validate for Bad Requests
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return new Problem(422, {
        detail: 'Validation failed',
        errors: errors.array()
      }).send(res);
    }

    const searchCriteria = req.query.searchCriteria;

    // Check for required permissions.
    // If the user has "WEBADE_CFG_READ_ALL" then they can get all
    const roles = req.kauth.grant.access_token.content.realm_access.roles;
    let hasReadAllRole = false;
    if (typeof roles === 'object' && roles instanceof Array) {
      hasReadAllRole = roles.includes('WEBADE_CFG_READ_ALL');
    }

    if (!hasReadAllRole) {
      return new Problem(403, { detail: 'User lacks permission to get all app configs', }).send(res);
    }

    const response = await webadeComponent.getAppConfigs(req.params.webAdeEnv);
    if (response) {
      return res.status(200).json(utils.filterForInsecurePrefs(response, searchCriteria));
    } else {
      return new Problem(404).send(res);
    }
  } catch (error) {
    log.error(error);
    return new Problem(500, { detail: error.message }).send(res);
  }
});

module.exports = webadeRouter;
