
const config = require('config');
const fs = require('fs');
const path = require('path');
const router = require('express').Router();
const yaml = require('js-yaml');

const keycloak = require('../components/keycloak');
const acronymsRouter = require('./v1/acronyms');
const checksRouter = require('./v1/checks');
const emailRouter = require('./v1/email');
const usersRouter = require('./v1/users');
const keycloakRouter = require('./v1/keycloak');

const getSpec = () => {
  const rawSpec = fs.readFileSync(path.join(__dirname, '../docs/v1.api-spec.yaml'), 'utf8');
  const spec = yaml.load(rawSpec);
  spec.servers[0].url = `${config.get('server.basePath')}/api/v1`;
  spec.components.securitySchemes.OpenID.openIdConnectUrl = `${config.get('server.keycloak.serverUrl')}/realms/${config.get('server.keycloak.realm')}/.well-known/openid-configuration`;
  return spec;
};

/** Base v1 Responder */
router.get('/', (_req, res) => {
  res.status(200).json({
    endpoints: [
      '/acronyms',
      '/checks',
      '/docs',
      '/email',
      '/keycloak',
      '/users'
    ]
  });
});

/** OpenAPI Docs */
router.get('/docs', (_req, res) => {
  const docs = require('../docs/docs');
  res.send(docs.getDocHTML('v1'));
});

/** OpenAPI YAML Spec */
router.get('/api-spec.yaml', (_req, res) => {
  res.status(200).type('application/yaml').send(yaml.dump(getSpec()));
});

/** OpenAPI JSON Spec */
router.get('/api-spec.json', (_req, res) => {
  res.status(200).json(getSpec());
});

/** Acronyms Router */
router.use('/acronyms', keycloak.protect(), acronymsRouter);

/** Checks Router */
router.use('/checks', keycloak.protect(), checksRouter);

/** Email Router */
router.use('/email', keycloak.protect(), emailRouter);

/** Keycloak Router */
router.use('/keycloak', keycloak.protect(), keycloakRouter);

/** Users Router */
router.use('/users', keycloak.protect(), usersRouter);

module.exports = router;
