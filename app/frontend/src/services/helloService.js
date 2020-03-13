import { getokAxios } from './interceptors';

export default {
  getHello() {
    return getokAxios().get('/hello');
  }
};
