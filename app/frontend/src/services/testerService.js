import { getokAxios } from '@/services/interceptors';

export default {
  /**
   * @function getTestResponse
   * Fetch the contents of `path` as the current user
   * @param {string} path A string representing the relative path endpoint
   * @returns {Promise} An axios response
   */
  getTestResponse(path) {
    return getokAxios().get(path);
  }
};
