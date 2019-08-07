const db = require('../models');
const acronymService = require('./acronym');

module.exports = {
  async create(acronym, appConfig, env, userId) {
    const acronymObj = await acronymService.find(acronym);

    const lifecycle = await db.Lifecycle.create({
      acronymId: acronymObj.acronymId,
      appConfig: appConfig,
      env: env
    });

    return await db.LifecycleHistory.create({
      lifecycleId: lifecycle.lifecycleId,
      userId: userId,
      previousEnv: env
    });
  },
};
