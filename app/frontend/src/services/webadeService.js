import { getokAxios } from '@/services/interceptors';
import { ApiRoutes } from '@/utils/constants';

export default {
  /**
   * @function getWebAdeConfig
   * Fetch a webade cfg
   * @returns {Promise} An axios response
   */
  getWebAdeConfig(env, acronym) {
    return getokAxios().get(`${ApiRoutes.WEBADE}/${env}/${acronym}/appconfig`, { timeout: 30000 });
  },

  /**
   * @function postConfigForm
   * Creates a WebADE service client in the targetted env
   * @param {object} content The configForm to send to create the WebADE cfg from
   * @returns {Promise} An axios response
   */
  postConfigForm(content) {
    return getokAxios().post(`${ApiRoutes.WEBADE}/configForm`, content);
  }
};
