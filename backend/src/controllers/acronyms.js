const db = require('../models');
const Acronym = db.Acronym;

module.exports = {
  async find(acronym) {
    return await Acronym.findOne({
      where: {
        acronym: acronym
      }
    });
  },

  async findOrCreateList(acronymList, name = '') {
    return db.sequelize.transaction(t => {
      if (typeof acronymList === 'object' && acronymList instanceof Array) {
        return Promise.all(acronymList.map(acronym => {
          Acronym.findOrCreate({
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
    return await Acronym.update({
      name: name
    }, {
      where: {
        acronym: acronym
      }
    });
  }
};
