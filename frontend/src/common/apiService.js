import axios from 'axios';
import { ApiRoutes, AuthRoutes } from '@/utils/constants.js';

// Create new non-global axios instance
const apiAxios = axios.create();

apiAxios.interceptors.response.use(response => response, error => {
  console.log(error); // eslint-disable-line no-console
});

export const ApiService = {
  async getHealthCheck(jwtToken) {
    try {
      const response = await axios.get(ApiRoutes.HEALTH, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  },

  async getApiCheck(jwtToken, route) {
    try {
      const response = await axios.get(route, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
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
      const response = await axios.get(AuthRoutes.TOKEN);
      return response.data;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`Failed to get JWT: ${e.response.data.message}`);
      // throw e;
      return {};
    }
  }
};
