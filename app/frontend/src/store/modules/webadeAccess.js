import cryptico from 'cryptico-js';

import acronymService from '@/services/acronymService';
import webadeService from '@/services/webadeService';

export default {
  namespaced: true,
  state: {
    configFormStep: 1,
    configFormSubmissionResult: null,
    configSubmissionSuccess: '',
    configSubmissionError: '',
    configSubmissionInProgress: false,
    diffLoading: false,
    ephemeralPasswordRSAKey: null,
    existingWebAdeConfig: '',
    showWebadeNrosDmsOption: false,
    userAppCfg: {
      applicationAcronym: '',
      applicationName: '',
      applicationDescription: '',
      commonServices: [],
      deploymentMethod: '',
      clientEnvironment: 'INT'
    },
  },
  getters: {
    configFormStep: state => state.configFormStep,
    configSubmissionSuccess: state => state.configSubmissionSuccess,
    configSubmissionError: state => state.configSubmissionError,
    configSubmissionInProgress: state => state.configSubmissionInProgress,
    configFormSubmissionResult: state => state.configFormSubmissionResult,
    diffLoading: state => state.diffLoading,
    ephemeralPasswordRSAKey: state => state.ephemeralPasswordRSAKey,
    existingWebAdeConfig: state => JSON.stringify(state.existingWebAdeConfig, null, 2),
    showWebadeNrosDmsOption: state => state.showWebadeNrosDmsOption,
    userAppCfg: state => state.userAppCfg,
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
    setConfigFormStep: (state, step) => {
      state.configFormStep = step;
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
    setDiffLoading: (state, val) => {
      state.diffLoading = val;
    },
    setEphemeralPasswordRSAKey: (state, ephemeralPasswordRSAKey) => {
      state.ephemeralPasswordRSAKey = ephemeralPasswordRSAKey;
    },
    setExistingWebAdeConfig: (state, val) => {
      state.existingWebAdeConfig = val, null, 2;
    },
    setSelectedAcronymDetails: (state, val) => {
      state.userAppCfg.applicationAcronym = val.acronym;
      state.userAppCfg.applicationName = val.name;
      state.userAppCfg.applicationDescription = val.description;
    },
    setshowWebadeNrosDmsOption: (state, { acrDetail, authStoreHasNros}) => {
      const dbHasNrosFlag = acrDetail && acrDetail.permissionWebadeNrosDms;
      state.showWebadeNrosDmsOption = authStoreHasNros && dbHasNrosFlag;
    },
    updateUserAppCfg: (state, userAppCfg) => {
      Object.assign(state.userAppCfg, userAppCfg);
    }
  },
  actions: {
    async initAcronymDetails(context, acronym) {
      try {
        let response = null;
        if (acronym) {
          response = await acronymService.getAcronym(acronym);
          if (!response.data) {
            throw new Error();
          }
        }
        context.commit('setSelectedAcronymDetails', response.data);
        const authStoreHasNros = context.rootGetters['auth/hasWebadeNrosDmsPermission'];
        context.commit('setshowWebadeNrosDmsOption', { acrDetail: response.data, authStoreHasNros });
      } catch (error) {
        context.commit('setConfigSubmissionError', `An error occurred fetching application details for ${acronym}`);
      }

    },
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
        const response = await webadeService.postConfigForm(body);
        if (!response.data || !response.data.generatedPassword) {
          throw new Error('Config form POST response is blank or does not include the password');
        }

        const configFormSubmissionResult = {
          generatedPassword: response.data.generatedPassword,
          generatedServiceClient: response.data.generatedServiceClient
        };

        const msg = `SUCCESS, configuration for ${context.state.userAppCfg.applicationAcronym} updated in ${context.state.userAppCfg.clientEnvironment}.`;
        context.commit('setConfigSubmissionSuccess', msg);
        context.commit('setConfigFormSubmissionResult', configFormSubmissionResult);
      } catch (error) {
        console.error(error); // eslint-disable-line no-console
        context.commit('setConfigSubmissionError', 'An error occurred while attempting to update the application configuration in WebADE.');
      }
    },
    async getWebAdeConfig(context, payload) {
      try {
        context.commit('setExistingWebAdeConfig', '');
        context.commit('setDiffLoading', true);
        const response = await webadeService.getWebAdeConfig(payload.webAdeEnv, payload.acronym);
        const cfg = response.data;
        // remove the 'links' item
        delete cfg.links;
        context.commit('setExistingWebAdeConfig', cfg);
      } catch (error) {
        console.error(error); // eslint-disable-line no-console
        context.commit('setExistingWebAdeConfig', `An error occurred getting the existing WebADE configuration for ${payload.acronym} in ${payload.webAdeEnv}`);
      } finally {
        context.commit('setDiffLoading', false);
      }
    }
  }
};
