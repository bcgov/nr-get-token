import axios from 'axios';
import AuthService from '@/common/authService';
import { ApiRoutes } from '@/utils/constants';
import { CommonServiceTypes } from '@/utils/commonServices.js';

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

// Create new non-global axios instance and intercept strategy
const apiAxios = axios.create();
const intercept = apiAxios.interceptors.response.use(config => config, error => {
  const originalRequest = error.config;
  if (error.response.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        try {
          const token = failedQueue.push({ resolve, reject });
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return axios(originalRequest);
        } catch (e) {
          return e;
        }
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    return new Promise((resolve, reject) => {
      AuthService.refreshAuthToken(localStorage.getItem('refreshToken'))
        .then(response => {
          if (response.jwt) {
            sessionStorage.setItem('jwtToken', response.jwt);
            apiAxios.defaults.headers.common['Authorization'] = `Bearer ${response.jwt}`;
            originalRequest.headers['Authorization'] = `Bearer ${response.jwt}`;
          }
          if (response.refreshToken) {
            localStorage.setItem('refreshToken', response.refreshToken);
          }

          processQueue(null, response.jwt);
          resolve(axios(originalRequest));
        })
        .catch(e => {
          processQueue(e, null);
          sessionStorage.removeItem('jwtToken');
          localStorage.removeItem('refreshToken');
          reject(e);
        })
        .finally(() => isRefreshing = false);
    });
  }

  return Promise.reject(error);
});

export default {
  apiAxios: apiAxios,
  intercept: intercept,

  setAuthHeader(token) {
    if (token) {
      apiAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete apiAxios.defaults.headers.common['Authorization'];
    }
  },

  async getHealthCheck() {
    try {
      const response = await apiAxios.get(ApiRoutes.HEALTH);
      return response.data;
    } catch (e) {
      console.log(`Failed to fetch from API - ${e}`); // eslint-disable-line no-console
      throw e;
    }
  },

  async getAcronymDetails(acronym) {
    try {
      const url = `${ApiRoutes.ACRONYMS}/${acronym}`;
      const response = await apiAxios.get(url);
      return response.data;
    } catch (e) {
      console.log(`Failed to fetch from API - ${e}`); // eslint-disable-line no-console
      throw e;
    }
  },

  async getApiCheck(route) {
    try {
      const response = await apiAxios.get(route);
      return `URL: ${route}
Status: ${response.status} - ${response.statusText}
Body: ${JSON.stringify(response.data, null, 2)}`;
    } catch (e) {
      if (e.response && e.response.data) {
        return `URL: ${route}
      Status: ${e.response.status} - ${e.response.statusText}
      Body: ${JSON.stringify(e.response.data, null, 2)}`;
      } else {
        console.log(`Failed to fetch from API - ${e}`); // eslint-disable-line no-console
        throw e;
      }
    }
  },

  async postConfigForm(configFormBody) {
    try {
      const route = configFormBody.configForm.commonServiceType === CommonServiceTypes.WEBADE ? ApiRoutes.WEBADE_CONFIGFORM : ApiRoutes.KCCONFIG;
      const response = await apiAxios.post(route, configFormBody, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (e) {
      console.log(`Failed to post app config form - ${e}`); // eslint-disable-line no-console
      throw e;
    }
  },

  async getWebAdeConfig(webAdeEnv, acronym) {
    try {
      const url = `${ApiRoutes.WEBADE}/${webAdeEnv}/${acronym}/${ApiRoutes.WEBADE_CFG}`;
      const response = await apiAxios.get(url);

      return response.data;
    } catch (e) {
      // If it's a 404, treat it as a blank config. Not found is valid, it means the acronym doesn't exist
      if (e.response && e.response.status === 404) {
        return '';
      }
      console.log(`Failed to get webade app config for ${acronym} in ${webAdeEnv} - ${e}`); // eslint-disable-line no-console
      throw e;
    }
  },

  async getWebAdeDependencies(webAdeEnv, acronym) {
    try {

      const url = `${ApiRoutes.WEBADE}/${webAdeEnv}/${acronym}/${ApiRoutes.WEBADE_DEP}`;
      const response = await apiAxios.get(url);
      return response.data;
    } catch (e) {
      console.log(`Failed to get webade dependencies for ${acronym} in ${webAdeEnv} - ${e}`); // eslint-disable-line no-console
      throw e;
    }
  },

  async getInsecurePasswords(webAdeEnv, searchCriteria) {
    try {

      const url = `${ApiRoutes.WEBADE}/${webAdeEnv}/${ApiRoutes.WEBADE_PREFS_INSECURE}`;
      const response = await apiAxios.get(url, {
        params: {
          searchCriteria: searchCriteria
        }
      });
      return response.data;
    } catch (e) {
      console.log(`Failed to get webade prefs in ${webAdeEnv} - ${e}`); // eslint-disable-line no-console
      throw e;
    }

  },

  async sendRegistrationEmail(registrationForm) {
    try {
      const response = await apiAxios.post(ApiRoutes.EMAIL, registrationForm, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (e) {
      console.log(`Failed to post email registration form - ${e}`); // eslint-disable-line no-console
      throw e;
    }
  },
};
