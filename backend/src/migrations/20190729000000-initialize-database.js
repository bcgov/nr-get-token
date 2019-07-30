'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.createTable('acronym', {
          acronymId: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          acronym: {
            allowNull: false,
            comment: 'The application acronym',
            type: Sequelize.STRING(16)
          },
          name: {
            allowNull: false,
            comment: 'Name of the application acronym',
            type: Sequelize.STRING(64)
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
          }
        }, {
          comment: 'List of all valid application acronyms',
          transaction: t
        }),
        queryInterface.createTable('user', {
          userId: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          keycloakId: {
            allowNull: false,
            comment: 'Associated Keycloak user id',
            type: Sequelize.UUID
          },
          displayName: {
            allowNull: false,
            comment: 'Display name of the user',
            type: Sequelize.STRING(32)
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
          }
        }, {
          comment: 'List of all registered users',
          transaction: t
        })
      ]);
    });
  },

  down: queryInterface => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.dropTable('acronym', {
          transaction: t
        }),
        queryInterface.dropTable('user', {
          transaction: t
        })
      ]);
    });
  }
};
