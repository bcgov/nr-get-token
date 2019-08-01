const User = require('../models').User;

module.exports = {
  async findOrCreate(keycloakId, displayName) {
    return await User.findOrCreate({
      where: {
        keycloakId: keycloakId,
        displayName: displayName
      }
    });
  }
};
