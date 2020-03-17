import Vue from 'vue';
import UserService from '@/services/userService';

export default {
  namespaced: true,
  state: {
    acronyms: []
  },
  getters: {
    acronyms: state => state.acronyms
  },
  mutations: {
    setAcronyms: (state, acronyms = []) => {
      if (Array.isArray(acronyms)) {
        state.acronyms = acronyms;
      }
    },
    setAcronymClientStatus: (state, clientsForUser) => {
      if (Array.isArray(clientsForUser) && clientsForUser.length) {
        state.acronyms.forEach(acr => {
          const clientSet = clientsForUser.find(client => client.acronym === acr.acronym);
          acr.devStatus = (clientSet && clientSet.dev && clientSet.dev.enabled) ? true : false;
          acr.testStatus = (clientSet && clientSet.test && clientSet.test.enabled) ? true : false;
          acr.prodStatus = (clientSet && clientSet.prod && clientSet.prod.enabled) ? true : false;
        });
      } else {
        state.acronyms.forEach(acr => {
          acr.devStatus = false;
          acr.testStatus = false;
          acr.prodStatus = false;
        });
      }
    }
  },
  actions: {
    /**
     * @function getUserAcronyms
     * Fetch the acronyms the current user has access to from the DB
     * @param {object} context The store context
     */
    getUserAcronyms(context) {
      if (Vue.prototype.$keycloak &&
        Vue.prototype.$keycloak.ready &&
        Vue.prototype.$keycloak.authenticated) {
        UserService.getUserAcronyms(Vue.prototype.$keycloak.subject)
          .then(response => {
            if (response && response.data) {
              context.commit('setAcronyms', response.data);
            }
          })
          .catch(error => {
            // TODO: Create top-level global state error message
            console.error(error); // eslint-disable-line no-console
          });
      }
    },
    /**
     * @function fillInAcronymClientStatus
     * Fetch the service clients for the acronyms the user has
     * @param {object} context The store context
     */
    async fillInAcronymClientStatus(context) {
      try {
        const response = await UserService.getServiceClients(
          Vue.prototype.$keycloak.subject
        );
        context.commit('setAcronymClientStatus', response.data);
      } catch (e) {
        console.error(e); // eslint-disable-line no-console
      }
    }
  }
};
