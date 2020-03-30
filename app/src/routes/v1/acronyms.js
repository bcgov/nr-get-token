const acronymsRouter = require('express').Router();

const keycloak = require('../../components/keycloak');
const { validationResult } = require('express-validator');
const log = require('npmlog');
const Problem = require('api-problem');

const acronyms = require('../../components/acronyms');

/** Returns clients from KC for the supplied acronym*/
acronymsRouter.get('/:acronym/clients', [
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

  const result = await acronyms.getAcronymClients(req.params.acronym);
  if (result === null) {
    return new Problem(404).send(res);
  } else {
    res.status(200).json(result);
  }
});

// A special administrative call to add users to acronym. This is a temporary shim until we have an actual administrative
// section of the app in place
acronymsRouter.get('/:appAcronym/addUser/:username', keycloak.protect('realm:GETOK_ADMIN_ADD_USER'),
  async (req, res) => {
    if (!req.params.appAcronym || !req.params.username) {
      res.status(400).json({
        message: 'Must supply app acronym and user (ex: myname@idir)'
      });
      return res;
    }

    try {
      const token = req.headers.authorization.split(' ')[1];
      const response = await acronyms.registerUserToAcronym(token, req.kauth.grant.access_token.content.iss, req.params.appAcronym, req.params.username);
      if (response) {
        return res.status(200).json(response);
      } else {
        return res.status(404).end();
      }
    } catch (error) {
      log.error(error);
      res.status(500).json({
        message: error.message
      });
      return res;
    }
  });


module.exports = acronymsRouter;
