import Vue from 'vue';
import { getokAxios } from './interceptors';

export default {
  /**
   * @function getUserAcronyms
   * Fetch the acronyms the current user has access to
   */
  async getUserAcronyms() {
    if (Vue.prototype.$keycloak &&
      Vue.prototype.$keycloak.ready &&
      Vue.prototype.$keycloak.authenticated) {
      return getokAxios().get(`/users/${Vue.prototype.$keycloak.subject}/acronyms`);
    } else {
      return [];
    }
  }
};
