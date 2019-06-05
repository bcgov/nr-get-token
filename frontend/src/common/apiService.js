import { ApiRoutes, AuthRoutes } from '@/utils/constants.js';
import axios from 'axios';

export const ApiService = {
  async getHealthCheck() {
    try {
      const response = await axios.get(ApiRoutes.HEALTH);

      return response.data;
    } catch (e) {
      throw e;
    }
  },
  async getApiCheck(route) {
    try {
      const response = await axios.get(route);

      console.log(response); // eslint-disable-line no-console
      return `URL: ${response.request.url}
Status: ${response.status} - ${response.statusText}
Body: ${JSON.stringify(response.data, null, 2)}`;
    } catch (e) {
      console.log('ERROR, caught error fetching from API endpoint'); // eslint-disable-line no-console
      console.log(e); // eslint-disable-line no-console
      throw e;
    }
  },
  async postConfigForm(configFormBody) {
    try {
      const headers = new Headers();
      headers.set('Content-Type', 'application/json');

      const response = await axios.post(ApiRoutes.APPCONFIG, configFormBody, headers);
      return response.data;
    } catch (e) {
      console.log('ERROR, caught error posting app config form'); // eslint-disable-line no-console
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
