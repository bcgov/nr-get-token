const db = require('../models');
const acronymService = require('./acronym');

module.exports = {
  async create(acronym, appConfig, env, userId) {
    const acronymObj = await acronymService.find(acronym);

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
        userId: userId,
        env: env
      }, {
        transaction: t
      });
    });

    return lifecycleHistory;
  },
};
