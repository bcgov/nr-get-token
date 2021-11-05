const db = require('../models');

module.exports = {
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
      where: { acronym: acronym }
    });
  }
};
