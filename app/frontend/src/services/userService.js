import validator from 'validator';
import { getokAxios } from '@/services/interceptors';

export default {
  /**
   * @function getUserAcronyms
   * Fetch the acronyms user `keycloakId` has access to
   * @param {string} keycloakId UUID of a keycloak user
   */
  getUserAcronyms(keycloakId) {
    if (keycloakId && validator.isUUID(keycloakId)) {
      return getokAxios().get(`/users/${keycloakId}/acronyms`);
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
      return getokAxios().get(`/users/${keycloakId}/acronyms/clients`);
    } else {
      return Promise.reject('keycloakId must be a valid UUID');
    }
  }
};
