const baseRoot = '/api';

const apiRoot = `${baseRoot}/v1`;
export const ApiRoutes = Object.freeze({
  ACRONYMS: `${apiRoot}/acronyms`,
  DOCS: `${apiRoot}/docs`,
  EMAIL: `${apiRoot}/email`,
  HEALTH: `${apiRoot}/checks/status`,
  KCCONFIG: `${apiRoot}/keyCloak/configForm`,
  WEBADE: `${apiRoot}/webAde`,
  WEBADE_CFG : 'appConfig',
  WEBADE_CONFIGFORM: `${apiRoot}/webAde/configForm`,
  WEBADE_DEP : 'dependencies',
  WEBADE_PREFS_INSECURE : 'preferences/insecurePrefs'
});

const authRoot = `${baseRoot}/auth`;
export const AuthRoutes = Object.freeze({
  LOGIN: `${authRoot}/login`,
  LOGOUT: `${authRoot}/logout`,
  REFRESH: `${authRoot}/refresh`,
  TOKEN: `${authRoot}/token`,
});

const apiStore = 'https://i1api.nrs.gov.bc.ca';
export const CommonServiceRoutes = Object.freeze({
  TOKEN: `${apiStore}/oauth2/v1/oauth/token?disableDeveloperFilter=true&grant_type=client_credentials&scope=`,
});

export const FieldValidations = Object.freeze({
  ACRONYM_MAX_LENGTH: 30,
  ACRONYM_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 120,
  DESCRIPTION_MAX_LENGTH: 2000,
  DESCRIPTION_MAX_LENGTH_KC: 255,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 60
});
