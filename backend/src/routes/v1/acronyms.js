const log = require('npmlog');

const acronyms = require('express').Router();
const permissionHelpers = require('../../components/permissionHelpers');
const acronymComponent = require('../../components/acronyms');

// fetches the acronym details
acronyms.get('/:appAcronym', [
], async (req, res) => {
  // Check for required permissions. Can only fetch details for the acronyms you are associated with
  const permissionErr = await permissionHelpers.checkAcronymPermission(req.user.jwt, req.params.appAcronym);
  if (permissionErr) {
    return res.status(403).json({
      message: permissionErr
    });
  }

  try {
    const response = await acronymComponent.getAcronym(req.params.appAcronym);
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

// A special administrative call to add users to acronym. This is a temporary shim until we have an actual administrative
// section of the app in place
acronyms.get('/:appAcronym/addUser/:username', [
], async (req, res) => {
  // Check for required permissions
  if (!req.user.jwt.realm_access.roles.includes('GETOK_ADMIN_ADD_USER')) {
    return res.status(403).json({
      message: 'Access Denied'
    });
  }

  if (!req.params.appAcronym || !req.params.username) {
    res.status(400).json({
      message: 'Must supply app acronym and user (ex: myname@idir)'
    });
    return res;
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    const response = await acronymComponent.registerUserToAcronym(token, req.user.jwt.iss, req.params.appAcronym, req.params.username);
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

module.exports = acronyms;
