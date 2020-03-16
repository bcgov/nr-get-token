const axios = require('axios');
const log = require('npmlog');
const qs = require('querystring');

const utils = {
  /**
   * @function getKeyCloakToken
   * Returns the response body of a keycloak token request
   * @param {string} username The client username
   * @param {string} password The client password
   * @param {string} tokenEndpoint URL of the Keycloak token endpoint
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
};

module.exports = utils;
