'use strict';
module.exports = (sequelize, DataTypes) => {
  const Lifecycle = sequelize.define('Lifecycle', {
    acronymId: DataTypes.INTEGER,
    appCfg: DataTypes.JSON,
    env: DataTypes.STRING
  }, {});
  Lifecycle.associate = () => {
    // associations can be defined here
  };
  return Lifecycle;
};
