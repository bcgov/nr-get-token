import { getokAxios } from '@/services/interceptors';

export default {
  /**
   * @function getHello
   * Fetch the hello message
   */
  getHello() {
    return getokAxios().get('/hello');
  }
};
