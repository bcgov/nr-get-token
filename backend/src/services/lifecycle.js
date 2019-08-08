const db = require('../models');
const acronymService = require('./acronym');
const userService = require('./user');

module.exports = {
  async create(acronym, appConfig, env, keycloakId) {
    const acronymObj = await acronymService.find(acronym);
    const userObj = await userService.find(keycloakId);

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
};
