'use strict';
module.exports = (sequelize, DataTypes) => {
  const LifecycleHistory = sequelize.define('LifecycleHistory', {
    lifecycleHistoryId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      validate: {
        min: 1
      }
    },
    previousEnv: {
      allowNull: false,
      comment: 'What environment the promotion lifecycle was at',
      type: DataTypes.STRING(4),
      validate: {
        isIn: [
          ['INT', 'TEST', 'PROD']
        ]
      }
    }
  }, {
    comment: 'History of changes to the promotion lifecycle',
    tableName: 'lifecycle_history'
  });
  LifecycleHistory.associate = models => {
    LifecycleHistory.belongsTo(models.Lifecycle, {
      foreignKey: 'lifecycleId'
    });
    LifecycleHistory.belongsTo(models.User, {
      foreignKey: 'userId'
    });
  };
  return LifecycleHistory;
};