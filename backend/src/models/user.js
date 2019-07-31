'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    keycloakId: DataTypes.UUID,
    displayName: DataTypes.STRING
  }, {});
  User.associate = (model) => {
    User.belongsToMany(model.Acronym, {
      through: model.UserAcronym
    });
  };
  return User;
};
