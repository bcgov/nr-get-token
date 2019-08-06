const db = require('../models');
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

  async addAcronym(keycloakId, acronym) {
    const user = await User.findOne({
      where: {
        keycloakId: keycloakId
      }
    });
    return await user.addAcronym(acronym, { through: db.UserAcronym } );
  }
};
