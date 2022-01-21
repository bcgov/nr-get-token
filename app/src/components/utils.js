const axios = require('axios');
const config = require('config');
const log = require('./log')(module.filename);
const qs = require('querystring');

const KeyCloakServiceClientManager = require('./keyCloakServiceClientMgr');
const RealmAdminService = require('./realmAdminSvc');

const utils = {
  /**
   * @function getClientsFromEnv
   * Utility function to call the KC service to get clients for each realm which requires newing it for each realm
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
      realm: realmId,
    } = config.get(realmKey);
    const realmSvc = new RealmAdminService({
      realmBaseUrl,
      clientId,
      clientSecret,
      realmId,
    });
    const kcScMgr = new KeyCloakServiceClientManager(realmSvc);
    return kcScMgr.fetchClients(acronyms);
  },

  /**
   * @function getKeyCloakToken
   * Returns the response body of a keycloak token request
   * @param {string} username The client username
   * @param {string} password The client password
   * @param {string} tokenEndpoint URL of the Keycloak token endpoint
   * @returns {object} An object representing the response body
   */
  getKeyCloakToken: async (username, password, tokenEndpoint) => {
    try {
      const response = await axios.post(
        tokenEndpoint,
        qs.stringify({
          grant_type: 'client_credentials',
        }),
        {
          method: 'POST',
          auth: {
            username: username,
            password: password,
          },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );

      log.verbose('Keycloak response', { function: 'getKeyCloakToken', data: response.data });
      return response.data;
    } catch (error) {
      log.error(JSON.stringify(error), { function: 'getKeyCloakToken' });
      log.error(error.message, { function: 'getKeyCloakToken' });
      return error.response.data;
    }
  },
};

module.exports = utils;
