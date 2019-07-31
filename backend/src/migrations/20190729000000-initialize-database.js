'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.createTable('acronym', {
          acronymId: {
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            type: Sequelize.UUID
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          acronym: {
            allowNull: false,
            comment: 'The application acronym',
            type: Sequelize.STRING(16),
            unique: true
          },
          name: {
            allowNull: false,
            comment: 'Name of the application acronym',
            type: Sequelize.STRING(64)
          }
        }, {
          comment: 'List of all valid application acronyms',
          transaction: t
        }),
        queryInterface.createTable('user', {
          userId: {
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            type: Sequelize.UUID
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          keycloakId: {
            allowNull: false,
            comment: 'Associated Keycloak user id',
            type: Sequelize.UUID,
            unique: true
          },
          displayName: {
            allowNull: false,
            comment: 'Display name of the user',
            type: Sequelize.STRING(32)
          }
        }, {
          comment: 'List of all registered users',
          transaction: t
        }),
        queryInterface.createTable('user_acronym', {
          userAcronymId: {
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            type: Sequelize.UUID
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          userId: {
            allowNull: false,
            references: {
              model: 'user',
              key: 'userId'
            },
            type: Sequelize.UUID
          },
          acronymId: {
            allowNull: false,
            references: {
              model: 'acronym',
              key: 'acronymId'
            },
            type: Sequelize.UUID
          },
          owner: {
            allowNull: false,
            comment: 'Does user have ownership privileges on acronym',
            defaultValue: false,
            type: Sequelize.BOOLEAN
          }
        }, {
          comment: 'Correlation between users and acronyms',
          transaction: t
        }),
        queryInterface.createTable('lifecycle', {
          lifecycleId: {
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            type: Sequelize.UUID
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          acronymId: {
            allowNull: false,
            references: {
              model: 'acronym',
              key: 'acronymId'
            },
            type: Sequelize.UUID
          },
          appCfg: {
            allowNull: false,
            comment: 'WebADE application configuration JSON Object',
            type: Sequelize.JSON
          },
          env: {
            allowNull: false,
            comment: 'What environment the appplication configuration has been deployed to',
            type: Sequelize.STRING(4)
          }
        }, {
          comment: 'Current state of promotion lifecycle for an acronym',
          transaction: t
        }),
        queryInterface.createTable('lifecycle_history', {
          lifecycleHistoryId: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          lifecycleId: {
            allowNull: false,
            references: {
              model: 'lifecycle',
              key: 'lifecycleId'
            },
            type: Sequelize.UUID
          },
          userId: {
            allowNull: false,
            references: {
              model: 'user',
              key: 'userId'
            },
            type: Sequelize.UUID
          },
          previousEnv: {
            allowNull: false,
            comment: 'What environment the promotion lifecycle was at',
            type: Sequelize.STRING(4)
          }
        }, {
          comment: 'History of changes to the promotion lifecycle',
          transaction: t
        })
      ]);
    });
  },

  down: queryInterface => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.dropTable('lifecycle_history', {
          transaction: t
        }),
        queryInterface.dropTable('lifecycle', {
          transaction: t
        }),
        queryInterface.dropTable('user_acronym', {
          transaction: t
        }),
        queryInterface.dropTable('user', {
          transaction: t
        }),
        queryInterface.dropTable('acronym', {
          transaction: t
        })
      ]);
    });
  }
};
