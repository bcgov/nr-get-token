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
  },

  /**
   * @function getUserAcronymClients
   * Returns all service clients for all acronyms associated with a user
   * @param {string} keycloakId The Keycloak user GUID
   * @returns {object[]} An array of user acronym objects, null if `keycloakId` doesn't exist
   */
  getUserAcronymClients: async keycloakId => {
    const user = await userService.find(keycloakId);
    if (!user) return null;

    const acronyms = await userService.userAcronymList(keycloakId);
    if (!acronyms || !Array.isArray(acronyms) || !acronyms.length) {
      return [];
    }

    return [{
      acronym: 'WORG',
      dev: {
        clientId: 'WORG_SERVICE_CLIENT',
        enabled: true
      },
      test: {
        clientId: 'WORG_SERVICE_CLIENT',
        enabled: true
      }
    }, {
      acronym: 'MSSC',
      dev: {
        clientId: 'MSSC_SERVICE_CLIENT',
        enabled: true
      },
      test: {
        clientId: 'MSSC_SERVICE_CLIENT',
        enabled: false
      }
    }];
  }
};

module.exports = users;
