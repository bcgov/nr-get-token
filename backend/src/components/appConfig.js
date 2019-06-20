const axios = require('axios');
const config = require('config');
const log = require('npmlog');

const utils = require('./utils');

async function postAppConfig(body) {
  const username = config.get('serviceClient.getok.username');
  let password = '';
  let endpoint = '';
  const webadeEnv = body.configForm.webadeEnvironment;
  if (webadeEnv === 'INT') {
    endpoint = config.get('serviceClient.getok.endpointInt');
    password = config.get('serviceClient.getok.passwordInt');
  } else if (webadeEnv === 'TEST') {
    endpoint = config.get('serviceClient.getok.endpointTest');
    password = config.get('serviceClient.getok.passwordTest');
  } else if (webadeEnv === 'PROD') {
    endpoint = config.get('serviceClient.getok.endpointProd');
    password = config.get('serviceClient.getok.passwordProd');
  } else {
    throw new Error(`WebADE environment ${webadeEnv} is not supported.`);
  }

  // Get a token with the getok service client
  const token = await utils.getWebAdeToken(username, password, 'WEBADE-REST', webadeEnv);
  if (!token || token.error) {
    throw new Error('Unable to acquire access_token');
  }

  // Build the app config
  const generatedConfig = utils.buildWebAdeCfg(body);

  // Submit the app config to webade
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
      generatedPassword: generatedConfig.webAdeCfg.serviceClients ? generatedConfig.encyptedPassword : '',
      generatedServiceClient: generatedConfig.webAdeCfg.serviceClients ? generatedConfig.webAdeCfg.serviceClients[0].accountName : ''
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
