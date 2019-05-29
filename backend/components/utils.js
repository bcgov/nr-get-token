const axios = require('axios');
const log = require('npmlog');
const cryptico = require('cryptico-js');
const generator = require('generate-password');

const utils = {
  // Returns the response body of a webade oauth token request
  getWebAdeToken: async (username, password, scope) => {
    const url = 'https://i1api.nrs.gov.bc.ca/oauth2/v1/oauth/token';

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

      log.verbose('Utils', `WebAde Token: ${utils.prettyStringify(response.data)}`);
      return response.data;
    } catch (error) {
      log.error(error);
      return error.response.data;
    }
  },
  buildWebAdeCfg: (requestBody) => {
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
      encyptedPassword: generatedPassword.encyptedPassword
    };
    return ret;
  },
  generatePassword: (key) => {
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
  prettyStringify: obj => JSON.stringify(obj, null, 2)
};

module.exports = utils;
