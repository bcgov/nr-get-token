// import { getokAxios } from '@/services/interceptors';
// import { ApiRoutes } from '@/utils/constants';

export default {
  /**
   * @function getWebAdeConfig
   * Fetch a webade cfg
   * @returns {Promise} An axios response
   */
  getWebAdeConfig(env, acronym) {
    throw new Error(env + acronym);
    //return getokAxios().get(ApiRoutes.KC_CLIENTS, { timeout: 30000 });
  },

  /**
   * @function postConfigForm
   * Creates a keycloak service client in the targetted env
   * @param {object} content An object with applicationAcronym, name, environment, etc (see validation in keycloak router in backend for required fields)
   * @returns {Promise} An axios response
   */
  postConfigForm(content) {
    throw new Error(content);
    //return getokAxios().post(ApiRoutes.KC_CONFIG, content);
  }
};
