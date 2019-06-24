const checks = require('express').Router();

const checkComponent = require('../../components/checks');

// returns the status of correspondent apis
checks.get('/status', async (_req, res) => {
  const statuses = await checkComponent.getStatus();

  if (statuses instanceof Array) {
    res.status(200).json({
      endpoints: statuses
    });
  } else {
    res.status(500).json({
      message: 'Unable to get api status list'
    });
  }
});

module.exports = checks;
