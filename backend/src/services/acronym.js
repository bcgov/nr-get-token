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
    if (typeof acronymList === 'object' && acronymList instanceof Array) {
      return Promise.all(acronymList.map(acronym => {
        return db.Acronym.findCreateFind({
          where: {
            acronym: acronym
          },
          defaults: {
            name: name
          }
        });
      }));
    }
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
