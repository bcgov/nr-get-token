const log = require('npmlog');

const audit = require('express').Router();
const permissionHelpers = require('../../components/permissionHelpers');
const auditComponent = require('../../components/audit');

// fetches audit history for an application
audit.get('/:appAcronym', async (req, res) => {
  // Check for required permissions. Can only fetch details for the acronyms you are associated with
  const permissionErr = await permissionHelpers.checkAcronymPermission(req.user.jwt, req.params.appAcronym);
  if (permissionErr) {
    return res.status(403).json({
      message: permissionErr
    });
  }

  try {
    const response = await auditComponent.getHistoryByAcronym(req.params.appAcronym);
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

module.exports = audit;
