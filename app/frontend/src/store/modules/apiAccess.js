import AcronymService from '@/services/acronymService';

export default {
  namespaced: true,
  state: {
    acronym: '',
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
    clientStatus: state => state.clientStatus,
    clientStatusLoaded: state => state.clientStatusLoaded,
    environment: state => state.environment,
    step: state => state.step
  },
  mutations: {
    setAcronym: (state, acronym) => {
      state.acronym = acronym;
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
    }
  }
};
