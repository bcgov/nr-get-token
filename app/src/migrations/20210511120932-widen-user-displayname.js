module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        'user',
        'displayName',
        {
          allowNull: false,
          comment: 'Display name of the user',
          type: Sequelize.STRING(64)
        }
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        'user',
        'displayName',
        {
          allowNull: false,
          comment: 'Display name of the user',
          type: Sequelize.STRING(32)
        }
      )
    ]);
  }
};
