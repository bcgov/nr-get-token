'use strict';
module.exports = (sequelize, DataTypes) => {
  const LifecycleHistory = sequelize.define('LifecycleHistory', {
    previousEnv: DataTypes.STRING
  }, {});
  LifecycleHistory.associate = models => {
    LifecycleHistory.hasOne(models.Lifecycle, {
      foreignKey: 'lifecycleId'
    });
  };
  return LifecycleHistory;
};
