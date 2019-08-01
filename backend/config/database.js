const config = require('config');
const log = require('npmlog');
const Sequelize = require('sequelize');

log.addLevel('debug', 1500, {
  fg: 'cyan'
});

module.exports = {
  username: config.get('db.username'),
  password: config.get('db.password'),
  database: config.get('db.database'),
  host: config.get('db.host'),
  define: {
    charset: 'utf8',
    freezeTableName: true,
    paranoid: true, // Prevents hard deletions by flagging deletedAt instead
    timestamps: true,
    underscored: false // Makes attributes be named with underscores
  },
  dialect: 'postgres',
  isolationLevel: Sequelize.Transaction.SERIALIZABLE,
  logging: query => log.debug('Database', query),
  migrationStorageTableName: 'sequelize_meta',
  pool: {
    max: 5,
    idle: 10000,
    acquire: 60000
  }
};
