module.exports = {
  up: (queryInterface) => {
    return Promise.all([
      // Remove these unused fields as part of Webade sunsetting
      queryInterface.removeColumn('acronym', 'permissionWebadeNrosDms'),
      queryInterface.removeColumn('acronym', 'permissionWebade')
    ]);

  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      // Put them back (though any data would be lost, but they're unused)
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
  }
};
