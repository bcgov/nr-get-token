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

module.exports = acronyms;
