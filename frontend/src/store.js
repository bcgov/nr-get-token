import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: '',
    configSubmissionSuccess: '',
    configSubmissionError: '',
    userAppCfg: {
      applicationAcronym: '',
      applicationName: '',
      applicationDescription: '',
      commonServices: [],
      userEnteredPassword: '',
      deploymentMethod: ''
    }
  }, getters: {
    token: state => state.token,
    configSubmissionSuccess: state => state.configSubmissionSuccess,
    configSubmissionError: state => state.configSubmissionError,
    appConfigAsString: state => {
      // these are the hardcoded WebADE cfg values users do not enter
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
        applicationAcronym: state.userAppCfg.applicationAcronym,
        applicationName: state.userAppCfg.applicationName,
        applicationDescription: state.userAppCfg.applicationDescription
      };

      if (!state.userAppCfg.applicationAcronym) {
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

        if (state.userAppCfg.deploymentMethod === 'deploymentManual') {
          newAppCfg.serviceClients[0].secret = `$\{${newAppCfg.serviceClients[0].accountName}.password}`;
        } else if (state.userAppCfg.deploymentMethod === 'deploymentDirect') {
          newAppCfg.serviceClients[0].secret = state.userAppCfg.userEnteredPassword;
        } else {
          newAppCfg.serviceClients[0].secret = '';
        }

        if (!state.userAppCfg.commonServices || !state.userAppCfg.commonServices.length) {
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

      const appCfgVals = {
        ...defaultAppCfg,
        ...newAppCfg,
      };

      return JSON.stringify(appCfgVals, null, 2);
    }
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    updateUserAppCfg: function (state, userAppCfg) {
      Object.assign(state.userAppCfg, userAppCfg);
    },
    setConfigSubmissionSuccess: function (state, msg) {
      state.configSubmissionSuccess = msg;
      state.configSubmissionError = '';
    },
    setConfigSubmissionError: function (state, msg) {
      state.configSubmissionSuccess = '';
      state.configSubmissionError = msg;
    },
    clearConfigSubmissionMsgs: function (state) {
      state.configSubmissionSuccess = '';
      state.configSubmissionError = '';
    }
  },
  actions: {

  }
});
