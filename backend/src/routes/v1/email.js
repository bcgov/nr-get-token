//const config = require('config');
const log = require('npmlog');

const {
  body,
  validationResult
} = require('express-validator');

const email = require('express').Router();
const emailComponent = require('../../components/email');

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
    const emailCallRes = await emailComponent.sendContactEmail(req.body.applicationAcronym, req.body.comments, req.body.from, req.body.idir);
    return res.status(201).json(emailCallRes);
  } catch (error) {
    log.error(error);
    res.status(500).json({
      message: error.message
    });
    return res;
  }
});

module.exports = email;
