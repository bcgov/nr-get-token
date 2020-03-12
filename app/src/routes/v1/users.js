const usersRouter = require('express').Router();
const { param, validationResult } = require('express-validator');
const Problem = require('api-problem');
const validator = require('validator');

const users = require('../../components/users');

/** Returns acronyms associated with a user */
usersRouter.get('/:keycloakId/acronyms', [
  param('keycloakId', 'Must be a valid UUID')
    .exists().custom(value => validator.isUUID(value))
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

  const result = await users.getUserAcronyms(req.params.keycloakId);
  if (result === null) {
    return new Problem(404).send(res);
  } else {
    res.status(200).json(result);
  }
});

module.exports = usersRouter;
