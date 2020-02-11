const log = require('npmlog');

const { auditService } = require('../services');
const utils = require('./utils');

const audit = {
  /**
   * Fetch a specific acronym's history details from GETOK database.
   * @param {string} applicationAcronym - The app specifier.
   * @returns {object[]} An array containing the history of `applicationAcronym`.
   */
  getHistoryByAcronym: async applicationAcronym => {
    if (!applicationAcronym) {
      const errMsg = 'No app acronym supplied to getHistoryByAcronym';
      log.error('getHistoryByAcronym', errMsg);
      throw new Error(errMsg);
    }
    try {
      const history = await auditService.findHistory(applicationAcronym);
      log.verbose('getHistoryByAcronym', utils.prettyStringify(history));
      if (history) {
        const hsts = history.Lifecycles.map(lc => {
          return {
            acronym: history.acronym,
            date: lc.createdAt,
            details: lc.appConfig,
            environment: lc.env,
            user: lc.LifecycleHistories[0].User.username
          };
        });
        return hsts;
      } else {
        return [];
      }
    } catch (error) {
      log.error('getHistoryByAcronym', error.message);
      throw new Error(`An error occured fetching audit history from GETOK database. ${error.message}`);
    }
  }
};

module.exports = audit;
