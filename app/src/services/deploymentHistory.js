const db = require('../models');
const acronymService = require('./acronym');
const userService = require('./user');

module.exports = {
  async create(acronym, appConfig, env, keycloakId) {
    const acronymObj = await acronymService.find(acronym);
    const userObj = await userService.find(keycloakId);

    // Remove passwords from service clients
    if (appConfig.serviceClients) {
      appConfig.serviceClients.forEach(sc => delete sc.secret);
    }

    let deploymentHistory;
    await db.sequelize.transaction(async t => {
      deploymentHistory = await db.DeploymentHistory.create({
        acronymId: acronymObj.acronymId,
        userId: userObj.userId,
        env: env,
        appConfig: appConfig,
      }, {
        transaction: t
      });
    });

    return deploymentHistory;
  },

  /**
   * @function getLatestEnvAction
   * Finds the latest deployment action for `env`
   * @param {string} acronymId The desired acronymId
   * @param {string} env The desired environment
   * @returns {object} A deployment history object if it exists
   */
  async getLatestEnvAction(acronymId, env) {
    const history = await db.DeploymentHistory.findAll({
      where: {
        acronymId: acronymId,
        env: env
      },
      order: [
        ['createdAt', 'DESC']
      ],
      limit: 1
    });

    return history.length ? history : null;
  },

  /**
   * @function findLatestPromotions
   * Returns an array of all latest promotions in each environment for `acronymId`
   * @param {string} acronymId The desired acronymId
   * @returns {object[]} An array of history object
   */
  async findLatestPromotions(acronymId) {
    const results = await Promise.all(['DEV', 'TEST', 'PROD'].map(env => {
      return this.getLatestEnvAction(acronymId, env);
    }));
    return results.filter(x => !!x);
  },

  /**
   * @function findHistory
   * Returns an array of the deployment history for an acronym, joined with the user records
   * @param {string} acronym The desired acronym
   * @returns {object[]} An array of history object
   */
  async findHistory(acronym) {
    return await db.Acronym.findOne({
      include: [
        {
          model: db.DeploymentHistory,
          include: [
            {
              model: db.User
            }
          ]
        }
      ],
      where: { acronym: acronym },
      order: [
        [db.DeploymentHistory, 'createdAt', 'DESC']
      ],
    });
  }
};
