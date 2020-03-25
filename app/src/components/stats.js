const config = require('config');
//const log = require('npmlog');

const KeyCloakServiceClientManager = require('./keyCloakServiceClientMgr');
const RealmAdminService = require('./realmAdminSvc');
// a service for pulling more stats from db
// const { statsService } = require('../services');

const stats = {
  /**
   * @function getAllServiceClients
   * Returns all reistered service clients and their details
   * @returns {object[]} An array of all registered service clients in each keycloak realm
   */
  getAllServiceClients: async () => {

    // get all service clients for each realm
    const [devClients, testClients, prodClients] = await Promise.all([ // eslint-disable-line no-unused-vars
      stats.getClientsFromEnv('dev'),
      stats.getClientsFromEnv('test'),
      stats.getClientsFromEnv('prod')
    ]);

    // remove those that dont match '*_SERVICE_CLIENT';
    //const regex = '.*_SERVICE_CLIENT$';
    // const dc = devClients.cl.match(regex);
    // const tc = testClients.cl.match(regex);
    // const pc = prodClients.cl.match(regex);

    // and add realm to end of each client object

    // re-arrange array to suit output in view
    // mock for now
    return [
      {
        name: 'ABC_ONE',
        created: 159,
        dev: 1,
        test: 0,
        prod: 0
      },
      {
        name: 'DEF_TWO',
        created: 237,
        dev: 1,
        test: 1,
        prod: 0
      },
      {
        name: 'HKI_THREE',
        created: 262,
        dev: 1,
        test: 0,
        prod: 0
      },
      {
        name: 'BED_FOUR',
        created: 305,
        dev: 1,
        test: 1,
        prod: 1
      }
    ];


  },




  /**
   * @function getClientsFromEnv
   * Utility function to call the KC service to get service clients for each realm
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

    return kcScMgr.fetchAllClients();
  }

};

module.exports = stats;
