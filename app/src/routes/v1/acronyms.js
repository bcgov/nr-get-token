const acronymsRouter = require('express').Router();

const keycloak = require('../../components/keycloak');
const log = require('../../components/log')(module.filename);
const Problem = require('api-problem');

const acronyms = require('../../components/acronyms');
const permissionHelpers = require('../../components/permissionHelpers');

/** fetches the acronym details */
acronymsRouter.get('/:appAcronym', [], async (req, res) => {
  // Check for required permissions. Can only fetch details for the acronyms you are associated with
  const permissionErr = await permissionHelpers.checkAcronymPermission(
    req.kauth.grant.access_token.content.sub,
    req.params.appAcronym
  );
  if (permissionErr) {
    return new Problem(403, { detail: permissionErr }).send(res);
  }

  try {
    const response = await acronyms.getAcronym(req.params.appAcronym);
    if (response) {
      return res.status(200).json(response);
    } else {
      return new Problem(404).send(res);
    }
  } catch (error) {
    log.error(error);
    return new Problem(500, { detail: error.message }).send(res);
  }
});

/** Returns clients from KC for the supplied acronym */
acronymsRouter.get('/:acronym/clients', async (req, res) => {
  // Check for required permissions. Can only fetch details for the acronyms you are associated with
  const permissionErr = await permissionHelpers.checkAcronymPermission(
    req.kauth.grant.access_token.content.sub,
    req.params.acronym
  );
  if (permissionErr) {
    return new Problem(403, { detail: permissionErr }).send(res);
  }

  try {
    const result = await acronyms.getAcronymClients(req.params.acronym);
    if (result === null) {
      return new Problem(404).send(res);
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    log.error(error);
    return new Problem(500, { detail: error.message }).send(res);
  }
});

/** Returns service client history from the history table for the supplied acronym */
acronymsRouter.get('/:acronym/history', async (req, res) => {
  // Check for required permissions. Can only fetch details for the acronyms you are associated with
  const permissionErr = await permissionHelpers.checkAcronymPermission(
    req.kauth.grant.access_token.content.sub,
    req.params.acronym
  );
  if (permissionErr) {
    return new Problem(403, { detail: permissionErr }).send(res);
  }

  try {
    const result = await acronyms.getAcronymHistory(req.params.acronym);
    if (result === null) {
      return new Problem(404).send(res);
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    log.error(error);
    return new Problem(500, { detail: error.message }).send(res);
  }
});

/** Returns users from KC for the supplied acronym */
acronymsRouter.get('/:acronym/users', async (req, res) => {
  // Check for required permissions. Can only fetch details for the acronyms you are associated with
  const permissionErr = await permissionHelpers.checkAcronymPermission(
    req.kauth.grant.access_token.content.sub,
    req.params.acronym
  );
  if (permissionErr) {
    return new Problem(403, { detail: permissionErr }).send(res);
  }

  try {
    const result = await acronyms.getUsers(req.params.acronym);
    if (result === null) {
      return new Problem(404).send(res);
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    log.error(error);
    return new Problem(500, { detail: error.message }).send(res);
  }
});

// A special administrative call to add users to acronym.
acronymsRouter.post(
  '/:appAcronym/addUser/:username',
  keycloak.protect('realm:GETOK_ADMIN_ADD_USER'),
  async (req, res) => {
    if (!req.params.appAcronym || !req.params.username) {
      return new Problem(400, {
        detail: 'Must supply app acronym and user (ex: myname@idir)',
      }).send(res);
    }

    try {
      const token = req.headers.authorization.split(' ')[1];
      const ministry = req.body && req.body.ministry ? req.body.ministry : 'Not Entered';
      const contact = req.body && req.body.contact ? req.body.contact : 'Not Entered';
      const emailComments = req.body && req.body.comment ? req.body.comment : 'N/A';
      const status = req.body && req.body.status ? req.body.status : 'APPROVED';
      const nextSteps = req.body && req.body.nextSteps ? req.body.nextSteps : 'Finish Registration';
      const response = await acronyms.registerUserToAcronym(
        token,
        req.kauth.grant.access_token.content.iss,
        req.params.appAcronym,
        ministry,
        contact,
        req.params.username,
        emailComments,
        status,
        nextSteps
      );
      if (response) {
        return res.status(200).json(response);
      } else {
        return new Problem(404).send(res);
      }
    } catch (error) {
      log.error(error);
      return new Problem(500, { detail: error.message }).send(res);
    }
  }
);

// A special administrative call to get all the acronyms in the app
acronymsRouter.get('/',
  keycloak.protect('realm:GETOK_ADMIN_ADD_USER'),
  async (req, res) => {
    try {
      const response = await acronyms.getAllAcronyms();
      if (response) {
        return res.status(200).json(response);
      } else {
        return new Problem(404).send(res);
      }
    } catch (error) {
      log.error(error);
      return new Problem(500, { detail: error.message }).send(res);
    }
  }
);

module.exports = acronymsRouter;
