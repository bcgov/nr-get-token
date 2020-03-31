import { getokAxios } from '@/services/interceptors';
import { ApiRoutes } from '@/utils/constants';

export default {
  /**
   * @function getAllServiceClients
   * Fetch all registered service clients
   */
  getServiceClients() {
    return getokAxios().get(ApiRoutes.KCCLIENTS, { timeout: 30000 });
  },

  /**
   * @function postConfigForm
   * Creates a keycloak service client in the targetted env
   * @param {object} content An object with applicationAcronym, name, environment, etc (see validation in keycloak router in backend for required fields)
   * @returns {Promise} An axios response
   */
  postConfigForm(content) {
    return getokAxios().post(ApiRoutes.KCCONFIG, content);
  }
};
