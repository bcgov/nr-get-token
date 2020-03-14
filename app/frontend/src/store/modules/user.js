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
            console.error(error); // eslint-disable-line no-console
          });
      }
    }
  }
};
