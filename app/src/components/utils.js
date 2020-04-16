const axios = require('axios');
const config = require('config');
const cryptico = require('cryptico-js');
const generator = require('generate-password');
const log = require('npmlog');
const qs = require('querystring');

const KeyCloakServiceClientManager = require('./keyCloakServiceClientMgr');
const RealmAdminService = require('./realmAdminSvc');

const utils = {

  /**
  * From the big list of webade configs, return all APPLICATION preferences that match the search critera in the name that are not masked
  * @param {string} webadeConfigsList - The array of all the webade configs.
  * @param {string} searchCriteria - The regex to search through the preference name on.
  */
  filterForInsecurePrefs: (webadeConfigsList, searchCriteria) => {
    if (webadeConfigsList && webadeConfigsList.applicationConfigurations
      && webadeConfigsList.applicationConfigurations.length) {
      // From all the configs, get out the preferences
      // filter on the search criteria and the sensitiveDataInd field
      const regex = new RegExp(searchCriteria, 'gi');
      const applications = webadeConfigsList.applicationConfigurations.map(apps =>
        ({
          applicationAcronym: apps.applicationAcronym,
          applicationName: apps.applicationName,
          applicationDescription: apps.applicationDescription,
          enabled: apps.enabledInd,
          preferences: apps.applicationPreferences.filter(pref =>
            pref.sensitiveDataInd == false &&
            pref.name.match(regex)
          )
        }));
      const filteredPrefs = applications.filter(app =>
        app.preferences && app.preferences.length
      );

      // Return the list of objects sorted alphabetically
      return filteredPrefs.sort((a, b) => a.applicationAcronym.localeCompare(b.applicationAcronym));
    } else {
      log.error('filterForInsecurePrefs', 'Error in supplied webade configuration list');
      throw new Error('Unable to fetch preferences - Error in supplied webade configuration list');
    }
  },

  /**
  * From the big list of webade configs, return mapped dependencies for a specific acronym
  * @param {string} webadeConfigsList - The array of all the webade configs.
  * @param {string} acronym - Which acronym to filter on.
  */
  filterWebAdeDependencies: (webadeConfigsList, acronym) => {
    if (webadeConfigsList && webadeConfigsList.applicationConfigurations) {
      // From all the configs, find the ones where
      const appsWithDependencies = webadeConfigsList.applicationConfigurations.filter(
        cfg => cfg.profiles.some(
          prof => prof.profileRoles.some(
            pr => pr.applicationCode == acronym)
        )
      );
      // Map out the relevant values we want from the app configs
      const dependencies = appsWithDependencies.map(apps =>
        ({
          applicationAcronym: apps.applicationAcronym,
          applicationName: apps.applicationName,
          applicationDescription: apps.applicationDescription,
          enabled: apps.enabledInd
        }));
      // Return the list of objects sorted alphabetically
      return dependencies.sort((a, b) => a.applicationAcronym.localeCompare(b.applicationAcronym));
    } else {
      log.error('filterWebAdeDependencies', 'Error in supplied webade configuration list');
      throw new Error('Unable to fetch dependencies - Error in supplied webade configuration list');
    }
  },

  // Creates a random password of a certain length and encrypts it with the key
  generateEncryptPassword: (key, len = 12) => {
    const pw = generator.generate({
      length: len,
      numbers: true
    });

    return {
      password: pw,
      encryptedPassword: cryptico.encrypt(pw, key).cipher
    };
  },

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
      realm: realmId
    } = config.get(realmKey);
    const realmSvc = new RealmAdminService({ realmBaseUrl, clientId, clientSecret, realmId });
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
      const response = await axios.post(tokenEndpoint, qs.stringify({
        grant_type: 'client_credentials'
      }), {
        method: 'POST',
        auth: {
          username: username,
          password: password
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      log.verbose('utils.getKeyCloakToken', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      log.error(JSON.stringify(error));
      log.error('utils.getKeyCloakToken', error.message);
      return error.response.data;
    }
  },

  /**
   * @function getWebAdeToken
   * Returns the response body of a webade oauth token request
   * @param {string} username The client username
   * @param {string} password The client password
   * @param {string} scope The requested scope
   * @param {string} [webadeEnv='int'] The requested webade environment
   * @returns {object} An object representing the response body
   */
  getWebAdeToken: async (username, password, scope, webadeEnv = 'int') => {
    const endpoint = config.get(`serviceClient.webAde.${webadeEnv}.endpoint`);
    const url = endpoint.replace('webade-api', 'oauth2') + '/oauth/token';

    try {
      const response = await axios.get(url, {
        auth: {
          username: username,
          password: password
        },
        params: {
          disableDeveloperFilter: true,
          grant_type: 'client_credentials',
          scope: scope
        }
      });

      log.verbose('getWebAdeToken', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      log.error('getWebAdeToken', error.message);
      return error.response.data;
    }
  }
};

module.exports = utils;
