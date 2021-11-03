module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        'user',
        'username',
        {
          allowNull: false,
          comment: 'Username as known by Keycloak',
          type: Sequelize.STRING(64)
        }
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        'user',
        'username',
        {
          allowNull: false,
          comment: 'Username as known by Keycloak',
          type: Sequelize.STRING(32)
        }
      )
    ]);
  }
};
