import Vue from 'vue';

export default {
  namespaced: true,
  state: {},
  getters: {
    authenticated: () => Vue.prototype.$keycloak.authenticated,
    createLoginUrl: () => options => Vue.prototype.$keycloak.createLoginUrl(options),
    createLogoutUrl: () => options => Vue.prototype.$keycloak.createLogoutUrl(options),
    keycloakReady: () => Vue.prototype.$keycloak.ready,
    keycloakSubject: () => Vue.prototype.$keycloak.subject,
    moduleLoaded: () => !!Vue.prototype.$keycloak,
    realmAccess: () => Vue.prototype.$keycloak.tokenParsed.realm_access,
    resourceAccess: () => Vue.prototype.$keycloak.tokenParsed.resource_access,
    tokenParsed: () => Vue.prototype.$keycloak.tokenParsed
  },
  mutations: {},
  actions: {}
};
