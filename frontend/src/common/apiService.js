import { ApiRoutes, AuthRoutes } from '@/utils/constants.js';

export const ApiService = {
  async getHealthCheck() {
    try {
      const response = await fetch(ApiRoutes.HEALTH, {
        method: 'GET'
      });
      const body = await response.json();

      return body;
    } catch (e) {
      throw e;
    }
  },
  async getApiCheck(route) {
    try {
      const response = await fetch(route, {
        method: 'GET'
      });
      const body = await response.text();
      return `URL: ${response.url}
Status: ${response.status} - ${response.statusText}
Body: ${body}`;
    } catch (e) {
      console.log('ERROR, caught error fetching from API endpoint'); // eslint-disable-line no-console
      console.log(e); // eslint-disable-line no-console
      throw e;
    }
  },
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
