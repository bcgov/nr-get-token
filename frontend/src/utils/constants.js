export const FieldValidations = Object.freeze({
  ACRONYM_MAX_LENGTH: 30,
  ACRONYM_MIN_LENGTH: 4,
  NAME_MAX_LENGTH: 120,
  DESCRIPTION_MAX_LENGTH: 2000,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 60
});

const topLevel = '/api/v1';
export const ApiRoutes = Object.freeze({
  STATUS: `${topLevel}/checks/status`,
  HEALTH: `${topLevel}/checks/health`,
  DOCS: `${topLevel}/docs`,
});
