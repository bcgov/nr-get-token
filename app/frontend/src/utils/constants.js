export const ApiRoutes = Object.freeze({
  ACRONYMS: '/acronyms',
  AUDIT: '/audit',
  DOCS: '/docs',
  EMAIL: '/email',
  HEALTH: '/checks/status',
  KC_CLIENTS: '/keycloak/serviceClients',
  KC_CONFIG: '/keycloak/configForm',
  USERS: '/users'
});

export const FieldValidations = Object.freeze({
  ACRONYM_MAX_LENGTH: 30,
  ACRONYM_MIN_LENGTH: 3,
  DESCRIPTION_MAX_LENGTH: 2000,
  DESCRIPTION_MAX_LENGTH_KC: 255,
  NAME_MAX_LENGTH: 120,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 60
});

export const KcEnv = Object.freeze({
  DEV: 'DEV',
  TEST: 'TEST',
  PROD: 'PROD'
});

export const KcClientStatus = Object.freeze({
  CREATED: 'Client Created',
  READY: 'Ready to Set Up',
  NOT: 'Not Available'
});

export const RealmRoles = Object.freeze({
  GETOK_ADMIN: 'GETOK_ADMIN',
  GETOK_ADMIN_ADD_USER: 'GETOK_ADMIN_ADD_USER',
});
