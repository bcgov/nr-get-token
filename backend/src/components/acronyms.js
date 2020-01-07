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
      log.error('getAcronym', 'No app acronym supplied to getAcronym');
      throw new Error('No app acronym supplied to getAcronym');
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
