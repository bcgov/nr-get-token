import AcronymService from '@/services/acronymService';

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
    environment: 'aaa',
    step: 1
  },
  getters: {
    acronym: state => state.acronym,
    clientStatus: state => state.clientStatus,
    clientStatusLoaded: state => state.clientStatusLoaded,
    environment: state => state.environment,
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
    async submitConfigForm({ state }) {
      const configForm = {
        acronym: state.acronym,
        name: '',
        description: ''
      };
      try {
        await new Promise(r => setTimeout(r, 2000));
        //const res = await KeycloakService.postConfigForm(configForm);
        return true;
        // if (res && res.data) {
        //   return true;
        // } else {
        //   console.error(`submitConfigForm - No response for ${JSON.stringify(configForm)}`); // eslint-disable-line no-console
        //   return false;
        // }
      }
      catch (error) {
        console.error(`submitConfigForm - Error occurred for ${JSON.stringify(configForm)}`); // eslint-disable-line no-console
        console.error(error); // eslint-disable-line no-console
        return false;
      }
    }
  }
};
