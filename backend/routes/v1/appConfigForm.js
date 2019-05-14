const axios = require('axios');
const config = require('config');
const log = require('npmlog');

const appConfig = require('express').Router();
const {
  body,
  validationResult
} = require('express-validator/check');

// const appConfigComponent = require('../../components/appConfig');
const utils = require('../../components/utils');

// submits a webade application configuration
// TODO: change this to non-shim version
appConfig.post('/', [
  // Temporarily block submissions to just MSSC acronym
  body('applicationAcronym').equals('MSSC')
], async (req, res) => {
  const endpoint = config.get('serviceClient.getok.endpoint');
  const path = '/applicationConfigurations';
  const url = endpoint + path;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  try {
    const username = config.get('serviceClient.getok.username');
    const password = config.get('serviceClient.getok.password');

    const token = await utils.getWebAdeToken(username, password, 'WEBADE-REST');
    if (!token) {
      res.status(500).json({
        error: 500,
        message: 'Unable to acquire access_token'
      });
    }

    const response = await axios.post(url, req.body, {
      headers: {
        'Authorization': `Bearer ${token.access_token}`,
        'Content-Type': 'application/json; charset=utf-8'
      }
    });

    log.verbose(utils.prettyStringify(response.data));
    return res.status(200).json(response.data);
  } catch (error) {
    log.error(error);
    return res.status(500).end();
  }
});

module.exports = appConfig;
