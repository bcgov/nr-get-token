const axios = require('axios');
const log = require('npmlog');

const { acronymService, userService } = require('../services');

const acronyms = {
  /**
   *  @function getAcronym
   *  Fetch a specific acronym's application detail from GETOK database.
   *  @param {string} applicationAcronym - The app specifier.
   */
  getAcronym: async applicationAcronym => {
    if (!applicationAcronym) {
      const errMsg = 'No app acronym supplied to getAcronym';
      log.error('getAcronym', errMsg);
      throw new Error(errMsg);
    }
    try {
      const acronymDetails = await acronymService.find(applicationAcronym);
      log.verbose('getAcronym', JSON.stringify(acronymDetails));
      return acronymDetails ? acronymDetails : null;
    } catch (error) {
      log.error('getAcronym', error.message);
      throw new Error(`An error occured fetching acronym details from GETOK database. ${error.message}`);
    }
  },

  registerUserToAcronym: async (token, kcRealm, acronym, username) => {
    acronym = acronym.toUpperCase();
    username = username.toLowerCase();
    await acronymService.findOrCreateList([acronym]);

    // Get user details from KC
    const url = `${kcRealm.replace('realms', 'admin/realms')}/users?username=${username}`;
    log.debug('registerUserToAcronym', url);
    const auth = `Bearer ${token}`;
    const response = await axios.get(url, { headers: { Authorization: auth }});
    const users = response.data;

    if (!users || !users.length) {
      throw new Error(`User ${username} was not found in KC.`);
    }

    // Can only be one user by identified username (idir or github or whatever)
    const user = users[0];

    if (!user.enabled) {
      throw new Error(`User ${username} was found in KC but is not enabled.`);
    }

    // Add user to DB if they don't already exist
    const dbUser = await userService.findOrCreate(user.id, `${user.firstName} ${user.lastName}`, user.username);

    // Add update user-acronym association
    const dbAcronym = await userService.addAcronym(user.id, acronym);

    return {
      user: dbUser,
      acronym: dbAcronym
    };
  }
};

module.exports = acronyms;
