import { getokAxios } from '@/services/interceptors';

export default {
  /**
   * @function getServiceClients
   * Fetch the service clients for the acronym
   * @param {string} acronym app acronym
   */
  getServiceClients(acronym) {
    if (acronym) {
      return getokAxios().get(`/acronyms/${acronym}/clients`, { timeout: 30000 });
    } else {
      return Promise.reject('No acronym supplied');
    }
  }
};
