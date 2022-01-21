const config = require('config');
const log = require('./log')(module.filename);

const KeyCloakServiceClientManager = require('./keyCloakServiceClientMgr');
const RealmAdminService = require('./realmAdminSvc');
const { userService } = require('../services');
const utils = require('./utils');

const users = {
  /**
   * @function getAllGetokUsers
   * Returns all the users in the keycloak realm that the GETOK api is running on. Use the api's client to call realm api
   * @returns {object[]} An array of user objects
   */
  getAllGetokUsers: async () => {
    log.verbose('getAllGetokUsers');
    const {
      serverUrl: authUrl,
      clientId: clientId,
      clientSecret: clientSecret,
      realm: realmId,
    } = config.get('server.keycloak');
    const realmBaseUrl = authUrl.replace('/auth', '');
    const realmSvc = new RealmAdminService({
      realmBaseUrl,
      clientId,
      clientSecret,
      realmId,
    });
    const kcScMgr = new KeyCloakServiceClientManager(realmSvc);
    return kcScMgr.findUsers();
  },

  /**
   * @function getUserAcronyms
   * Returns acronyms associated with a user
   * @param {string} keycloakId The Keycloak user GUID
   * @returns {object[]} An array of user acronym objects, null if `keycloakId` doesn't exist
   */
  getUserAcronyms: async (keycloakId) => {
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
  getUserAcronymClients: async (keycloakId) => {
    const user = await userService.find(keycloakId);
    if (!user) return null;

    const acronymsFromDb = await userService.userAcronymList(keycloakId);
    if (
      !acronymsFromDb ||
      !Array.isArray(acronymsFromDb) ||
      !acronymsFromDb.length
    ) {
      return [];
    }
    const acronyms = acronymsFromDb.map((acr) => acr.acronym);
    log.debug(`Acronyms for user: ${JSON.stringify(acronyms)}`, {
      function: 'getUserAcronymClients',
    });

    const [devClients, testClients, prodClients] = await Promise.all([
      utils.getClientsFromEnv('dev', acronyms),
      utils.getClientsFromEnv('test', acronyms),
      utils.getClientsFromEnv('prod', acronyms),
    ]);

    return acronyms.map((acr) => {
      const dc = devClients.find(
        (cl) => cl.clientId === `${acr}_SERVICE_CLIENT`
      );
      const tc = testClients.find(
        (cl) => cl.clientId === `${acr}_SERVICE_CLIENT`
      );
      const pc = prodClients.find(
        (cl) => cl.clientId === `${acr}_SERVICE_CLIENT`
      );

      return {
        acronym: acr,
        dev: dc ? dc : null,
        test: tc ? tc : null,
        prod: pc ? pc : null,
      };
    });
  },
};

module.exports = users;
