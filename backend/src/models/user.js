'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userId: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID
    },
    keycloakId: {
      allowNull: false,
      comment: 'Associated Keycloak user id',
      type: DataTypes.UUID,
      unique: true
    },
    displayName: {
      allowNull: false,
      comment: 'Display name of the user',
      type: DataTypes.STRING(32)
    }
  }, {
    comment: 'List of all registered users',
    tableName: 'user'
  });
  User.associate = (model) => {
    User.belongsToMany(model.Acronym, {
      foreignKey: 'userId',
      through: model.UserAcronym
    });
    User.hasMany(model.LifecycleHistory, {
      foreignKey: 'userId'
    });
  };
  return User;
};
