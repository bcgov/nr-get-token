const router = require('express').Router();
const path = require('path');
const passport = require('passport');

// const auth = require('./auth/auth');
const appConfigRouter = require('./v1/appConfig');
const appConfigFormRouter = require('./v1/appConfigForm');
const checksRouter = require('./v1/checks');
const kcClientFormRouter = require('./v1/kcClientForm');

// Base v1 Responder
router.get('/', (_req, res) => {
  res.status(200).json({
    endpoints: [
      '/appConfigForm',
      '/checks',
      '/docs',
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

// WebADE Application Configurations
router.use('/appConfig', passport.authenticate('jwt', {
  session: false
}), appConfigRouter);

// Application Configuration Form
router.use('/appConfigForm', passport.authenticate('jwt', {
  session: false
}), appConfigFormRouter);

// KeyCloak Client Form
router.use('/kcClientForm', passport.authenticate('jwt', {
  session: false
}), kcClientFormRouter);

// Checks
router.use('/checks', passport.authenticate('jwt', {
  session: false
}), checksRouter);

module.exports = router;
