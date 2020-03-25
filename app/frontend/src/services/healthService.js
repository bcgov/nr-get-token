import { getokAxios } from '@/services/interceptors';
import { ApiRoutes } from '@/utils/constants';

export default {
  /**
   * @function getHealthCheck
   * Fetch the health statuses of associated endpoints
   * @param {string} path A string representing the relative path endpoint
   * @returns {Promise} An axios response
   */
  getHealthCheck() {
    return getokAxios().get(ApiRoutes.HEALTH);
  }
};
