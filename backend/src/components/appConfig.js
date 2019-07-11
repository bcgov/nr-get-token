const axios = require('axios');
const config = require('config');
const log = require('npmlog');

const utils = require('./utils');

const appConfig = {
  // Constructs a WebADE Application Configuration based on the request body
  // TODO: Split out WebADE and publicKey encryption into separate functions
  buildWebAdeCfg: (configForm, publicKey) => {
    const generatedPassword = utils.generateEncryptPassword(publicKey);
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

    newAppCfg.serviceClients = [{
      accountName: `${newAppCfg.applicationAcronym}_SERVICE_CLIENT`,
      secret: generatedPassword.password,
      oauthScopes: [],
      oauthGrantTypes: [],
      oauthRedirectUrls: [],
      oauthAccessTokenValidity: null,
      oauthRefreshTokenValidity: null,
      oauthAdditionalInformation: '{"autoapprove":"true"}',
      authorizations: []
    }];

    if (!configForm.commonServices || !configForm.commonServices.length) {
      newAppCfg.serviceClients[0].authorizations = [];
    } else {
      newAppCfg.actions = [{
        name: `${newAppCfg.applicationAcronym}_ACTION`,
        description: `${newAppCfg.applicationAcronym} action`,
        privilegedInd: false
      }];

      newAppCfg.roles = [{
        name: `${newAppCfg.applicationAcronym}_ROLE`,
        description: `${newAppCfg.applicationAcronym} Role`,
        actionNames: [
          `${newAppCfg.applicationAcronym}_ACTION`
        ]
      }];

      newAppCfg.profiles = [{
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
      }];

      newAppCfg.serviceClients[0].authorizations = [{
        profileName: `${newAppCfg.applicationAcronym}_PROFILE`,
        profileDescription: 'Test profile description',
        effectiveDate: 1506629523000,
        expiryDate: 253402243200000,
        enabled: true
      }];
    }

    const finalCfg = {
      ...defaultAppCfg,
      ...newAppCfg
    };

    return {
      webAdeCfg: finalCfg,
      unencryptedPassword: generatedPassword.password,
      encryptedPassword: generatedPassword.encryptedPassword
    };
  },

  postAppConfig: async (configForm, publicKey) => {
    const webadeEnv = configForm.webadeEnvironment;
    const endpoint = config.get(`serviceClient.getok${utils.toPascalCase(webadeEnv)}.endpoint`);
    const username = config.get(`serviceClient.getok${utils.toPascalCase(webadeEnv)}.username`);
    const password = config.get(`serviceClient.getok${utils.toPascalCase(webadeEnv)}.password`);

    // Get a token with the getok service client
    const token = await utils.getWebAdeToken(username, password, 'WEBADE-REST', webadeEnv);
    if (!token || token.error) {
      log.error('postAppConfig', 'Unable to acquire access_token');
      throw new Error('Unable to acquire access_token');
    }

    // Build the app config
    const generatedConfig = appConfig.buildWebAdeCfg(configForm, publicKey);

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

      return {
        webAdeResponse: webAdeResponse.data,
        generatedPassword: generatedConfig.encryptedPassword,
        generatedServiceClient: generatedConfig.webAdeCfg.serviceClients[0].accountName
      };
    } catch (error) {
      log.error('postAppConfig', error.message);
      throw new Error(`WebADE ${path} returned an error. ${JSON.stringify(error.response.data)}`);
    }
  }
};

module.exports = appConfig;
