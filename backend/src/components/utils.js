const axios = require('axios');
const config = require('config');
const cryptico = require('cryptico-js');
const generator = require('generate-password');
const log = require('npmlog');
const qs = require('querystring');

let discovery = null;

const utils = {
  // Returns the response body of a webade oauth token request
  async getWebAdeToken(username, password, scope, webadeEnv = 'INT') {
    const path = '/oauth/token';
    const endpoint = config.get(`serviceClient.getok${utils.toPascalCase(webadeEnv)}.endpoint`);
    const url = endpoint.replace('webade-api', 'oauth2') + path;

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

      log.verbose('getWebAdeToken', utils.prettyStringify(response.data));
      return response.data;
    } catch (error) {
      log.error('getWebAdeToken', error.message);
      return error.response.data;
    }
  },

  // Returns the response body of a keycloak token request
  async getKeyCloakToken(username, password, tokenEndpoint) {
    try {
      const requestBody = {
        grant_type: 'client_credentials'
      };

      const options = {
        method: 'POST',
        auth: {
          username: username,
          password: password
        },
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      };

      const response = await axios.post(tokenEndpoint, qs.stringify(requestBody), options);
      log.verbose('getKeyCloakToken', utils.prettyStringify(response.data));
      return response.data;
    } catch (error) {
      log.error(JSON.stringify(error));
      log.error('getKeyCloakToken', error.message);
      return error.response.data;
    }
  },

  // Returns OIDC Discovery values
  async getOidcDiscovery() {
    if (!discovery) {
      try {
        const response = await axios.get(config.get('oidc.discovery'));

        log.verbose('getOidcDiscovery', utils.prettyStringify(response.data));
        discovery = response.data; // eslint-disable-line require-atomic-updates
      } catch (error) {
        log.error('getOidcDiscovery', `OIDC Discovery failed - ${error.message}`);
      }
    }

    return discovery;
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

  // Returns a pretty JSON representation of an object
  prettyStringify: (obj, indent = 2) => JSON.stringify(obj, null, indent),

  // Returns a string in Pascal Case
  toPascalCase: str => str.toLowerCase().replace(/\b\w/g, t => t.toUpperCase()),

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
  }
};

module.exports = utils;
