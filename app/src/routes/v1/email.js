const emailRouter = require('express').Router();
const { body, validationResult } = require('express-validator');
const log = require('../../components/log')(module.filename);
const Problem = require('api-problem');
const validator = require('validator');

const email = require('../../components/email');
const github = require('../../components/github');

/** Sends an application registration request email (and flag the emailed request in a github issue) */
emailRouter.post(
  '/',
  [
    body('applicationAcronym').isString(),
    body('comments').isString(),
    body('from').custom((value) => validator.isEmail(value)),
    body('idir').isString(),
  ],
  async (req, res) => {
    // Validate for Bad Requests
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return new Problem(422, {
        detail: 'Validation failed',
        errors: errors.array(),
      }).send(res);
    }

    // Kick off asynchronously in the background. If response from github is needed (get issue URL or something), can await on return val.
    // Fail quietly. If this fails let the user request go through normally (log out failure)
    try {
      github.createRequestIssue(
        req.body.applicationAcronym,
        req.body.comments,
        req.body.from,
        req.body.idir
      );
    } catch (error) {
      log.error(
        'Github issue creation failed, proceeding to send contact email anyways',
        error.message
      );
    }

    try {
      const result = await email.sendRequest(
        req.body.applicationAcronym,
        req.body.comments,
        req.body.from,
        req.body.idir
      );
      return res.status(201).json(result);
    } catch (error) {
      return new Problem(500, { detail: error.message }).send(res);
    }
  }
);

module.exports = emailRouter;
