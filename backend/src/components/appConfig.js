const axios = require('axios');
const config = require('config');
const log = require('npmlog');

const {
  lifecycleService
} = require('../services');
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

  /**
   * Send an application configuration json to the specified webade system.
   * @param {object} configForm - The specifications from which to create the webade config.
   * @param {string} publicKey - The encryption key from the client side to encode the password.
   * @param {string} userId - The identifier of the user from the client side doing this webade update.
   */
  postAppConfig: async (configForm, publicKey, userId) => {
    const webadeEnv = configForm.clientEnvironment;
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

      await lifecycleService.create(configForm.applicationAcronym, generatedConfig.webAdeCfg, webadeEnv, userId);

      return {
        webAdeResponse: webAdeResponse.data,
        generatedPassword: generatedConfig.encryptedPassword,
        generatedServiceClient: generatedConfig.webAdeCfg.serviceClients[0].accountName
      };
    } catch (error) {
      log.error('postAppConfig', error.message);
      if (error.response) {
        throw new Error(`WebADE ${path} returned an error. ${JSON.stringify(error.response.data)}`);
      }
    }
  },

  /**
   * Fetch all application configurations from webade.
   * @param {string} webadeEnv - Which ISSS webade env.
   */
  getAppConfigs: async (webadeEnv) => {
    const endpoint = config.get(`serviceClient.getok${utils.toPascalCase(webadeEnv)}.endpoint`);
    const username = config.get(`serviceClient.getok${utils.toPascalCase(webadeEnv)}.username`);
    const password = config.get(`serviceClient.getok${utils.toPascalCase(webadeEnv)}.password`);

    // Get a token with the getok service client
    const token = await utils.getWebAdeToken(username, password, 'WEBADE-REST', webadeEnv);
    if (!token || token.error) {
      log.error('postAppConfig', 'Unable to acquire access_token');
      throw new Error('Unable to acquire access_token');
    }

    const path = '/applicationConfigurations';

    try {

      // Get the app configurations array
      const webAdeUrl = endpoint + path;
      const webAdeResponse = await axios.get(webAdeUrl, {
        headers: {
          'Authorization': `Bearer ${token.access_token}`,
          'Content-Type': 'application/json; charset=utf-8'
        }
      });
      log.verbose('getAppConfigs', utils.prettyStringify(webAdeResponse.data));
      return webAdeResponse.data;
    } catch (error) {
      log.error('getAppConfigs', error.message);
      if (error.response) {
        log.error('getAppConfigs', error.response.status);
        throw new Error(`WebADE ${path} returned an error. ${JSON.stringify(error.response.data)}`);
      }
    }
  },

  /**
   * Fetch a specific acronym's application configurations from webade.
   * @param {string} webadeEnv - Which ISSS webade env.
   * @param {string} applicationAcronym - The app specifier.
   */
  getAppConfig: async (webadeEnv, applicationAcronym) => {
    const endpoint = config.get(`serviceClient.getok${utils.toPascalCase(webadeEnv)}.endpoint`);
    const username = config.get(`serviceClient.getok${utils.toPascalCase(webadeEnv)}.username`);
    const password = config.get(`serviceClient.getok${utils.toPascalCase(webadeEnv)}.password`);

    // Get a token with the getok service client
    const token = await utils.getWebAdeToken(username, password, 'WEBADE-REST', webadeEnv);
    if (!token || token.error) {
      log.error('postAppConfig', 'Unable to acquire access_token');
      throw new Error('Unable to acquire access_token');
    }

    const path = `/applicationConfigurations/${applicationAcronym}`;

    try {

      // Get the app config for the specified acronym
      const webAdeUrl = endpoint + path;
      const webAdeResponse = await axios.get(webAdeUrl, {
        headers: {
          'Authorization': `Bearer ${token.access_token}`,
          'Content-Type': 'application/json; charset=utf-8'
        }
      });
      log.verbose('getAppConfig', utils.prettyStringify(webAdeResponse.data));
      return webAdeResponse.data;
    } catch (error) {
      log.error('getAppConfig', error.message);
      if (error.response) {
        log.error(error.response.status);
        if (error.response.status && error.response.status === 404) {
          // 404, couldn't find a config for the specified acronym, return nothing.
          return '';
        }
        throw new Error(`WebADE ${path} returned an error. ${JSON.stringify(error.response.data)}`);
      }
    }
  }
};

module.exports = appConfig;
