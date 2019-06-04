import axios from 'axios';
import { ApiRoutes, AuthRoutes } from '@/utils/constants.js';

// Create new non-global axios instance
const apiAxios = axios.create();

apiAxios.interceptors.response.use(response => {
  return response;
}, error => {
  const errorResponse = error.response;
  if (isTokenExpiredError(errorResponse)) {
    console.log(errorResponse); // eslint-disable-line no-console
  }
  // If the error is due to other reasons, throw it back to axios
  return Promise.reject(error);
});

// eslint-disable-next-line no-unused-vars
function isTokenExpiredError(errorResponse) {
  // Your own logic to determine if the error is due to JWT token expired returns a boolean value
  return true;
}

export const ApiService = {
  async getHealthCheck(jwtToken) {
    try {
      const response = await apiAxios.get(ApiRoutes.HEALTH, {
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
      const response = await apiAxios.get(route, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });
      return `URL: ${response.request.responseURL}
Status: ${response.status} - ${response.statusText}
Body: ${response.request.responseText}`;
    } catch (e) {
      console.log('ERROR, caught error fetching from API endpoint'); // eslint-disable-line no-console
      console.log(e); // eslint-disable-line no-console
      throw e;
    }
  },

  async getAuthToken() {
    try {
      const response = await apiAxios.get(AuthRoutes.TOKEN);
      return response.data;
    } catch (e) {
      console.log(`Failed to get JWT: ${e.response.data.message}`); // eslint-disable-line no-console
      return {};
    }
  }
};
