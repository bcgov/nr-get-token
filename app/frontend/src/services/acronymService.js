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
   * @function getUsers
   * Fetch the users associated with the acronym
   * @param {string} acronym app acronym
   * @returns {Promise} An axios response
   */
  getUsers(acronym) {
    if (acronym) {
      return getokAxios().get(`${ApiRoutes.ACRONYMS}/${acronym}/users`);
    } else {
      return Promise.reject('No acronym supplied');
    }
  },

  /**
   * @function postConfigForm
   * Post the service client creation submission to the api
   * @param {object} configForm the service client creation configuration (see backend validation on route for required fields)
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
