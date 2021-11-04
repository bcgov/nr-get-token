const config = require('config');

const acronyms = require('./acronyms');
const KeyCloakServiceClientManager = require('./keyCloakServiceClientMgr');
const RealmAdminService = require('./realmAdminSvc');

const { deploymentHistoryService } = require('../services');

const clients = {
  /**
   * @function addAppDetails
   * Add various application details for each service client from db
   * @param {object} serviceClients An object with all service clients as keys
   * @returns {object[]} An array of service clients
   */
  addAppDetails: serviceClients => {
    // get a promise for each service client
    return Promise.all(Object.keys(serviceClients).map(async key => {
      const sc = serviceClients[key];

      // app details
      const acronymObj = await acronyms.getAcronym(sc.acronym);

      // if a corresponding acronym in db
      if (acronymObj) {
        sc.acronymDetails = acronymObj.dataValues;

        // promotions (from deployment history table)
        const promotions = await deploymentHistoryService.findLatestPromotions(sc.acronymDetails.acronymId);

        promotions.forEach(promotion => {
          if (promotion.length) {
            const data = promotion[0].dataValues;
            if (sc.environments[data.env]) {
              sc.environments[data.env].created = data.createdAt;
            }
          }
        });

        sc.users = await acronyms.getUsers(sc.acronym);
      }

      return sc;
    }));
  },

  /**
   * @function getAllServiceClients
   * Aggregates all known service clients with additional context information
   * @returns {object[]} An array of service clients with additional data
   */
  getAllServiceClients: async () => {
    // get service clients for each realm
    const serviceClients = await Promise.all([
      clients.getClientsFromEnv('dev'),
      clients.getClientsFromEnv('test'),
      clients.getClientsFromEnv('prod')
    ]);
    // join them all into one array
    const allServiceClients = serviceClients.flat();

    // reformat data to show in our data table of service clients
    const reduced = allServiceClients.reduce((a, b) => {
      // If this type wasn't previously stored
      if (!a[b.clientId]) {
        // create array placeholder
        a[b.clientId] = {
          acronym: b.clientId.replace('_SERVICE_CLIENT', ''),
          clientId: b.clientId,
          name: b.name,
          environments: {
          },
          acronymDetails: {
          }
        };
      }
      // add array of environment data to a property
      a[b.clientId].environments[b.environment.toUpperCase()] = {
        name: b.name
      };
      return a;
    }, {});

    return clients.addAppDetails(reduced);
  },

  /**
   * @function getClientsFromEnv
   * Utility function to call the KC service to get service clients for a KC realm
   * @param {string} kcEnv The KC env
   * @returns {object[]} An array of service clients
   */
  getClientsFromEnv: async kcEnv => {
    const realmKey = `serviceClient.keycloak.${kcEnv}`;
    const {
      endpoint: realmBaseUrl,
      username: clientId,
      password: clientSecret,
      realm: realmId
    } = config.get(realmKey);

    const realmSvc = new RealmAdminService({ realmBaseUrl, clientId, clientSecret, realmId });
    const kcScMgr = new KeyCloakServiceClientManager(realmSvc);

    const clients = await kcScMgr.fetchAllClients();
    // add a keycloak environment label to each service client object in the array
    clients.forEach(cl => cl.environment = kcEnv);

    return clients;
  }
};

module.exports = clients;
