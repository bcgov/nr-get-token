'use strict';
module.exports = (sequelize, DataTypes) => {
  const Acronym = sequelize.define('Acronym', {
    acronym: DataTypes.STRING,
    name: DataTypes.STRING
  }, {});
  // eslint-disable-next-line no-unused-vars
  Acronym.associate = models => {
    // associations can be defined here
  };
  return Acronym;
};
