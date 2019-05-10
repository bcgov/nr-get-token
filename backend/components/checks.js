const axios = require('axios');
const log = require('npmlog');

const checks = {};

async function getWebAdeToken(user, password, scope) {
  const url = 'https://i1api.nrs.gov.bc.ca/oauth2/v1/oauth/token';

  try {
    const response = await axios.get(url, {
      params: {
        disableDeveloperFilter: true,
        grant_type: 'client_credentials',
        scope: scope
      },
      auth: {
        username: user,
        password: password
      }
    });

    log.info(JSON.stringify(response.data));
    return response.data.access_token;
  } catch (err) {
    log.error(err);
    return '';
  }
}

async function checkWebAdeOauth2() {
  const tmpUser = 'user';
  const tmpPwd = 'password';

  const token = await getWebAdeToken(tmpUser, tmpPwd, 'WEBADE-REST');
  log.info(`Token: ${token}`);
}

checks.getStatus = () => {
  const statuses = [];

  checkWebAdeOauth2();

  statuses.push({
    'endpoint': 'https://i1api.nrs.gov.bc.ca/webade-api/v1',
    'healthCheck': true,
    'authenticated': true,
    'authorized': true
  });

  return statuses;
};

module.exports = checks;
