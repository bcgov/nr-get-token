const axios = require('axios');
const config = require('config');
const jwt = require('jsonwebtoken');
const log = require('npmlog');

const utils = require('./utils');

const checks = {
  /**
   * @function getChesStatus
   * Retrieves the ches endpoint status
   * @return {object} The status result of the ches endpoint
   */
  getChesStatus: async () => {
    const username = config.get('serviceClient.ches.username');
    const password = config.get('serviceClient.ches.password');
    const tokenEndpoint = config.get('serviceClient.ches.tokenEndpoint');

    const result = {
      authenticated: false,
      authorized: false,
      endpoint: config.get('serviceClient.ches.apiEndpoint'),
      healthCheck: false,
      name: 'Common Hosted Email Service'
    };

    try {
      const tokenResponse = await utils.getKeyCloakToken(username, password, tokenEndpoint);
      if (tokenResponse) {
        const decoded = jwt.decode(tokenResponse.access_token);
        if (decoded) {
          result.authorized = true;
          result.authenticated = decoded.resource_access.CHES.roles.includes('EMAILER');
          await axios.get(result.endpoint + '/v1/health', {
            headers: {
              'Authorization': `Bearer ${tokenResponse.access_token}`
            }
          });
          result.healthCheck = true;
        }
      }
    } catch (error) {
      log.error('getChesStatus', error.message);
    }

    return result;
  },

  getStatus: () => Promise.all([
    checks.getChesStatus()
  ])
};

module.exports = checks;
