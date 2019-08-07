const db = require('../models');

module.exports = {
  async findOrCreate(keycloakId, displayName, username) {
    return await db.User.findOrCreate({
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
    const acronym = await db.Acronym.findOne({
      where: {
        acronym: value
      }
    });
    const user = await db.User.findOne({
      where: {
        keycloakId: keycloakId
      }
    });
    return await user.addAcronym(acronym);
  },

  async acronymOwnerList(keycloakId) {
    const result = await db.User.findAll({
      attributes: [],
      include: [
        {
          attributes: [
            'acronym'
          ],
          model: db.Acronym,
          through: {
            model: db.UserAcronym,
            where: {
              owner: true
            }
          }
        }
      ],
      where: {
        keycloakId: keycloakId
      }
    });

    return Array.from(result[0].Acronyms, x => x.acronym);
  }
};
