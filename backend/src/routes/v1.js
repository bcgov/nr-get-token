const router = require('express').Router();
const path = require('path');
const passport = require('passport');

const webAdeRouter = require('./v1/webAde');
const checksRouter = require('./v1/checks');
const keyCloakRouter = require('./v1/keyCloak');

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
router.use('/webAde', passport.authenticate('jwt', {
  session: false
}), webAdeRouter);

// KeyCloak Client Form
router.use('/keyCloak', passport.authenticate('jwt', {
  session: false
}), keyCloakRouter);

// Checks
router.use('/checks', passport.authenticate('jwt', {
  session: false
}), checksRouter);

module.exports = router;
