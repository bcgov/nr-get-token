const axios = require('axios');
const log = require('./log')(module.filename);

const {
  acronymService,
  deploymentHistoryService,
  userService,
} = require('../services');
const userComponent = require('./users');
const utils = require('./utils');

const acronyms = {
  /**
   *  @function getAcronym
   *  Fetch a specific acronym's application detail from GETOK database.
   *  @param {string} applicationAcronym - The app specifier.
   */
  getAcronym: async (applicationAcronym) => {
    if (!applicationAcronym) {
      const errMsg = 'No app acronym supplied to getAcronym';
      log.error(errMsg, { function: 'getAcronym' });
      throw new Error(errMsg);
    }
    try {
      const acronymDetails = await acronymService.find(applicationAcronym);
      log.verbose('acronymDetails', { function: 'getAcronym', acronymDetails: acronymDetails });
      return acronymDetails ? acronymDetails : null;
    } catch (error) {
      log.error(error.message, { function: 'getAcronym' });
      throw new Error(
        `An error occured fetching acronym details from GETOK database. ${error.message}`
      );
    }
  },


  /**
   *  @function getAllAcronyms
   *  Fetch acronyms from GETOK database.
   */
  getAllAcronyms: async () => {
    try {
      const acronymDetails = await acronymService.findAll();
      log.verbose('acronymDetails', { function: 'getAllAcronyms', acronymDetails: acronymDetails });
      return acronymDetails ? acronymDetails : [];
    } catch (error) {
      log.error(error.message, { function: 'getAllAcronyms' });
      throw new Error(
        `An error occured fetching acronym details from GETOK database. ${error.message}`
      );
    }
  },


  /**
   *  @function getUsers
   *  Fetch a specific acronym's application detail from GETOK database.
   *  @param {string} applicationAcronym - The app specifier.
   *  @returns {array} An array of acronym/user mappings. [] if none found
   */
  getUsers: async (applicationAcronym) => {
    if (!applicationAcronym) {
      const errMsg = 'No app acronym supplied to getUsers';
      log.error(errMsg, { function: 'getUsers' });
      throw new Error(errMsg);
    }
    try {
      // Get the UserAcronym mappings from the DB
      const acronymUsers = await acronymService.acronymUserList(
        applicationAcronym
      );
      if (!acronymUsers || !acronymUsers.length) {
        return [];
      }
      log.verbose('acronymUsers', { function: 'getUsers', acronymUsers: acronymUsers });

      // Get the keycloak userinfo for the relevant users
      // Could call GET /{realm}/users/{id} for each ID but more efficient to just get all users and filter server side here
      const userInfos = await userComponent.getAllGetokUsers();
      if (!userInfos || !userInfos.length) {
        log.error(
          `No users found in KC, something went wrong. ${applicationAcronym}, ${userInfos}`,
          { function: 'getUsers' }
        );
        throw new Error(
          `An error occured fetching users for acronym ${applicationAcronym}`
        );
      }

      // Build the response object we want from the endpoint, joining the info from the table and the userInfo from KC
      const filtered = acronymUsers.filter((au) =>
        userInfos.find((ui) => ui.id === au.keycloakGuid)
      );
      const users = filtered.map((au) => {
        const kcUsr = userInfos.find((ui) => ui.id === au.keycloakGuid);
        return {
          userAcronymDetails: {
            acronym: applicationAcronym,
            owner: au.userAcronym.owner,
            createdAt: au.userAcronym.createdAt,
          },
          user: {
            userId: au.userAcronym.userId,
            keycloakGuid: kcUsr.id,
            username: kcUsr.username,
            firstName: kcUsr.firstName,
            lastName: kcUsr.lastName,
            email: kcUsr.email,
          },
        };
      });
      log.verbose('users', { function: 'getUsers', users: users });

      return users;
    } catch (error) {
      log.error(error.message, { function: 'getUsers' });
      throw new Error(
        `An error occured fetching users for acronym ${applicationAcronym}. ${error.message}`
      );
    }
  },

  /**
   * @function getUserAcronymClients
   * Returns all service clients for all acronyms associated with a user
   * @param {string} acronym The Keycloak user GUID
   * @returns {object[]} An array of user acronym objects, null if `keycloakId` doesn't exist
   */
  getAcronymClients: async (acronym) => {
    log.debug(`getting clients for ${acronym}`, {
      function: 'getAcronymClients',
    });
    const makeItAnArray = [acronym];
    const [devClients, testClients, prodClients] = await Promise.all([
      utils.getClientsFromEnv('dev', makeItAnArray),
      utils.getClientsFromEnv('test', makeItAnArray),
      utils.getClientsFromEnv('prod', makeItAnArray),
    ]);

    const dc = devClients.find(
      (cl) => cl.clientId === `${acronym}_SERVICE_CLIENT`
    );
    const tc = testClients.find(
      (cl) => cl.clientId === `${acronym}_SERVICE_CLIENT`
    );
    const pc = prodClients.find(
      (cl) => cl.clientId === `${acronym}_SERVICE_CLIENT`
    );

    return {
      acronym: acronym,
      dev: dc ? dc : null,
      test: tc ? tc : null,
      prod: pc ? pc : null,
    };
  },

  /**
   * @function getAcronymHistory
   * Returns deployment history records for an acronym
   * @param {string} acronym The acronym
   * @returns {object[]} An array of history objects
   */
  getAcronymHistory: async (acronym) => {
    log.debug(`getting history for ${acronym}`, {
      function: 'getAcronymHistory',
    });
    return await deploymentHistoryService.findHistory(acronym);
  },

  registerUserToAcronym: async (token, kcRealm, acronym, username) => {
    log.info(`Request made to add ${username} to ${acronym}`, {
      function: 'registerUserToAcronym',
    });

    acronym = acronym.toUpperCase();
    username = username.toLowerCase();
    await acronymService.findOrCreateList([acronym]);

    // Get user details from KC
    const url = `${kcRealm.replace(
      'realms',
      'admin/realms'
    )}/users?username=${username}`;
    log.debug(url, { function: 'registerUserToAcronym' });
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
    const dbUser = await userService.findOrCreate(
      user.id,
      `${user.firstName} ${user.lastName}`,
      user.username
    );

    // Add update user-acronym association
    const dbAcronym = await userService.addAcronym(user.id, acronym);

    return {
      user: dbUser,
      acronym: dbAcronym,
    };
  },
};

module.exports = acronyms;
