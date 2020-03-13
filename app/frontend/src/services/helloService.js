import { getokAxios } from './interceptors';

export default {
  /**
   * @function getHello
   * Fetch the hello message
   */
  getHello() {
    return getokAxios().get('/hello');
  }
};
