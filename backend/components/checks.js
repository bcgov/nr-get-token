const axios = require('axios');
const config = require('config');
const log = require('npmlog');

const utils = require('./utils');

async function getWebAdeOauth2Status() {
  const username = config.get('serviceClient.getok.username');
  const password = config.get('serviceClient.getok.password');

  const result = {
    name: 'WebADE API',
    endpoint: config.get('serviceClient.getok.endpoint'),
    healthCheck: false,
    authenticated: false,
    authorized: false
  };

  try {
    const webAdeResponse = await utils.getWebAdeToken(username, password, 'WEBADE-REST');
    result.healthCheck = !!webAdeResponse;
    result.authenticated = 'access_token' in webAdeResponse;
    result.authorized = 'scope' in webAdeResponse && webAdeResponse.scope.includes('WEBADE-REST.UPDATEAPPLICATIONS');

    return result;
  } catch (error) {
    log.error(arguments.callee.name, error.message);
    return result;
  }
}

async function getMsscStatus() {
  const username = config.get('serviceClient.mssc.username');
  const password = config.get('serviceClient.mssc.password');

  const result = {
    name: 'Common Messaging API',
    endpoint: config.get('serviceClient.mssc.endpoint'),
    healthCheck: false,
    authenticated: false,
    authorized: false
  };


  try {
    const webAdeResponse = await utils.getWebAdeToken(username, password, 'CMSG');

    result.authorized = 'scope' in webAdeResponse &&
      webAdeResponse.scope.includes('CMSG.CREATEMESSAGE');

    if ('access_token' in webAdeResponse) {
      result.authenticated = true;

      try {
        const endpointResult = await axios.get(result.endpoint, {
          headers: {
            'Authorization': `Bearer ${webAdeResponse.access_token}`
          }
        });

        if (endpointResult.status === 200) {
          result.healthCheck = true;
        }
      } catch (error) {
        log.error(arguments.callee.name, error.message);
      }
    }

    return result;
  } catch (error) {
    log.error(arguments.callee.name, error.message);
    return result;
  }
}

const checks = {
  getStatus: () => Promise.all([
    getWebAdeOauth2Status(),
    getMsscStatus()
  ])
};

module.exports = checks;
