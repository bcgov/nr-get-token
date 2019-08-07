const db = require('../models');

module.exports = {
  async find(acronym) {
    return await db.Acronym.findOne({
      where: {
        acronym: acronym
      }
    });
  },

  async findOrCreateList(acronymList, name = '') {
    return db.sequelize.transaction(t => {
      if (typeof acronymList === 'object' && acronymList instanceof Array) {
        return Promise.all(acronymList.map(acronym => {
          db.Acronym.findOrCreate({
            where: {
              acronym: acronym
            },
            defaults: {
              name: name
            },
            transaction: t
          });
        }));
      }
    });
  },

  async updateName(acronym, name) {
    return await db.Acronym.update({
      name: name
    }, {
      where: {
        acronym: acronym
      }
    });
  }
};
