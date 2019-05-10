const checks = require('express').Router();

const checkComponent = require('../../components/checks');

// returns the status of correspondent apis
checks.get('/status', (_req, res) => {
  const statuses = checkComponent.getStatus('test');
  res.status(200).json({
    endpoints: statuses
  });
});

module.exports = checks;
