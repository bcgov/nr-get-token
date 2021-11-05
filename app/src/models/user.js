module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userId: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      validate: {
        isUUID: 4
      }
    },
    keycloakId: {
      allowNull: false,
      comment: 'Associated Keycloak user id',
      type: DataTypes.UUID,
      unique: true,
      validate: {
        isUUID: 4
      }
    },
    displayName: {
      allowNull: false,
      comment: 'Display name of the user',
      type: DataTypes.STRING(32)
    },
    username: {
      allowNull: false,
      comment: 'Username as known by Keycloak',
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
    User.hasMany(model.DeploymentHistory, {
      foreignKey: 'userId'
    });
  };
  return User;
};
