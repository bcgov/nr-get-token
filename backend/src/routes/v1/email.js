//const config = require('config');
const log = require('npmlog');

const {
  body,
  validationResult
} = require('express-validator');

const email = require('express').Router();

email.post('/email', [
  body('applicationAcronym').isString(),
  body('comments').isString(),
  body('from').isString(),
  body('idir').isString(),
], async (req, res) => {
  // Validate for Bad Requests
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
      message: 'Validation failed'
    });
  }
  try {
    return res.status(200).json({
      123: 123
    });
  } catch (error) {
    log.error(error);
    res.status(500).json({
      message: error.message
    });
    return res;
  }
});

module.exports = email;
