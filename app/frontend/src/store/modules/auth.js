import Vue from 'vue';

export default {
  namespaced: true,
  state: {},
  getters: {
    authenticated: () => Vue.prototype.$keycloak.ready && Vue.prototype.$keycloak.authenticated,
    createLoginUrl: () => options => Vue.prototype.$keycloak.createLoginUrl(options),
    createLogoutUrl: () => options => Vue.prototype.$keycloak.createLogoutUrl(options),
    ready: () => Vue.prototype.$keycloak.ready,
    subject: () => Vue.prototype.$keycloak.ready,
    tokenParsed: () => Vue.prototype.$keycloak.tokenParsed
  },
  mutations: {},
  actions: {}
};
