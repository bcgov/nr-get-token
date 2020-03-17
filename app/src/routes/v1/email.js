const emailRouter = require('express').Router();
const { body, validationResult } = require('express-validator');
const Problem = require('api-problem');
const validator = require('validator');

const email = require('../../components/email');

/** Sends an application registration request email */
emailRouter.post('/', [
  body('applicationAcronym').isString(),
  body('comments').isString(),
  body('from').custom(value => validator.isEmail(value)),
  body('idir').isString(),
], async (req, res) => {
  // TODO: Move this into middleware or equivalent
  // Validate for Bad Requests
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return new Problem(422, {
      detail: 'Validation failed',
      errors: errors.array()
    }).send(res);
  }

  try {
    const result = await email.sendRequest(req.body.applicationAcronym, req.body.comments, req.body.from, req.body.idir);
    return res.status(201).json(result);
  } catch (error) {
    return new Problem(500, { detail: error.message }).send(res);
  }
});

module.exports = emailRouter;
