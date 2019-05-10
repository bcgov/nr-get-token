const config = require('config');
const express = require('express');
const log = require('npmlog');
const morgan = require('morgan');

const v1Router = require('./routes/v1');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan(config.get('server.morganFormat')));

log.level = config.get('server.logLevel');
log.addLevel('debug', 1500, { fg: 'green' });

// Print out configuration settings in verbose startup
log.verbose(JSON.stringify(config, null, 2));

// Handle root api discovery
app.get(['/', '/api'], (_req, res) => {
  res.status(200).json({
    endpoints: [
      '/api/v1'
    ],
    versions: [
      1
    ]
  });
});

// v1 Router
app.use('/api/v1', v1Router);

// Handle 500
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  log.error(err.stack);
  res.status(500).json({
    status: 500,
    message: 'Internal Server Error: ' + err.stack.split('\n', 1)[0]
  });
});

// Handle 404
app.use((_req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Page Not Found'
  });
});

// Prevent unhandled errors from crashing applicatoin
process.on('unhandledRejection', err => {
  log.error(err.stack);
});

module.exports = app;
