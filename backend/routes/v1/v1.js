const router = require('express').Router();
const path = require('path');

// const auth = require('./auth/auth');
const checksRouter = require('./routes/checks');

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
  const docs = require('../../docs/docs');
  res.send(docs.getDocHTML('v1'));
});

// OpenAPI YAML Spec
router.get('/api-spec.yaml', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../docs/v1.api-spec.yaml'));
});

// Checks
router.use('/checks', checksRouter);

module.exports = router;
