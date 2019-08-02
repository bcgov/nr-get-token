const Acronym = require('../models').Acronym;

module.exports = {
  async find(acronym) {
    return await Acronym.findOne({
      where: {
        acronym: acronym
      }
    });
  },

  async findOrCreate(acronym, name) {
    return await Acronym.findOrCreate({
      where: {
        acronym: acronym
      },
      defaults: {
        name: name
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
