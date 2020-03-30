import { getokAxios } from '@/services/interceptors';

export default {
  /**
   * @function getAllServiceClients
   * Fetch all registered service clients
   */
  getServiceClients() {
    return getokAxios().get('/keycloak/serviceClients', { timeout: 30000 });
  }
};
