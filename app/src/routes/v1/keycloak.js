const keyCloak = require('express').Router();
//const { param, validationResult } = require('express-validator');
const Problem = require('api-problem');
//const validator = require('validator');
const log = require('npmlog');


// fetches all the service clients for all acronyms in all KC realms
keyCloak.get('/clients', [
], async (req, res) => {
  // requires user role "GETOK_ADMIN"
  if (!req.user.jwt.realm_access.roles.includes('GETOK_ADMIN')) {
    // mock for now
    // do we need a GETOK_ADMIN permission check?
    const permissionErr = false;
    if (permissionErr) {
      return res.status(403).json({
        message: permissionErr
      });
    }
  }
  try {
    // mock for now
    // should call keycloak or admin service
    const result = 'abc';
    if (result === null) {
      return new Problem(404).send(res);
    } else {
      res.status(200).json(result);
    }


  } catch (error) {
    log.error(error);
    res.status(500).json({
      message: error.message
    });
    return res;
  }
});

module.exports = keyCloak;
