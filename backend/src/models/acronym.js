'use strict';
module.exports = (sequelize, DataTypes) => {
  const Acronym = sequelize.define('Acronym', {
    acronym: DataTypes.STRING,
    name: DataTypes.STRING
  }, {});
  Acronym.associate = (model) => {
    Acronym.belongsToMany(model.User, {
      through: model.UserAcronym
    });
  };
  return Acronym;
};
