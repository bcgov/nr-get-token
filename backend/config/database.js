const config = require('config');

const dbConfig = {
  username: config.get('db.username'),
  password: config.get('db.password'),
  database: config.get('db.database'),
  host: config.get('db.host'),
  dialect: 'postgres'
};

module.exports = {
  development: dbConfig,
  test: dbConfig,
  production: dbConfig
};
