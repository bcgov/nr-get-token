import { getokAxios } from '@/services/interceptors';

import { ApiRoutes } from '@/utils/constants';

export default {
  /**
   * @function getAcronym
   * Fetch the service clients for the acronym
   * @param {string} acronym app acronym
   * @returns {Promise} An axios response
   */
  getAcronym(acronym) {
    if (acronym) {
      return getokAxios().get(`${ApiRoutes.ACRONYMS}/${acronym}`);
    } else {
      return Promise.reject('No acronym supplied');
    }
  },

  /**
   * @function getServiceClients
   * Fetch the service clients for the acronym
   * @param {string} acronym app acronym
   * @returns {Promise} An axios response
   */
  getServiceClients(acronym) {
    if (acronym) {
      return getokAxios().get(`${ApiRoutes.ACRONYMS}/${acronym}/clients`, { timeout: 30000 });
    } else {
      return Promise.reject('No acronym supplied');
    }
  },

  /**
   * @function getServiceClients
   * Post the service client creation submission to the api
   * @param {string} acronym app acronym
   * @returns {Promise} An axios response
   */
  postConfigForm(configForm) {
    if (configForm) {
      return getokAxios().post(`${ApiRoutes.ACRONYMS}/${configForm.acronym}/clients`, configForm);
    } else {
      return Promise.reject('No acronym supplied');
    }
  }
};
