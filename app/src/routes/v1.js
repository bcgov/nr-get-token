const router = require('express').Router();

const keycloak = require('../components/keycloak');
const helloRouter = require('./v1/hello');

// Base v1 Responder
router.get('/', (_req, res) => {
  res.status(200).json({
    endpoints: [
      '/hello'
    ]
  });
});

/** Hello Router */
router.use('/hello', keycloak.protect(), helloRouter);

module.exports = router;
