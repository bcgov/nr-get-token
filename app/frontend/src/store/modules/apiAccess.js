import AcronymService from '@/services/acronymService';

export default {
  namespaced: true,
  state: {
    acronym: '',
    clientStatusLoaded: false,
    step: 1
  },
  getters: {
    clientStatusLoaded: state => state.clientStatusLoaded,
    step: state => state.step
  },
  mutations: {
    setAcronym: (state, acronym) => {
      state.acronym = acronym;
    },
    setClientStatusLoaded: (state, clientStatusLoaded) => {
      state.clientStatusLoaded = clientStatusLoaded;
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
    async getAcronymClientStatus({commit, state}) {
      try {
        commit('setClientStatusLoaded', false);
        await AcronymService.getServiceClients(state.acronym);
        commit('setClientStatusLoaded', true);
      } catch (error) {
        // TODO: Create top-level global state error message
        commit('setClientStatusLoaded', false);
        console.error(error); // eslint-disable-line no-console
      }
    }
  }
};
