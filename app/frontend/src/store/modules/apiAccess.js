import cryptico from 'cryptico-js';

import AcronymService from '@/services/acronymService';
import { CommonServiceTypes, CommonServiceList } from '@/utils/commonServices.js';
import KeycloakService from '@/services/keycloakService';

export default {
  namespaced: true,
  state: {
    acronym: '',
    appName: '',
    appDescription: '',
    clientStatus: {
      dev: false,
      test: false,
      prod: false
    },
    clientStatusLoaded: false,
    environment: '',
    ephemeralPasswordRSAKey: null,
    generatedClient: '',
    generatedPassword: '',
    step: 1
  },
  getters: {
    acronym: state => state.acronym,
    clientStatus: state => state.clientStatus,
    clientStatusLoaded: state => state.clientStatusLoaded,
    environment: state => state.environment,
    ephemeralPasswordRSAKey: state => state.ephemeralPasswordRSAKey,
    generatedClient: state => state.generatedClient,
    generatedPassword: state => state.generatedPassword,
    step: state => state.step
  },
  mutations: {
    setAcronym: (state, acronym) => {
      state.acronym = acronym;
    },
    setAppName: (state, appName) => {
      state.appName = appName;
    },
    setAppDescription: (state, appDescription) => {
      state.appDescription = appDescription;
    },
    setClientStatus: (state, statusObj) => {
      state.clientStatus = statusObj;
    },
    setClientStatusLoaded: (state, clientStatusLoaded) => {
      state.clientStatusLoaded = clientStatusLoaded;
    },
    setEnvironment: (state, env) => {
      state.environment = env;
    },
    setEphemeralPasswordRSAKey: (state, ephemeralPasswordRSAKey) => {
      state.ephemeralPasswordRSAKey = ephemeralPasswordRSAKey;
    },
    setGeneratedClient: (state, generatedClient) => {
      state.generatedClient = generatedClient;
    },
    setGeneratedPassword: (state, generatedPassword) => {
      state.generatedPassword = generatedPassword;
    },
    setStep: (state, step) => {
      state.step = step;
    }
  },
  actions: {
    /**
     * @function getAcronymClientStatus
     * Fetch the service clients for the acronyms the user has
     * @param {object} context The store context
     */
    async getAcronymClientStatus({ commit, state }) {
      try {
        commit('setClientStatusLoaded', false);
        const res = await AcronymService.getServiceClients(state.acronym);
        const statusObj = {
          dev: res.data.dev && res.data.dev.enabled,
          test: res.data.test && res.data.test.enabled,
          prod: res.data.prod && res.data.prod.enabled
        };
        commit('setClientStatus', statusObj);
        commit('setClientStatusLoaded', true);
      } catch (error) {
        // TODO: Create top-level global state error message
        commit('setClientStatusLoaded', false);
        console.error(error); // eslint-disable-line no-console
      }
    },

    /**
     * @function getAcronymDetails
     * Fetch the acronym record
     * @param {object} context The store context
     */
    async getAcronymDetails({ commit, state }) {
      try {
        const res = await AcronymService.getAcronym(state.acronym);
        commit('setAppName', res.data.name);
        commit('setAppDescription', res.data.description);
      } catch (error) {
        console.error(error); // eslint-disable-line no-console
      }
    },

    /**
     * @function submitConfigForm
     * Fetch the acronym record
     * @param {object} context The store context
     * @returns {boolean} whether the operation succeeded
     */
    async submitConfigForm({ commit, state }) {
      const configForm = {
        applicationAcronym: state.acronym,
        applicationName: state.appName,
        applicationDescription: state.appDescription,
        clientEnvironment: state.environment,
        commonServices: CommonServiceList
          .filter(svc => svc.type === CommonServiceTypes.KEYCLOAK)
          .map(svc => svc.abbreviation),
      };

      try {
        const uniqueSeed =
          Math.random()
            .toString(36)
            .substring(2) + new Date().getTime().toString(36);
        const ephemeralRSAKey = cryptico.generateRSAKey(uniqueSeed, 1024);
        commit('setEphemeralPasswordRSAKey', ephemeralRSAKey);

        const body = {
          configForm: configForm,
          passwordPublicKey: cryptico.publicKeyString(ephemeralRSAKey)
        };

        const res = await KeycloakService.postConfigForm(body);
        if (res && res.data) {
          commit('setGeneratedClient', res.data.generatedServiceClient);
          commit('setGeneratedPassword', res.data.generatedPassword);
          return true;
        } else {
          //TODO: global error handling here?
          console.error(`submitConfigForm - No response for ${JSON.stringify(configForm)}`); // eslint-disable-line no-console
          return false;
        }
      }
      catch (error) {
        //TODO: global error handling here?
        console.error(`submitConfigForm - Error occurred for ${JSON.stringify(configForm)}`); // eslint-disable-line no-console
        console.error(error); // eslint-disable-line no-console
        return false;
      }
    }
  }
};
