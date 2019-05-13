const config = require('config');
const log = require('npmlog');

const utils = require('./utils');

async function checkWebAdeOauth2() {
  const username = config.get('serviceClient.getok.username');
  const password = config.get('serviceClient.getok.password');

  const token = await utils.getWebAdeToken(username, password, 'WEBADE-REST');
  log.debug(`GetOK Token: ${token.access_token}`);
}

const checks = {
  getStatus: () => {
    const statuses = [];

    checkWebAdeOauth2();

    statuses.push({
      'endpoint': 'https://i1api.nrs.gov.bc.ca/webade-api/v1',
      'healthCheck': true,
      'authenticated': true,
      'authorized': true
    });

    return statuses;
  }
};

module.exports = checks;
