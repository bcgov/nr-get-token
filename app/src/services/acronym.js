const db = require('../models');

module.exports = {
  async find(acronym) {
    return await db.Acronym.findOne({
      where: {
        acronym: acronym
      }
    });
  },

  async findOrCreateList(acronymList, name = '', description = '') {
    if (typeof acronymList === 'object' && acronymList instanceof Array) {
      return Promise.all(acronymList.map(acronym => {
        return db.Acronym.findCreateFind({
          where: {
            acronym: acronym
          },
          defaults: {
            name: name,
            description: description
          }
        });
      }));
    }
  },

  async updateDetails(acronym, name, description) {
    return await db.Acronym.update({
      name: name,
      description: description
    }, {
      where: {
        acronym: acronym
      }
    });
  }
};
