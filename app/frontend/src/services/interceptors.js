import axios from 'axios';
import Vue from 'vue';

export function getokAxios(timeout = 10000) {
  const axiosOptions = { timeout: timeout };
  if (Vue.prototype.$config) {
    const config = Vue.prototype.$config;
    axiosOptions.baseURL = `${config.basePath}/${config.apiPath}`;
  }

  const instance = axios.create(axiosOptions);

  instance.interceptors.request.use(cfg => {
    if (Vue.prototype.$keycloak && Vue.prototype.$keycloak.authenticated) {
      cfg.headers.Authorization = `Bearer ${Vue.prototype.$keycloak.token}`;
    }
    return Promise.resolve(cfg);
  }, error => {
    return Promise.reject(error);
  });

  return instance;
}
