const axios = require('axios');
const config = require('config');
const jwt = require('jsonwebtoken');
const log = require('npmlog');

const utils = require('./utils');

const checks = {
  getWebAdeOauth2Status: async (webadeEnv = 'INT') => {
    const result = {
      authenticated: false,
      authorized: false,
      endpoint: config.get(`serviceClient.getok${utils.toPascalCase(webadeEnv)}.endpoint`),
      healthCheck: false,
      name: `WebADE API (${webadeEnv})`
    };

    try {
      const username = config.get(`serviceClient.getok${utils.toPascalCase(webadeEnv)}.username`);
      const password = config.get(`serviceClient.getok${utils.toPascalCase(webadeEnv)}.password`);
      const webAdeResponse = await utils.getWebAdeToken(username, password, 'WEBADE-REST', webadeEnv);

      result.healthCheck = !!webAdeResponse;
      result.authenticated = 'access_token' in webAdeResponse;
      result.authorized = 'scope' in webAdeResponse && webAdeResponse.scope.includes('WEBADE-REST.UPDATEAPPLICATIONS');
    } catch (error) {
      log.error('getWebAdeOauth2Status', error.message);
    }

    return result;
  },

  getChesStatus: async () => {
    const username = config.get('serviceClient.ches.username');
    const password = config.get('serviceClient.ches.password');
    const tokenEndpoint = config.get('serviceClient.ches.tokenEndpoint');

    const result = {
      authenticated: false,
      authorized: false,
      endpoint: config.get('serviceClient.ches.healthEndpoint'),
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
          await axios.get(result.endpoint, {
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
    checks.getWebAdeOauth2Status('INT'),
    checks.getWebAdeOauth2Status('TEST'),
    checks.getWebAdeOauth2Status('PROD'),
    checks.getChesStatus()
  ])
};

module.exports = checks;
