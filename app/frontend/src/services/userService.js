import validator from 'validator';

import { getokAxios } from '@/services/interceptors';
import { ApiRoutes } from '@/utils/constants';

export default {
  /**
   * @function getUserAcronyms
   * Fetch the acronyms user `keycloakId` has access to
   * @param {string} keycloakId UUID of a keycloak user
   * @returns {Promise} An axios response
   */
  getUserAcronyms(keycloakId) {
    if (keycloakId && validator.isUUID(keycloakId)) {
      return getokAxios().get(`${ApiRoutes.USERS}/${keycloakId}/acronyms`);
    } else {
      return Promise.reject('keycloakId must be a valid UUID');
    }
  },
  /**
   * @function getServiceClients
   * Fetch the service clients for the acronyms user `keycloakId` has access to
   * @param {string} keycloakId UUID of a keycloak user
   */
  getServiceClients(keycloakId) {
    if (keycloakId && validator.isUUID(keycloakId)) {
      return getokAxios().get(`${ApiRoutes.USERS}/${keycloakId}/acronyms/clients`, { timeout: 30000 });
    } else {
      return Promise.reject('keycloakId must be a valid UUID');
    }
  }
};
