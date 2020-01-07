const log = require('npmlog');

const webAde = require('express').Router();
const utils = require('../../components/utils');
const acronymComponent = require('../../components/acronyms');

// fetches the acronym details
webAde.get('/:appAcronym', [
], async (req, res) => {
  // Check for required permissions. Can only fetch details for the acronyms you are associated with
  const permissionErr = utils.checkAcronymPermission(req.user.jwt, req.params.appAcronym);
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

module.exports = webAde;
