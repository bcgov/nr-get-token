const router = require('express').Router();
const path = require('path');
const passport = require('passport');

// const auth = require('./auth/auth');
const appConfigFormRouter = require('./v1/appConfigForm');
const checksRouter = require('./v1/checks');

// Base v1 Responder
router.get('/', (_req, res) => {
  res.status(200).json({
    endpoints: [
      '/appConfig',
      '/checks',
      '/validation'
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

// Application Configuration Form
router.use('/appConfigForm', passport.authenticate('jwt', {
  session: false
}), appConfigFormRouter);

// Checks
router.use('/checks', passport.authenticate('jwt', {
  session: false
}), checksRouter);

module.exports = router;
