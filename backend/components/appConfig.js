const axios = require('axios');
const config = require('config');
const log = require('npmlog');

const utils = require('./utils');

async function postAppConfig(body) {
  // Get a token with the getok service client
  const username = config.get('serviceClient.getok.username');
  const password = config.get('serviceClient.getok.password');
  const token = await utils.getWebAdeToken(username, password, 'WEBADE-REST');
  if (!token || token.error) {
    throw new Error('Unable to acquire access_token');
  }

  // Build the app config
  const generatedConfig = utils.buildWebAdeCfg(body);

  // Submit the app config to webade
  const endpoint = config.get('serviceClient.getok.endpoint');
  const path = '/applicationConfigurations';
  const webAdeUrl = endpoint + path;
  try {
    const webAdeResponse = await axios.post(webAdeUrl, generatedConfig.webAdeCfg, {
      headers: {
        'Authorization': `Bearer ${token.access_token}`,
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
    log.verbose(arguments.callee.name, utils.prettyStringify(webAdeResponse.data));

    const reponse = {
      webAdeResponse: webAdeResponse.data,
      generatedPassword: generatedConfig.webAdeCfg.serviceClients ? generatedConfig.encyptedPassword : ''
    };
    return reponse;

  } catch (e) {
    throw new Error(`WebADE ${path} returned an error. ${JSON.stringify(e.response.data)}`);
  }
}

const appConfig = {
  postAppConfig: (body) => postAppConfig(body)
};

module.exports = appConfig;
