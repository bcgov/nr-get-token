const now = new Date();

const acronymData = [
  {
    acronymId: '00000000-0000-4000-8000-000000000000',
    acronym: 'TEMP',
    name: 'Temp application name',
    description: 'Temp application description',
    permissionWebade: true
  },
  {
    acronymId: '00000000-0000-4000-8001-000000000000',
    acronym: 'WORG',
    name: 'Hello name',
    description: 'Hello description',
    permissionWebade: false
  }
];

const userData = [
  {
    userId: '00000000-0000-4001-8000-000000000000',
    keycloakId: '00346864-c787-450c-a217-35ddf19f1454',
    displayName: 'Jeremy Ho',
    username: 'jerho@idir'
  },
  {
    userId: '00000000-0000-4001-8001-000000000000',
    keycloakId: '463e8a71-8bdd-49fb-9a35-e9a8827bab05',
    displayName: 'Jason Sherman',
    username: 'jsherman@idir'
  },
  {
    userId: '00000000-0000-4001-8002-000000000000',
    displayName: 'Lucas O\'Neil',
    keycloakId: '4b5d0a2f-63a0-4c18-9d70-753648b8e7a9',
    username: 'loneil@idir'
  },
  {
    userId: '00000000-0000-4001-8003-000000000000',
    displayName: 'Matthew Hall',
    keycloakId: 'ecf176ab-900c-4503-b075-4e863f3226c9',
    username: 'mahall@idir'
  },
  {
    userId: '00000000-0000-4001-8004-000000000000',
    displayName: 'Tim Csaky',
    keycloakId: '5d9142e6-af23-4085-9a98-cc1f6f1e6612',
    username: 'tcsaky@idir'
  }
];

const userAcronymData = (() => {
  let id = 8000;
  return [].concat(...acronymData.map(acronym => userData.map(user => {
    return {
      userAcronymId: `00000000-0000-4002-${id++}-000000000000`,
      userId: user.userId,
      acronymId: acronym.acronymId,
      owner: true
    };
  })));
})();

module.exports = {
  up: queryInterface => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.bulkInsert('acronym', acronymData.map(entry => {
          return { ...entry, createdAt: now, updatedAt: now };
        }), { transaction: t }),
        queryInterface.bulkInsert('user', userData.map(entry => {
          return { ...entry, createdAt: now, updatedAt: now };
        }), { transaction: t }),
        queryInterface.bulkInsert('user_acronym', userAcronymData.map(entry => {
          return { ...entry, createdAt: now, updatedAt: now };
        }), { transaction: t })
      ]);
    });
  },

  // TODO: Figure out how to restore the foreign keys afterwards
  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async t => {
      // Temporarily remove foreign key constraints
      const lifecycleHistoryFks = await queryInterface.getForeignKeyReferencesForTable('lifecycle_history', {});
      const lifecycleFks = await queryInterface.getForeignKeyReferencesForTable('lifecycle', {});

      if (lifecycleHistoryFks.some(x => x.constraintName === 'lifecycle_history_userId_fkey')) {
        await queryInterface.removeConstraint('lifecycle_history', 'lifecycle_history_userId_fkey', {
          transaction: t
        });
      }
      if (lifecycleFks.some(x => x.constraintName === 'lifecycle_acronymId_fkey')) {
        await queryInterface.removeConstraint('lifecycle', 'lifecycle_acronymId_fkey', {
          transaction: t
        });
      }

      // Remove seed data
      return Promise.all([
        queryInterface.bulkDelete('user_acronym', {
          userAcronymId: {
            [Sequelize.Op.in]: userAcronymData.map(entry => entry.userAcronymId)
          }
        }, { transaction: t }),
        queryInterface.bulkDelete('user', {
          userId: {
            [Sequelize.Op.in]: userData.map(entry => entry.userId)
          }
        }, { transaction: t }),
        queryInterface.bulkDelete('acronym', {
          acronymId: {
            [Sequelize.Op.in]: acronymData.map(entry => entry.acronymId)
          }
        }, { transaction: t })
      ]);
    });

    // console.log(await queryInterface.getForeignKeyReferencesForTable('lifecycle_history', {}));
    // console.log(await queryInterface.getForeignKeyReferencesForTable('lifecycle', {}));

    // TODO: Figure out why this keeps getting blocked by a foreign key constraint that doesn't exist??
    // Restore foreign key constraints
    // return queryInterface.sequelize.transaction(t => {
    //   return Promise.all([
    //     queryInterface.addConstraint('lifecycle', ['acronymId'], {
    //       type: 'FOREIGN KEY',
    //       name: 'lifecycle_acronymId_fkey',
    //       references: {
    //         table: 'acronym',
    //         field: 'acronymId'
    //       },
    //       onDelete: 'set NULL',
    //       onUpdate: 'cascade',
    //       transaction: t
    //     }),
    //     queryInterface.addConstraint('lifecycle_history', ['userId'], {
    //       type: 'FOREIGN KEY',
    //       name: 'lifecycle_history_userId_fkey',
    //       references: {
    //         table: 'user',
    //         field: 'userId'
    //       },
    //       onDelete: 'set NULL',
    //       onUpdate: 'cascade',
    //       transaction: t
    //     })
    //   ]);
    // });
  }
};
