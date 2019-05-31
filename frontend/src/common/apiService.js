import { AuthRoutes } from '@/utils/constants.js';

export const ApiService = {
  async getAuthToken() {
    try {
      const response = await fetch(AuthRoutes.TOKEN, {
        method: 'GET'
      });
      const body = await response.json();
      return body;
    } catch (e) {
      throw e;
    }
  }
};
