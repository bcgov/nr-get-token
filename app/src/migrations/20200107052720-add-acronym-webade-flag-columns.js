module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'acronym',
        'permissionWebade',
        {
          comment: 'Flag stating whether this acronym can use WebADE',
          allowNull: false,
          defaultValue: false,
          type: Sequelize.BOOLEAN
        }
      ),
      queryInterface.addColumn(
        'acronym',
        'permissionWebadeNrosDms',
        {
          comment: 'Flag stating whether this acronym can grant access to NROS documents through DMS',
          allowNull: false,
          defaultValue: false,
          type: Sequelize.BOOLEAN
        }
      ),
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([
      queryInterface.removeColumn('acronym', 'permissionWebadeNrosDms'),
      queryInterface.removeColumn('acronym', 'permissionWebade')
    ]);
  }
};
