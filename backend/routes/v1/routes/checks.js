// Path /v1/permissions/
const checks = require('express').Router();
const log = require('npmlog');

// returns the status of correspondent apis
checks.get('/health', (_req, res) => {
  // TODO: Migrate json object to component level
  res.status(200).json({
    endpoints: []
  });
});

// returns the health of this api
checks.get('/status', (_req, res) => {
  res.status(200).end();
});

module.exports = checks;
