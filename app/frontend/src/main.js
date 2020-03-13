import 'nprogress/nprogress.css';
import axios from 'axios';
import NProgress from 'nprogress';
import Vue from 'vue';
import VueKeycloakJs from '@dsb-norge/vue-keycloak-js';

import App from '@/App.vue';
import router from '@/router';
import * as services from '@/services';
import store from '@/store';
import vuetify from '@/plugins/vuetify';

Vue.config.productionTip = false;

NProgress.start();

// Globally register all components with base in the name
const requireComponent = require.context('@/components', true, /Base[A-Z]\w+\.(vue|js)$/);
requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName);
  const componentName = fileName.split('/').pop().replace(/\.\w+$/, '');
  Vue.component(componentName, componentConfig.default || componentConfig);
});

loadConfig();

/**
 * @function initializeApp
 * Initializes and mounts the Vue instance
 */
function initializeApp() {
  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
  }).$mount('#app');
}

/**
 * @function loadConfig
 * Acquires the configuration state from the backend server
 */
async function loadConfig() {
  // App publicPath is ./ - so use relative path here, will hit the backend server using relative path to root.
  const configUrl = process.env.NODE_ENV === 'production' ? 'config' : 'app/config';
  const storageKey = 'config';

  try {
    // Get configuration if it isn't already in session storage
    if (sessionStorage.getItem(storageKey) === null) {
      const { data } = await axios.get(configUrl);
      sessionStorage.setItem(storageKey, JSON.stringify(data));
    }

    // Mount the configuration as a prototype for easier access from Vue
    const config = JSON.parse(sessionStorage.getItem(storageKey));
    Vue.prototype.$config = Object.freeze(config);

    if (!config || !config.keycloak ||
      !config.keycloak.clientId || !config.keycloak.realm || !config.keycloak.serverUrl) {
      throw new Error('Keycloak is misconfigured');
    }
    await loadKeycloak(config);
  } catch (err) {
    sessionStorage.removeItem(storageKey);
    throw new Error(`Failed to acquire configuration: ${err.message}`);
  } finally {
    initializeApp();
    NProgress.done();
  }
}

/**
 * @function loadKeycloak
 * Applies Keycloak authentication capabilities
 * @param {object} config A config object
 */
function loadKeycloak(config) {
  Vue.use(VueKeycloakJs, {
    init: { onLoad: 'check-sso' },
    config: {
      clientId: config.keycloak.clientId,
      realm: config.keycloak.realm,
      url: config.keycloak.serverUrl
    },
    onReady: () => {
      Vue.prototype.$getok = services;
    },
    onInitError: error => {
      console.error('Keycloak failed to initialize'); // eslint-disable-line no-console
      console.error(error); // eslint-disable-line no-console
    }
  });
}
