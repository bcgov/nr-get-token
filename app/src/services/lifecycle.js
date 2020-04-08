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

    let lifecycleHistory;
    await db.sequelize.transaction(async t => {
      const lifecycle = await db.Lifecycle.create({
        acronymId: acronymObj.acronymId,
        appConfig: appConfig,
        env: env
      }, {
        transaction: t
      });

      lifecycleHistory = await db.LifecycleHistory.create({
        lifecycleId: lifecycle.lifecycleId,
        userId: userObj.userId,
        env: env
      }, {
        transaction: t
      });
    });

    return lifecycleHistory;
  },

  /**
   * @function getLatestEnvAction
   * Finds the latest lifecycle action for `env`
   * @param {string} acronymId The desired acronymId
   * @param {string} env The desired environment
   * @returns {object} A lifecycle object if it exists
   */
  async getLatestEnvAction(acronymId, env) {
    const lifecycle = await db.Lifecycle.findAll({
      where: {
        acronymId: acronymId,
        env: env
      },
      order: [
        ['updatedAt', 'DESC']
      ],
      limit: 1
    });

    return lifecycle.length ? lifecycle : null;
  },

  /**
   * @function findLatestPromotions
   * Returns an array of all latest promotions in each environment for `acronymId`
   * @param {string} acronymId The desired acronymId
   * @returns {object[]} An array of lifecycle object
   */
  async findLatestPromotions(acronymId) {
    const results = await Promise.all(['DEV', 'TEST', 'PROD'].map(env => {
      return this.getLatestEnvAction(acronymId, env);
    }));
    return results.filter(x => !!x);
  }
};
