const log = require('npmlog');

const utils = require('./utils');

const acronyms = {
  /**
   * @function getUserAcronymClients
   * Returns all service clients for all acronyms associated with a user
   * @param {string} acronym The Keycloak user GUID
   * @returns {object[]} An array of user acronym objects, null if `keycloakId` doesn't exist
   */
  getAcronymClients: async acronym => {
    log.debug('getAcronymClients', `getting clients for ${acronym}`);
    const makeItAnArray = [acronym];
    const [devClients, testClients, prodClients] = await Promise.all([
      utils.getClientsFromEnv('dev', makeItAnArray),
      utils.getClientsFromEnv('test', makeItAnArray),
      utils.getClientsFromEnv('prod', makeItAnArray)
    ]);

    const dc = devClients.find(cl => cl.clientId === `${acronym}_SERVICE_CLIENT`);
    const tc = testClients.find(cl => cl.clientId === `${acronym}_SERVICE_CLIENT`);
    const pc = prodClients.find(cl => cl.clientId === `${acronym}_SERVICE_CLIENT`);

    return {
      acronym: acronym,
      dev: dc ? dc : null,
      test: tc ? tc : null,
      prod: pc ? pc : null
    };
  }
};

module.exports = acronyms;
