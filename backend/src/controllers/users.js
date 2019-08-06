const db = require('../models');
const Acronym = db.Acronym;
const User = db.User;

module.exports = {
  async findOrCreate(keycloakId, displayName, username) {
    return await User.findOrCreate({
      where: {
        keycloakId: keycloakId
      },
      defaults: {
        displayName: displayName,
        username: username
      }
    });
  },

  async addAcronym(keycloakId, value) {
    const acronym = await Acronym.findOne({
      where: {
        acronym: value
      }
    });
    const user = await User.findOne({
      where: {
        keycloakId: keycloakId
      }
    });
    return await user.addAcronym(acronym);
  }
};
