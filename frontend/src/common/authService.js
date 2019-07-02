import axios from 'axios';
import { AuthRoutes } from '@/utils/constants.js';

export default {
  async getAuthToken() {
    try {
      const response = await axios.get(AuthRoutes.TOKEN);
      return response.data;
    } catch (e) {
      console.log(`Failed to acquire JWT token - ${e}`); // eslint-disable-line no-console
      throw e;
    }
  },

  async refreshAuthToken(token) {
    try {
      const response = await axios.post(AuthRoutes.REFRESH, {
        refreshToken: token
      });

      if (response.data.error) {
        throw new Error(response.data.error_description);
      }
      return response.data;
    } catch (e) {
      console.log(`Failed to refresh JWT token - ${e}`); // eslint-disable-line no-console
      throw e;
    }
  }
};
