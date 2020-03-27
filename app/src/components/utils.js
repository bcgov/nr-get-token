const axios = require('axios');
const config = require('config');
const log = require('npmlog');
const qs = require('querystring');

const utils = {
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
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
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
  },
};

module.exports = utils;
