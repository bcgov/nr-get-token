import UserService from '@/services/userService';

export default {
  namespaced: true,
  state: {
    acronyms: [],
    moduleLoaded: false
  },
  getters: {
    acronyms: state => state.acronyms,
    moduleLoaded: state => state.moduleLoaded
  },
  mutations: {
    setAcronyms: (state, acronyms = []) => {
      if (Array.isArray(acronyms)) {
        state.acronyms = acronyms;
      }
    },
    setAcronymClientStatus: (state, userClients) => {
      if (Array.isArray(userClients) && userClients.length) {
        state.acronyms = state.acronyms.map(acr => {
          const clientSet = userClients.find(client => client.acronym === acr.acronym);
          acr.clientStatus = {
            dev: clientSet && clientSet.dev && clientSet.dev.enabled,
            test: clientSet && clientSet.test && clientSet.test.enabled,
            prod: clientSet && clientSet.prod && clientSet.prod.enabled
          };
          return acr;
        });
      } else {

        state.acronyms = state.acronyms.map(acr => {
          acr.clientStatus = {
            dev: false,
            test: false,
            prod: false
          };
          return acr;
        });
      }
    },
    setModuleLoaded: (state, status) => state.moduleLoaded = status
  },
  actions: {
    /**
     * @function getAcronymClientStatus
     * Fetch the service clients for the acronyms the user has
     * @param {object} context The store context
     */
    async getAcronymClientStatus(context) {
      try {
        const subject = context.rootGetters['auth/keycloakSubject'];
        const response = await UserService.getServiceClients(subject);
        context.commit('setAcronymClientStatus', response.data);
      } catch (error) {
        // TODO: Create top-level global state error message
        console.error(error); // eslint-disable-line no-console
      }
    },
    /**
     * @function getUserAcronyms
     * Fetch the acronyms the current user has access to from the DB
     * @param {object} context The store context
     */
    async getUserAcronyms(context) {
      try {
        const subject = context.rootGetters['auth/keycloakSubject'];
        const response = await UserService.getUserAcronyms(subject);
        context.commit('setAcronyms', response.data);
      } catch (error) {
        // TODO: Create top-level global state error message
        console.error(error); // eslint-disable-line no-console
      }
    },
    /**
     * @function loadModule
     * Dispatches all actions needed to populate the user store
     * @param {object} context The store context
     */
    async loadModule(context) {
      context.commit('setModuleLoaded', false);
      await context.dispatch('getUserAcronyms');
      await context.dispatch('getAcronymClientStatus');
      context.commit('setModuleLoaded', true);
    }
  }
};
