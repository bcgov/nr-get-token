const db = require('../models');

module.exports = {
  async findAll() {
    return await db.Acronym.findAll();
  },

  async find(acronym) {
    return await db.Acronym.findOne({
      where: {
        acronym: acronym
      }
    });
  },

  async findOrCreateList(acronymList, ministry, name = '', description = '') {
    if (typeof acronymList === 'object' && acronymList instanceof Array) {
      return Promise.all(acronymList.map(acronym => {
        return db.Acronym.findCreateFind({
          where: {
            acronym: acronym
          },
          defaults: {
            name: name,
            description: description,
            ministry: ministry
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
  },

  async acronymUserList(acronym) {
    const result = await db.Acronym.findAll({
      attributes: [],
      include: [
        {
          attributes: [
            'userId',
            'keycloakId',
            'createdAt',
            'updatedAt',
            'deletedAt',
          ],
          model: db.User,
          through: {
            model: db.UserAcronym,
            where: {
              deletedAt: null
            }
          }
        }
      ],
      where: {
        acronym: acronym
      }
    });

    if (result[0]) {
      return result[0].Users.map(usr => { return { userAcronym: usr.UserAcronym, keycloakGuid: usr.keycloakId }; });
    } else {
      return null;
    }
  }
};
