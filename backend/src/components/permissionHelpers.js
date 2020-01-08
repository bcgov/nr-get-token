const log = require('npmlog');
const utils = require('./utils');


const permissionHelpers = {
  // TODO: this is likely soon to be refactored out, as we will be pulling acronyms from the DB, not from access roles
  // Returns only app acronym based roles
  filterAppAcronymRoles: roles => roles.filter(role => !role.match(/offline_access|uma_authorization|WEBADE_CFG_READ|WEBADE_CFG_READ_ALL|WEBADE_PERMISSION|WEBADE_PERMISSION_NROS_DMS/)),

  /**
  * Is this call allowed to be made for the acronym it's being made for?
  * @param {string} token - The user's token from the request.
  * @param {string} acronym - The app acronym.
  * @returns {string} Error Message - Undefined if permitted, a string of the error message to return if not permitted.
  */
  checkAcronymPermission: (token, applicationAcronym) => {
    // TODO: a lot of this role checking is duplicate, but as we will be moving acronym management to the DB soon all this will need to be refactored anyways

    // Get Acronyms from user token
    let acronyms = [];
    const roles = token.realm_access.roles;
    if (typeof roles === 'object' && roles instanceof Array) {
      acronyms = permissionHelpers.filterAppAcronymRoles(roles);
    }

    // Do they have access to the Acronym they are trying to POST
    const appAcronym = applicationAcronym;
    if (!acronyms.includes(applicationAcronym)) {
      log.verbose(`User not authorized for acronym ${applicationAcronym}. Token: ${utils.prettyStringify(token)}`);
      return `User lacks permission for '${appAcronym}' acronym`;
    }
  },

  /**
  * Is this call allowed to post the WebADE config details?
  * @param {string} token - The user's token from the request.
  * @param {string} configForm - The form posted to the post enpoint.
  * @param {string} acronymData - The acronym details from the getok db.
  * @param {string} desiredUserRoles - Specific user permissions that are needed for the operation to check.
  * @returns {string} Error Message - Undefined if permitted, a string of the error message to return if not permitted.
  */
  checkWebAdePostPermissions: (token, configForm, acronymData, desiredUserRoles = []) => {
    try {
      // Do they have access to the Acronym they are trying to POST
      let acronymAccessError = permissionHelpers.checkAcronymPermission(token, configForm.applicationAcronym);
      if (acronymAccessError) {
        return acronymAccessError;
      }

      // Do they have the specified scopes
      let roleError = undefined;
      desiredUserRoles.forEach((role) => {
        if (!token.realm_access.roles.includes(role)) {
          roleError = `User is not permitted to submit WebADE config, missing role ${role}`;
          return;
        }
      });
      if (roleError) {
        return roleError;
      }

      // Is this acronym allowed to post webade
      if (!acronymData.permissionWebade) {
        return `Acronym '${acronymData.acronym}' is not permitted to submit WebADE configs`;
      }

      // If trying to do it, is this acronym allowed special access to NROS DMs
      if (desiredUserRoles.includes('WEBADE_PERMISSION_NROS_DMS') && !acronymData.permissionWebadeNrosDms) {
        return `Acronym '${acronymData.acronym}' is not permitted special access to NROS DMS`;
      }
    } catch (error) {
      log.error(`Error occurred determening permission for WebADE POST. Error: ${error}`);
      return 'Failed to determine permission for WebADE access';
    }
  }
};

module.exports = permissionHelpers;
