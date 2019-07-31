'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserAcronym = sequelize.define('UserAcronym', {
    userAcronymId: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      validate: {
        isUUID: 4
      }
    },
    owner: {
      allowNull: false,
      comment: 'Does user have ownership privileges on acronym',
      defaultValue: false,
      type: DataTypes.BOOLEAN
    }
  }, {
    comment: 'Correlation between users and acronyms',
    tableName: 'user_acronym'
  });
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
