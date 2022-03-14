import { getokAxios } from '@/services/interceptors';

import { ApiRoutes } from '@/utils/constants';

export default {
  /**
   * @function getAllAcronyms
   * Fetch acronyms
   * @returns {Promise} An axios response
   */
  getAllAcronyms() {
    return getokAxios().get(`${ApiRoutes.ACRONYMS}/`);
  },

  /**
   * @function getAcronym
   * Fetch acronym details
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
 * @function getServiceClientHistory
 * Fetch the history for the acronym
 * @param {string} acronym app acronym
 * @returns {Promise} An axios response
 */
  getServiceClientHistory(acronym) {
    if (acronym) {
      return getokAxios().get(`${ApiRoutes.ACRONYMS}/${acronym}/history`, { timeout: 30000 });
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
  },

  /**
   * @function registerUserToAcronym
   * Associate an IDIR with an acronym and email the registration email
   * @param {string} acronym app acronym
   * @param {string} idir the user to register
   * @param {object} body the POST request body
   * @returns {Promise} An axios response
   */
  registerUserToAcronym(acronym, idir, body) {
    if (acronym && idir) {
      return getokAxios().post(`${ApiRoutes.ACRONYMS}/${acronym}/addUser/${idir}`, body);
    } else {
      return Promise.reject('No acronym or IDIR supplied');
    }
  }
};
