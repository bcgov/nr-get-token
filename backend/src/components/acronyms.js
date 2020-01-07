const log = require('npmlog');

const {
  acronymService
} = require('../services');
const utils = require('./utils');

const acronyms = {
  /**
   * Fetch a specific acronym's application detail from GETOK database.
   * @param {string} applicationAcronym - The app specifier.
   */
  getAcronym: async (applicationAcronym) => {
    if (!applicationAcronym) {
      const errMsg = 'No app acronym supplied to getAcronym';
      log.error('getAcronym', errMsg);
      throw new Error(errMsg);
    }
    try {
      const acronymDetails = await acronymService.find(applicationAcronym);
      log.verbose('getAcronym', utils.prettyStringify(acronymDetails));
      if (acronymDetails) {
        return acronymDetails;
      } else {
        return null;
      }
    } catch (error) {
      log.error('getAcronym', error.message);
      throw new Error(`An error occured fetching acronym details from GETOK database. ${error.message}`);
    }
  }
};

module.exports = acronyms;
