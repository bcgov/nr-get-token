const log = require('npmlog');

const appConfig = require('express').Router();
const utils = require('../../components/utils');

const appConfigComponent = require('../../components/appConfig');

// submits a webade application configuration
appConfig.get('/:webAdeEnv/:appAcronym', [
], async (req, res) => {
  console.log(req.params.webAdeEnv + " " + req.params.appAcronym);

  // TODO: a lot of this role checking is duplicate, but as we will be moving acronym management to the DB soon all this will need to be refactored anyways

  // Check for required permissions. Can only fetch cfgs for the acronyms you are associated with
  // If the user has "WEBADE_CFG_READ_ALL" then they can get all
  let acronyms = [];
  const roles = req.user.jwt.realm_access.roles;
  let hasReadAllRole = false;
  if (typeof roles === 'object' && roles instanceof Array) {
    acronyms = utils.filterAppAcronymRoles(roles);
    hasReadAllRole = roles.includes('WEBADE_CFG_READ_ALL');
  }

  if (!hasReadAllRole) {
    const appAcronym = req.params.appAcronym;
    if (!acronyms.includes(appAcronym)) {
      return res.status(403).json({
        message: `User lacks permission for '${appAcronym}' acronym`
      });
    }
  }

  try {
    const response = await appConfigComponent.getAppConfig(req.params.webAdeEnv, req.params.appAcronym);
    if(response) {
      return res.status(200).json(response);
    } else {
      return res.status(404).json();
    }
  } catch (error) {
    log.error(error);
    res.status(500).json({
      message: error.message
    });
    return res;
  }
});

module.exports = appConfig;
