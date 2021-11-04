module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.createTable('deployment_history', {
          historyId: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          acronymId: {
            allowNull: false,
            references: {
              model: 'acronym',
              key: 'acronymId'
            },
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
          deletedAt: {
            allowNull: true,
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
          env: {
            allowNull: false,
            comment: 'What environment this acronym service client was deployed to',
            type: Sequelize.STRING(4)
          },
          appConfig: {
            allowNull: false,
            comment: 'Application configuration JSON Object (for legacy record tracking)',
            type: Sequelize.JSON
          }
        }, {
          comment: 'History of service client deployments for an acronym',
          transaction: t
        })
          .then(() => queryInterface.addIndex('deployment_history', ['acronymId'], { transaction: t }))
          .then(() => queryInterface.sequelize.query(`
            INSERT INTO deployment_history ("acronymId", "createdAt", "updatedAt", "userId", "env", "appConfig")
            SELECT l."acronymId", lh."createdAt", lh."updatedAt", lh."userId", lh."env", l."appConfig" FROM lifecycle_history lh
            INNER JOIN lifecycle l ON l."lifecycleId" = lh."lifecycleId";
          `, { transaction: t }))
      ]);
    });
  },

  down: queryInterface => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.dropTable('deployment_history', {
          transaction: t
        })
      ]);
    });
  }
};
