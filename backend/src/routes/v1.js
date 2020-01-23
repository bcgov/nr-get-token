const router = require('express').Router();
const path = require('path');
const passport = require('passport');
const YAML = require('yamljs');

const acronymsRouter = require('./v1/acronyms');
const checksRouter = require('./v1/checks');
const emailRouter = require('./v1/email');
const keyCloakRouter = require('./v1/keyCloak');
const webAdeRouter = require('./v1/webAde');

// Base v1 Responder
router.get('/', (_req, res) => {
  res.status(200).json({
    endpoints: [
      '/appConfigForm',
      '/checks',
      '/docs',
      '/email',
      '/kcClientForm'
    ]
  });
});

// OpenAPI Docs
router.get('/docs', (_req, res) => {
  const docs = require('../docs/docs');
  res.send(docs.getDocHTML('v1'));
});

// OpenAPI YAML Spec
router.get('/api-spec.yaml', (_req, res) => {
  res.sendFile(path.join(__dirname, '../docs/v1.api-spec.yaml'));
});

// OpenAPI JSON Spec
router.get('/api-spec.json', (_req, res) => {
  res.status(200).json(YAML.load(path.join(__dirname, '../docs/v1.api-spec.yaml')));
});

// Acronyms
router.use('/acronyms', passport.authenticate('jwt', {
  session: false
}), acronymsRouter);

// Checks
router.use('/checks', passport.authenticate('jwt', {
  session: false
}), checksRouter);

// Email
router.use('/email', passport.authenticate('jwt', {
  session: false
}), emailRouter);

// KeyCloak Client Form
router.use('/keyCloak', passport.authenticate('jwt', {
  session: false
}), keyCloakRouter);

// WebADE Application Configurations
router.use('/webAde', passport.authenticate('jwt', {
  session: false
}), webAdeRouter);


module.exports = router;
