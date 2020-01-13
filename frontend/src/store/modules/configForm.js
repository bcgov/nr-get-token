import cryptico from 'cryptico-js';
import ApiService from '@/common/apiService';
import { CommonServiceTypes } from '@/utils/commonServices.js';

export default {
  namespaced: true,
  state: {
    configSubmissionSuccess: '',
    configSubmissionError: '',
    configSubmissionInProgress: false,
    userAppCfg: {
      applicationAcronym: '',
      applicationName: '',
      applicationDescription: '',
      commonServiceType: '',
      commonServices: [],
      deploymentMethod: '',
      clientEnvironment: ''
    },
    configFormSubmissionResult: null,
    ephemeralPasswordRSAKey: null,
    existingWebAdeConfig: ''
  },
  getters: {
    configSubmissionSuccess: state => state.configSubmissionSuccess,
    configSubmissionError: state => state.configSubmissionError,
    configSubmissionInProgress: state => state.configSubmissionInProgress,
    configFormSubmissionResult: state => state.configFormSubmissionResult,
    commonServiceType: state => state.userAppCfg.commonServiceType,
    usingWebadeConfig: state => state.userAppCfg.commonServiceType === CommonServiceTypes.WEBADE,
    ephemeralPasswordRSAKey: state => state.ephemeralPasswordRSAKey,
    existingWebAdeConfig: state => JSON.stringify(state.existingWebAdeConfig, null, 2),
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
        } else {
          newAppCfg.serviceClients[0].secret = '••••••••';
        }

        if (!state.userAppCfg.commonServices || !state.userAppCfg.commonServices.length) {
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
            description: `Common service access profile for ${newAppCfg.applicationAcronym} app`,
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
              }
            ]
          }];

          if (state.userAppCfg.commonServices.includes('cmsg')) {
            newAppCfg.profiles[0].profileRoles.push(
              {
                applicationCode: 'CMSG',
                name: 'SENDER'
              }
            );
          }
          if (state.userAppCfg.commonServices.includes('nros-dms')) {
            newAppCfg.profiles[0].profileRoles.push(
              {
                'applicationCode': 'DMS',
                'name': 'CONTRIBUTOR'
              },
              {
                'applicationCode': 'DMS',
                'name': 'STAFF_USER_READ'
              },
              {
                'applicationCode': 'NRS_AS',
                'name': 'READ_ANY_DMS'
              }
            );
          }

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
    updateUserAppCfg: (state, userAppCfg) => {
      Object.assign(state.userAppCfg, userAppCfg);
    },
    setConfigSubmissionInProgress: (state) => {
      state.configSubmissionSuccess = '';
      state.configSubmissionError = '';
      state.configSubmissionInProgress = true;
    },
    setConfigSubmissionSuccess: (state, msg) => {
      state.configSubmissionSuccess = msg;
      state.configSubmissionError = '';
      state.configSubmissionInProgress = false;
    },
    setConfigSubmissionError: (state, msg) => {
      state.configSubmissionSuccess = '';
      state.configSubmissionError = msg;
      state.configSubmissionInProgress = false;
    },
    clearConfigSubmissionMsgs: (state) => {
      state.configSubmissionSuccess = '';
      state.configSubmissionError = '';
    },
    setConfigFormSubmissionResult: (state, val) => {
      state.configFormSubmissionResult = val;
    },
    setEphemeralPasswordRSAKey: (state, ephemeralPasswordRSAKey) => {
      state.ephemeralPasswordRSAKey = ephemeralPasswordRSAKey;
    },
    setCommonServiceType: (state, val) => {
      state.userAppCfg.commonServiceType = val;
    },
    setExistingWebAdeConfig: (state, val) => {
      state.existingWebAdeConfig = val, null, 2;
    },
  },
  actions: {
    async submitConfigForm(context) {

      context.commit('setConfigSubmissionInProgress');

      const uniqueSeed =
        Math.random()
          .toString(36)
          .substring(2) + new Date().getTime().toString(36);
      const ephemeralRSAKey = cryptico.generateRSAKey(uniqueSeed, 1024);
      context.commit('setEphemeralPasswordRSAKey', ephemeralRSAKey);

      const body = {
        configForm: context.state.userAppCfg,
        passwordPublicKey: cryptico.publicKeyString(ephemeralRSAKey)
      };
      try {
        const response = await ApiService.postConfigForm(body);
        if (!response || !response.generatedPassword) {
          throw new Error('Config form POST response is blank or does not include the password');
        }

        const configFormSubmissionResult = {
          generatedPassword: response.generatedPassword,
          generatedServiceClient: response.generatedServiceClient
        };

        const msg = `SUCCESS, configuration for ${context.state.userAppCfg.applicationAcronym} updated in ${context.state.userAppCfg.clientEnvironment}.`;
        context.commit(
          'setConfigSubmissionSuccess',
          msg
        );
        context.commit('setConfigFormSubmissionResult', configFormSubmissionResult);
      } catch (error) {
        context.commit(
          'setConfigSubmissionError',
          context.getters.usingWebadeConfig ? 'An error occurred while attempting to update the application configuration in WebADE.'
            : 'An error occurred while attempting to create a service client in Keycloak.'
        );
      }
    },
    async getWebAdeConfig(context, payload) {
      try {
        const response = await ApiService.getWebAdeConfig(payload.webAdeEnv, payload.acronym);
        // remove the 'links' item
        delete response.links;
        context.commit('setExistingWebAdeConfig', response);
      } catch (error) {
        context.commit('setExistingWebAdeConfig', `An error occurred getting the existing WebADE configuration for ${payload.acronym} in ${payload.webAdeEnv}`);
      }
    }
  }
};
