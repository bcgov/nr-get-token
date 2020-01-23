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
      )
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([
      queryInterface.removeColumn('acronym', 'description')
    ]);
  }
};
