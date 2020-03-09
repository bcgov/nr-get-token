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
    env: {
      allowNull: false,
      comment: 'What environment this history event was deployed to',
      type: DataTypes.STRING(4),
      validate: {
        isIn: [
          ['INT', 'TEST', 'PROD', 'DEV']
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
