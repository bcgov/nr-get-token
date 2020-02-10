const log = require('npmlog');

// const {
//   auditService
// } = require('../services');
const utils = require('./utils');

const audit = {
  /**
   * Fetch a specific acronym's history details from GETOK database.
   * @param {string} applicationAcronym - The app specifier.
   */
  getHistoryByAcronym: async (applicationAcronym) => {
    if (!applicationAcronym) {
      const errMsg = 'No app acronym supplied to getHistoryByAcronym';
      log.error('getHistoryByAcronym', errMsg);
      throw new Error(errMsg);
    }
    try {
      //const history = await auditService.find(applicationAcronym);
      const history = [1, 2, 3];
      log.verbose('getHistoryByAcronym', utils.prettyStringify(history));
      if (history) {
        return history;
      } else {
        return [];
      }
    } catch (error) {
      log.error('getHistoryByAcronym', error.message);
      throw new Error(`An error occured fetching acronym history from GETOK database. ${error.message}`);
    }
  }
};

module.exports = audit;
