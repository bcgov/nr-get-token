'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserAcronym = sequelize.define('UserAcronym', {
    owner: DataTypes.BOOLEAN
  }, {});
  UserAcronym.associate = models => {
    UserAcronym.belongsTo(models.Acronym, {
      foreignKey: 'acronymId'
    });
    UserAcronym.belongsTo(models.User, {
      foreignKey: 'userId'
    });
  };
  return UserAcronym;
};
