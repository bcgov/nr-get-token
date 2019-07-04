const axios = require('axios');
const config = require('config');
const log = require('npmlog');

const utils = require('./utils');

// Constructs a WebADE Application Configuration based on the request body
// TODO: Refactor this to not take a response body -> instead taking in explicit variable parameters
function buildWebAdeCfg(requestBody) {
  const configForm = requestBody.configForm;
  const generatedPassword = utils.generateEncryptPassword(requestBody.passwordPublicKey);
  const defaultAppCfg = {
    '@type': 'http://webade.gov.bc.ca/applicationConfiguration',
    applicationAcronym: '',
    custodianNumber: 0,
    applicationName: '',
    applicationDescription: '',
    applicationObjectPrefix: null,
    enabledInd: true,
    distributeTypeCd: null,
    managementEnabledInd: false,
    applicationVersion: null,
    reportedWebadeVersion: null,
    actions: [],
    roles: [],
    wdePreferences: [],
    applicationPreferences: [],
    globalPreferences: [],
    defaultUserPreferences: [],
    profiles: [],
    serviceClients: [],
    groupAuthorizations: []
  };

  // Set up the conditional JSON structure based on user entry
  const newAppCfg = {
    applicationAcronym: configForm.applicationAcronym,
    applicationName: configForm.applicationName,
    applicationDescription: configForm.applicationDescription
  };

  if (!configForm.applicationAcronym) {
    newAppCfg.serviceClients = [];
  } else {
    newAppCfg.serviceClients = [{
      accountName: `${newAppCfg.applicationAcronym}_SERVICE_CLIENT`,
      secret: '',
      oauthScopes: [],
      oauthGrantTypes: [],
      oauthRedirectUrls: [],
      oauthAccessTokenValidity: null,
      oauthRefreshTokenValidity: null,
      oauthAdditionalInformation: '{"autoapprove":"true"}',
      authorizations: []
    }];

    // Set up password
    newAppCfg.serviceClients[0].secret = generatedPassword.password;

    if (!configForm.commonServices || !configForm.commonServices.length) {
      newAppCfg.serviceClients[0].authorizations = [];
    } else {
      newAppCfg.actions = [
        {
          name: `${newAppCfg.applicationAcronym}_ACTION`,
          description: `${newAppCfg.applicationAcronym} action`,
          privilegedInd: false
        }
      ];

      newAppCfg.roles = [
        {
          name: `${newAppCfg.applicationAcronym}_ROLE`,
          description: `${newAppCfg.applicationAcronym} Role`,
          actionNames: [
            `${newAppCfg.applicationAcronym}_ACTION`
          ]
        }
      ];

      newAppCfg.profiles = [
        {
          name: `${newAppCfg.applicationAcronym}_PROFILE`,
          description: `Can send an email with the ${newAppCfg.applicationAcronym} app`,
          secureByOrganization: false,
          availibleTo: [
            'SCL'
          ],
          effectiveDate: 1506582000000,
          expiryDate: 253402243200000,
          profileRoles: [
            {
              applicationCode: newAppCfg.applicationAcronym,
              name: `${newAppCfg.applicationAcronym}_ROLE`
            },
            {
              applicationCode: 'CMSG',
              name: 'SENDER'
            }
          ]
        }
      ];

      newAppCfg.serviceClients[0].authorizations = [{
        profileName: `${newAppCfg.applicationAcronym}_PROFILE`,
        profileDescription: 'Test profile description',
        effectiveDate: 1506629523000,
        expiryDate: 253402243200000,
        enabled: true
      }];
    }
  }

  const finalCfg = { ...defaultAppCfg, ...newAppCfg };

  return {
    webAdeCfg: finalCfg,
    unencryptedPassword: generatedPassword.password,
    encryptedPassword: generatedPassword.encryptedPassword
  };
}

// TODO: Refactor this to not take a response body -> instead taking in explicit variable parameters
async function postAppConfig(body) {
  const webadeEnv = body.configForm.webadeEnvironment;
  const endpoint = config.get(`serviceClient.getok${utils.toPascalCase(webadeEnv)}.endpoint`);
  const username = config.get(`serviceClient.getok${utils.toPascalCase(webadeEnv)}.username`);
  const password = config.get(`serviceClient.getok${utils.toPascalCase(webadeEnv)}.password`);

  // Get a token with the getok service client
  const token = await utils.getWebAdeToken(username, password, 'WEBADE-REST', webadeEnv);
  if (!token || token.error) {
    throw new Error('Unable to acquire access_token');
  }

  // Build the app config
  const generatedConfig = buildWebAdeCfg(body);

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
    log.verbose('postAppConfig', utils.prettyStringify(webAdeResponse.data));

    const reponse = {
      webAdeResponse: webAdeResponse.data,
      generatedPassword: generatedConfig.webAdeCfg.serviceClients ? generatedConfig.encryptedPassword : '',
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
