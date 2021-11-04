module.exports = (sequelize, DataTypes) => {
  const DeploymentHistory = sequelize.define('DeploymentHistory', {
    historyId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      validate: {
        min: 1
      }
    },
    appConfig: {
      allowNull: false,
      comment: 'WebADE application configuration JSON Object',
      type: DataTypes.JSON
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
    comment: 'History of service client deployments for an acronym',
    tableName: 'deployment_history'
  });
  DeploymentHistory.associate = models => {
    DeploymentHistory.belongsTo(models.Acronym, {
      foreignKey: 'acronymId'
    });
    DeploymentHistory.belongsTo(models.User, {
      foreignKey: 'userId'
    });
  };
  return DeploymentHistory;
};
