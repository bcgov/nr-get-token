module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'acronym',
        'description',
        {
          comment: 'Description of the application',
          allowNull: false,
          defaultValue: 'None Entered',
          type: Sequelize.STRING(255)
        }
      ),
      queryInterface.changeColumn(
        'acronym',
        'name',
        {
          allowNull: false,
          comment: 'Name of the application acronym',
          type: Sequelize.STRING(120)
        }
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        'acronym',
        'name',
        {
          allowNull: false,
          comment: 'Name of the application acronym',
          type: Sequelize.STRING(64)
        }
      ),
      queryInterface.removeColumn('acronym', 'description')
    ]);
  }
};
