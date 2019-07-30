'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    keycloakId: DataTypes.UUID,
    displayName: DataTypes.STRING
  }, {});
  // eslint-disable-next-line no-unused-vars
  User.associate = models => {
    // associations can be defined here
  };
  return User;
};
