const router = require('express').Router();
const path = require('path');

// const auth = require('./auth/auth');
const checksRouter = require('./routes/checks');

// OpenAPI Docs
router.use('/docs', (_req, res) => {
  const docs = require('../../docs/docs');
  res.send(docs.getDocHTML('v1'));
});

// OpenAPI YAML Spec
router.use('/api-spec.yaml', (_req, res) => {
  res.sendFile(path.join(__basedir, '/static/v1.api-spec.yaml'));
});

// Checks
router.use('/checks', checksRouter);

module.exports = router;
