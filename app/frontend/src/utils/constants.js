export const ApiRoutes = Object.freeze({
  ACRONYMS: '/acronyms',
  AUDIT: '/audit',
  DOCS: '/docs',
  EMAIL: '/email',
  HEALTH: '/checks/status',
  KCCONFIG: '/keyCloak/configForm',
  USERS: '/users',
  WEBADE: '/webAde',
  WEBADE_CONFIGFORM: '/webAde/configForm'
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
  AVAILABLE: 'Available',
  NOT: 'Not Available'
});

export const RealmRoles = Object.freeze({
  GETOK_ADMIN: 'GETOK_ADMIN',
  GETOK_ADMIN_ADD_USER: 'GETOK_ADMIN_ADD_USER',
  WEBADE_CFG_READ: 'WEBADE_CFG_READ',
  WEBADE_CFG_READ_ALL: 'WEBADE_CFG_READ_ALL',
  WEBADE_PERMISSION: 'WEBADE_PERMISSION',
  WEBADE_PERMISSION_NROS_DMS: 'WEBADE_PERMISSION_NROS_DMS'
});

export const WebAdeEnvs = Object.freeze({
  INT: 'CREATE',
  S1: 'S1',
  S2: 'S2',
  TEST: 'TEST',
  PROD: 'PROD'
});
