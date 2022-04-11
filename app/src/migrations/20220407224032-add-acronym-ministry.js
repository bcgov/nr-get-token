module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'acronym',
        'ministry',
        {
          comment: 'Ministry the acronym is under',
          allowNull: true,
          type: Sequelize.STRING(64)
        }
      )
    ]);
  },

  async down (queryInterface) {
    return Promise.all([
      queryInterface.removeColumn('acronym', 'ministry')
    ]);
  }
};
