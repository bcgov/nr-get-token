const log = require('npmlog');

const { userService } = require('../services');

const permissionHelpers = {
  /**
   *  @function checkAcronymPermission
   *  Is this call allowed to be made for the acronym it's being made for?
   *  @param {string} userId - The user's identifier from the request.
   *  @param {string} acronym - The app acronym.
   *  @returns {string} Error Message - Undefined if permitted, a string of the error message to return if not permitted.
   */
  checkAcronymPermission: async (userId, applicationAcronym) => {
    // Get Acronyms from DB
    const acronyms = await userService.userAcronymList(userId);

    // Do they have access to the Acronym they are trying to POST
    if (!acronyms.map(acr => acr.acronym).includes(applicationAcronym)) {
      log.info('checkAcronymPermission', `User not authorized for acronym ${applicationAcronym}. User: ${JSON.stringify(userId)}`);
      return `User lacks permission for '${applicationAcronym}' acronym`;
    }
  },

  /**
   *  @function checkWebAdePostPermissions
   *  Is this call allowed to post the WebADE config details?
   *  @param {string} token - The user's token from the request.
   *  @param {string} configForm - The form posted to the post enpoint.
   *  @param {string} acronymData - The acronym details from the getok db.
   *  @param {string} desiredUserRoles - Specific user permissions that are needed for the operation to check.
   *  @returns {string} Error Message - Undefined if permitted, a string of the error message to return if not permitted.
   */
  checkWebAdePostPermissions: async (token, configForm, acronymData, desiredUserRoles = []) => {
    try {
      // Do they have access to the Acronym they are trying to POST
      const acronymAccessError = await permissionHelpers.checkAcronymPermission(token, configForm.applicationAcronym);
      if (acronymAccessError) {
        return acronymAccessError;
      }

      // Do they have the specified scopes
      let roleError = undefined;
      desiredUserRoles.forEach(role => {
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
      log.error(`Error occurred determining permission for WebADE POST. Error: ${error}`);
      return 'Failed to determine permission for WebADE access';
    }
  }
};

module.exports = permissionHelpers;
