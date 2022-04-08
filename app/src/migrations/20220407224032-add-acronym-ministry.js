module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'acronym',
        'ministry',
        {
          comment: 'Ministry the acronym is under',
          allowNull: false,
          defaultValue: 'None Entered',
          type: Sequelize.STRING(64)
        }
      ),
      queryInterface.addColumn(
        'acronym',
        'contact',
        {
          comment: 'Primary contact. Generally the email of either the Product Owner or Technical Lead',
          allowNull: false,
          defaultValue: 'None Entered',
          type: Sequelize.STRING(255)
        }
      )
    ]);
  },

  async down (queryInterface) {
    return Promise.all([
      queryInterface.removeColumn('acronym', 'contact'),
      queryInterface.removeColumn('acronym', 'ministry'),
    ]);
  }
};
