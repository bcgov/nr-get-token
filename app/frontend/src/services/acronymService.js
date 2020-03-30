import { getokAxios } from '@/services/interceptors';

import { ApiRoutes } from '@/utils/constants';

export default {
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
  }
};
