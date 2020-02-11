const db = require('../models');

module.exports = {
  async findHistory(acronym) {
    return await db.Acronym.findOne({
      where: { acronym: acronym },
      include: [
        {
          model: db.Lifecycle,
          include: [
            {
              model: db.LifecycleHistory,
              include: [
                {
                  model: db.User
                }
              ]
            }
          ]
        }
      ]
    });
  }
};
