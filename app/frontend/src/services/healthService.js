import { getokAxios } from '@/services/interceptors';
import { ApiRoutes } from '@/utils/constants';

export default {
  /**
   * @function getHealthCheck
   * Fetch the health statuses of associated endpoints
   * @returns {Promise} An axios response
   */
  getHealthCheck() {
    return getokAxios().get(ApiRoutes.HEALTH);
  }
};
