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
      Promise.reject('keycloakId must be a valid UUID');
    }
  }
};
