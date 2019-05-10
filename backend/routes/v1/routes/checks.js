// Path /v1/permissions/
const checks = require('express').Router();
// const log = require('npmlog');

// returns the health of this api
checks.get('/health', (_req, res) => {
  res.status(200).end();
});

// returns the status of correspondent apis
checks.get('/status', (_req, res) => {
  console.log("In status endpoint. SDLKJDFSDFKB")
  // TODO: Migrate json object to component level
  res.status(200).json({
    endpoints: []
  });
});

module.exports = checks;
