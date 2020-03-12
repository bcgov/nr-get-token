const { userService } = require('../services');

const users = {
  /**
   * @function getUserAcronyms
   * Returns acronyms associated with a user
   * @param {string} keycloakId The Keycloak user GUID
   * @returns {object[]} An array of user acronym objects, null if `keycloakId` doesn't exist
   */
  getUserAcronyms: async keycloakId => {
    const user = await userService.find(keycloakId);
    if (!user) return null;

    const acronyms = await userService.userAcronymList(keycloakId);
    return Array.isArray(acronyms) ? acronyms : [];
  }
};

module.exports = users;
