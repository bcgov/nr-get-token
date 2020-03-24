const config = require('config');
const log = require('npmlog');

const KeyCloakServiceClientManager = require('./keyCloakServiceClientMgr');
const RealmAdminService = require('./realmAdminSvc');
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

    const acronymsFromDb = await userService.userAcronymList(keycloakId);
    if (!acronymsFromDb || !Array.isArray(acronymsFromDb) || !acronymsFromDb.length) {
      return [];
    }
    const acronyms = acronymsFromDb.map(acr => acr.acronym);
    log.debug('getUserAcronymClients', `Acronyms for user: ${JSON.stringify(acronyms)}`);

    const [devClients, testClients, prodClients] = await Promise.all([
      users.getClientsFromEnv('dev', acronyms),
      users.getClientsFromEnv('test', acronyms),
      users.getClientsFromEnv('prod', acronyms)
    ]);

    return acronyms.map(acr => {
      const dc = devClients.find(cl => cl.clientId === `${acr}_SERVICE_CLIENT`);
      const tc = testClients.find(cl => cl.clientId === `${acr}_SERVICE_CLIENT`);
      const pc = prodClients.find(cl => cl.clientId === `${acr}_SERVICE_CLIENT`);

      return {
        acronym: acr,
        dev: dc ? dc : null,
        test: tc ? tc : null,
        prod: pc ? pc : null
      };
    });
  },
  /**
   * @function getClientsFromEnv
   * Utility function to call the KC service to get clients for each realm
   * @param {string} kcEnv The KC env
   * @param {string} acronyms The acronyms to get clients for
   * @returns {object[]} An array of service clients
   */
  getClientsFromEnv: async (kcEnv, acronyms) => {
    const realmKey = `serviceClient.keycloak.${kcEnv}`;
    const {
      endpoint: realmBaseUrl,
      username: clientId,
      password: clientSecret,
      realm: realmId
    } = config.get(realmKey);
    const realmSvc = new RealmAdminService({ realmBaseUrl, clientId, clientSecret, realmId });
    const kcScMgr = new KeyCloakServiceClientManager(realmSvc);
    return kcScMgr.fetchClients(acronyms);
  }
};

module.exports = users;
