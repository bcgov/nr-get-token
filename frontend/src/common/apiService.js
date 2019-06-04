import axios from 'axios';
import { ApiRoutes, AuthRoutes } from '@/utils/constants.js';

// Buffer concurrent requests while refresh token is being acquired
let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
}

// Create new non-global axios instance
const apiAxios = axios.create();
apiAxios.interceptors.response.use(response => response, error => {
  const originalRequest = error.config;
  if (error.response.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      return new Promise(async (resolve, reject) => {
        try {
          const token = await failedQueue.push({ resolve, reject });
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return axios(originalRequest);
        } catch (e) {
          return e;
        }
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    return new Promise(async (resolve, reject) => {
      try {
        const response = await ApiService.getAuthToken();

        localStorage.setItem('jwtToken', response.jwt);
        localStorage.setItem('refreshToken', response.refreshToken);
        apiAxios.defaults.headers.common['Authorization'] = `Bearer ${response.jwt}`;
        originalRequest.headers['Authorization'] = `Bearer ${response.jwt}`;

        processQueue(null, response.jwt);
        resolve(axios(originalRequest));
      } catch (e) {
        processQueue(e, null);
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('refreshToken');
        reject(e);
      } finally {
        isRefreshing = false;
      }
    });
  }

  return Promise.reject(error);
});

export const ApiService = {
  async getAuthToken() {
    try {
      const response = await axios.get(AuthRoutes.TOKEN);
      return response.data;
    } catch (e) {
      console.log(`Failed to get JWT: ${e.response.data.message}`); // eslint-disable-line no-console
      return {};
    }
  },

  async getHealthCheck() {
    try {
      const response = await apiAxios.get(ApiRoutes.HEALTH);
      return response.data;
    } catch (e) {
      console.log(`ERROR fetching from API: ${e}`); // eslint-disable-line no-console
      throw e;
    }
  },

  async getApiCheck(route) {
    try {
      const response = await apiAxios.get(route);
      return `URL: ${response.request.responseURL}
Status: ${response.status} - ${response.statusText}
Body: ${response.request.responseText}`;
    } catch (e) {
      console.log(`ERROR fetching from API: ${e}`); // eslint-disable-line no-console
      throw e;
    }
  }
};
