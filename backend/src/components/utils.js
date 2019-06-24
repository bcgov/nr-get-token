const axios = require('axios');
const config = require('config');
const log = require('npmlog');
const cryptico = require('cryptico-js');
const generator = require('generate-password');

const discovery = null;

const utils = {
  // Returns the response body of a webade oauth token request
  async getWebAdeToken(username, password, scope, webadeEnv = 'INT') {
    const path = '/oauth/token';
    const endpoint = config.get(`serviceClient.getok${utils.toPascalCase(webadeEnv)}.endpoint`);
    const url = endpoint.replace('webade-api', 'oauth2') + path;

    try {
      const response = await axios.get(url, {
        auth: {
          username: username,
          password: password
        },
        params: {
          disableDeveloperFilter: true,
          grant_type: 'client_credentials',
          scope: scope
        }
      });

      log.verbose('getWebAdeToken', utils.prettyStringify(response.data));
      return response.data;
    } catch (error) {
      log.error('getWebAdeToken', error.message);
      return error.response.data;
    }
  },

  // Returns OIDC Discovery values
  async getOidcDiscovery() {
    if (discovery) {
      return discovery;
    } else {
      try {
        const response = await axios.get(config.get('oidc.discovery'));

        log.verbose('getOidcDiscovery', utils.prettyStringify(response.data));
        return response.data;
      } catch (error) {
        log.error('getOidcDiscovery', `OIDC Discovery failed - ${error.message}`);
        return error.response.data;
      }
    }
  },

  // Constructs a WebADE Application Configuration based on the request body
  buildWebAdeCfg: requestBody => {
    const configForm = requestBody.configForm;
    const generatedPassword = utils.generatePassword(requestBody.passwordPublicKey);
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

    const ret = {
      webAdeCfg: finalCfg,
      unencryptedPassword: generatedPassword.password,
      encyptedPassword: generatedPassword.encyptedPassword
    };
    return ret;
  },

  // Creates a random password
  generatePassword: key => {
    const pw = generator.generate({
      length: 12,
      numbers: true
    });
    const result = {
      password: pw,
      encyptedPassword: cryptico.encrypt(pw, key).cipher
    };
    return result;
  },

  // Returns a pretty JSON representation of an object
  prettyStringify: obj => JSON.stringify(obj, null, 2),

  // Returns a string in Pascal Case
  toPascalCase: str => str.toLowerCase().replace(/\b\w/g, t => t.toUpperCase())
};

module.exports = utils;
