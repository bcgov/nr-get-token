const log = require('npmlog');

const appConfig = require('express').Router();
const {
  body,
  validationResult
} = require('express-validator/check');

const appConfigComponent = require('../../components/appConfig');

// submits a webade application configuration
appConfig.post('/', [
  // Temporarily block submissions to just MSSC acronym
  body('applicationAcronym').equals('MSSC')
], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  try {
    const response = await appConfigComponent.postAppConfig(req.body);
    return res.status(200).json(response);
  } catch (error) {
    log.error(error);
    res.status(500).json({
      error: 500,
      message: error.message
    });
    return res;
  }
});

module.exports = appConfig;
