const log = require('./log')(module.filename);

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
    if (!acronyms.map((acr) => acr.acronym).includes(applicationAcronym)) {
      log.info(
        `User not authorized for acronym ${applicationAcronym}`,
        { function: 'checkAcronymPermission', userId: userId }
      );
      return `User lacks permission for '${applicationAcronym}' acronym`;
    }
  },
};

module.exports = permissionHelpers;
