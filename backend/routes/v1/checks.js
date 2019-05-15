const checks = require('express').Router();

const checkComponent = require('../../components/checks');

// returns the status of correspondent apis
checks.get('/status', async (_req, res) => {
  const statuses = await checkComponent.getStatus();

  if(statuses instanceof Array) {
    res.status(200).json({
      endpoints: statuses
    });
  } else {
    res.status(500).json({
      error: 500,
      message: 'Unable to get api status list'
    });
  }
});

// TEMPORARY - returns a valid webade token
checks.get('/gettoken', async (_req, res) => {
  const config = require('config');
  const utils = require('../../components/utils');

  const username = config.get('serviceClient.getok.username');
  const password = config.get('serviceClient.getok.password');

  const token = await utils.getWebAdeToken(username, password, 'WEBADE-REST');
  if('access_token' in token) {
    res.status(200).json(token.access_token);
  } else {
    res.status(500).json({
      error: 500,
      message: 'Unable to acquire access_token'
    });
  }
});

module.exports = checks;
