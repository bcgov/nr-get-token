const baseRoot = '/api';

const apiRoot = `${baseRoot}/v1`;
export const ApiRoutes = Object.freeze({
  APPCONFIG: `${apiRoot}/appConfigForm`,
  DOCS: `${apiRoot}/docs`,
  HEALTH: `${apiRoot}/checks/status`,
});

const authRoot = `${baseRoot}/auth`;
export const AuthRoutes = Object.freeze({
  LOGIN: `${authRoot}/login`,
  LOGOUT: `${authRoot}/logout`,
  REFRESH: `${authRoot}/refresh`,
  TOKEN: `${authRoot}/token`,
});

export const FieldValidations = Object.freeze({
  ACRONYM_MAX_LENGTH: 30,
  ACRONYM_MIN_LENGTH: 4,
  NAME_MAX_LENGTH: 120,
  DESCRIPTION_MAX_LENGTH: 2000,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 60
});
