const config = require('config');
const log = require('npmlog');

const utils = require('./utils');

async function getWebAdeOauth2Status() {
  const username = config.get('serviceClient.getok.username');
  const password = config.get('serviceClient.getok.password');

  const result = {
    endpoint: config.get('serviceClient.getok.endpoint'),
    healthCheck: false,
    authenticated: false,
    authorized: false
  };

  try {
    const response = await utils.getWebAdeToken(username, password, 'WEBADE-REST');
    result.healthCheck = !!response;
    result.authenticated = 'access_token' in response;
    result.authorized = 'scope' in response && response.scope.includes('WEBADE-REST.UPDATEAPPLICATIONS');

    return result;
  } catch (error) {
    log.error(error);
    return result;
  }
}

const checks = {
  getStatus: async () => {
    const statuses = [];

    statuses.push(await getWebAdeOauth2Status());

    return statuses;
  }
};

module.exports = checks;
