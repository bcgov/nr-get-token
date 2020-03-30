const config = require('config');

const KeyCloakServiceClientManager = require('./keyCloakServiceClientMgr');
const RealmAdminService = require('./realmAdminSvc');

const clients = {

  /**
 * @function getClientsFromEnv
 * Utility function to call the KC service to get service clients for a KC realm
 * @param {string} kcEnv The KC env
 * @returns {object[]} An array of service clients
 */
  getClientsFromEnv: async (kcEnv) => {

    const realmKey = `serviceClient.keycloak.${kcEnv}`;
    const {
      endpoint: realmBaseUrl,
      username: clientId,
      password: clientSecret,
      realm: realmId
    } = config.get(realmKey);

    const realmSvc = new RealmAdminService({ realmBaseUrl, clientId, clientSecret, realmId });
    const kcScMgr = new KeyCloakServiceClientManager(realmSvc);

    var clients = kcScMgr.fetchAllClients();
    clients.then(result => {
      // add a keycloak environment label to each service client object in the array
      result.forEach(function (cl) {
        cl.environment = kcEnv;
      });
    });

    return clients;
  }

};

module.exports = clients;
