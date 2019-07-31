'use strict';
module.exports = (sequelize, DataTypes) => {
  const Lifecycle = sequelize.define('Lifecycle', {
    lifecycleId: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID
    },
    appCfg: {
      allowNull: false,
      comment: 'WebADE application configuration JSON Object',
      type: DataTypes.JSON
    },
    env: {
      allowNull: false,
      comment: 'What environment the appplication configuration has been deployed to',
      type: DataTypes.STRING(4)
    }
  }, {
    comment: 'Current state of promotion lifecycle for an acronym',
    tableName: 'lifecycle'
  });
  Lifecycle.associate = model => {
    Lifecycle.belongsTo(model.Acronym, {
      foreignKey: 'acronymId'
    });
    Lifecycle.hasMany(model.LifecycleHistory, {
      foreignKey: 'lifecycleId'
    });
  };
  return Lifecycle;
};
