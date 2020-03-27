const log = require('npmlog');

const { acronymService, userService } = require('../services');
const utils = require('./utils');

const acronyms = {
  /**
   * @function getUserAcronymClients
   * Returns all service clients for all acronyms associated with a user
   * @param {string} acronym The Keycloak user GUID
   * @returns {object[]} An array of user acronym objects, null if `keycloakId` doesn't exist
   */
  getAcronymClients: async acronym => {
    log.debug('getAcronymClients', `getting clients for ${acronym}`);
    const makeItAnArray = [acronym];
    const [devClients, testClients, prodClients] = await Promise.all([
      utils.getClientsFromEnv('dev', makeItAnArray),
      utils.getClientsFromEnv('test', makeItAnArray),
      utils.getClientsFromEnv('prod', makeItAnArray)
    ]);

    const dc = devClients.find(cl => cl.clientId === `${acronym}_SERVICE_CLIENT`);
    const tc = testClients.find(cl => cl.clientId === `${acronym}_SERVICE_CLIENT`);
    const pc = prodClients.find(cl => cl.clientId === `${acronym}_SERVICE_CLIENT`);

    return {
      acronym: acronym,
      dev: dc ? dc : null,
      test: tc ? tc : null,
      prod: pc ? pc : null
    };
  },

  registerUserToAcronym: async (token, kcRealm, acronym, username) => {
    acronym = acronym.toUpperCase();
    username = username.toLowerCase();
    await acronymService.findOrCreateList([acronym]);

    // Get user details from KC
    const url = `${kcRealm.replace('realms', 'admin/realms')}/users?username=${username}`;
    log.debug('registerUserToAcronym', url);
    const auth = `Bearer ${token}`;
    const response = await axios.get(url, { headers: { Authorization: auth } });
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
