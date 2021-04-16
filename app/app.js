const compression = require('compression');
const config = require('config');
const express = require('express');
const fs = require('fs');
const log = require('npmlog');
const morgan = require('morgan');
const path = require('path');
const Problem = require('api-problem');
const querystring = require('querystring');
const Writable = require('stream').Writable;

const db = require('./src/models');
const keycloak = require('./src/components/keycloak');
const v1Router = require('./src/routes/v1');

const apiRouter = express.Router();
const state = {
  shutdown: false
};

const app = express();
app.use(compression());
app.use(express.json({ limit: config.get('server.bodyLimit') }));
app.use(express.urlencoded({ extended: true }));

// Logging Setup
log.level = config.get('server.logLevel');
log.addLevel('debug', 1500, { fg: 'cyan' });

let logFileStream;
let teeStream;
if (config.has('server.logFile')) {
  // Write to logFile in append mode
  logFileStream = fs.createWriteStream(config.get('server.logFile'), { flags: 'a' });
  teeStream = new Writable({
    objectMode: true,
    write: (data, _, done) => {
      process.stdout.write(data);
      logFileStream.write(data);
      done();
    }
  });
  log.disableColor();
  log.stream = teeStream;
}

// Print out configuration settings in verbose startup
log.verbose('Config', JSON.stringify(config));

// Skip if running tests
if (process.env.NODE_ENV !== 'test') {
  const morganOpts = {};
  if (config.has('server.logFile')) {
    morganOpts.stream = teeStream;
  }
  // Add Morgan endpoint logging
  app.use(morgan(config.get('server.morganFormat'), morganOpts));

  // Check database connection and exit if unsuccessful
  db.sequelize.authenticate()
    .then(() => log.info('Database connection established'))
    .catch(err => {
      log.error(err);
      shutdown('DBFAIL');
    });
}

// Use Keycloak OIDC Middleware
app.use(keycloak.middleware());

// Block requests if shutting down
app.use((_req, res, next) => {
  if (state.shutdown) {
    throw new Error('Server shutting down');
  } else {
    next();
  }
});

// Frontend configuration endpoint
apiRouter.use('/config', (_req, res, next) => {
  try {
    const frontend = config.get('frontend');
    res.status(200).json(frontend);
  } catch (err) {
    next(err);
  }
});

// GetOK Base API Directory
apiRouter.get('/api', (_req, res) => {
  res.status(200).json('ok');
});

// Host API endpoints
apiRouter.use(config.get('server.apiPath'), v1Router);
app.use(config.get('server.basePath'), apiRouter);

// Host the static frontend assets
const staticFilesPath = config.get('frontend.basePath');
app.use('/favicon.ico', (_req, res) => { res.redirect(`${staticFilesPath}/favicon.ico`); });
app.use(staticFilesPath, express.static(path.join(__dirname, 'frontend/dist')));

// Handle 500
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err.stack) {
    log.error(err.stack);
  }

  if (err instanceof Problem) {
    err.send(res, null);
  } else {
    new Problem(500, 'Server Error', {
      detail: (err.message) ? err.message : err
    }).send(res);
  }
});

// Handle 404
app.use((req, res) => {
  if (req.originalUrl.startsWith(`${config.get('server.basePath')}/api`)) {
    // Return a 404 problem if attempting to access API
    new Problem(404, 'Page Not Found', {
      detail: req.originalUrl
    }).send(res);
  } else {
    // Redirect any non-API requests to static frontend with redirect breadcrumb
    const query = querystring.stringify({ r: req.path });
    res.redirect(`${staticFilesPath}/?${query}`);
  }
});

// Prevent unhandled errors from crashing application
process.on('unhandledRejection', err => {
  if (err && err.stack) {
    log.error(err.stack);
  }
});

/**
 * @function shutdown
 * Begins shutting down this application. It will hard exit after 3 seconds.
 */
function shutdown() {
  if (!state.shutdown) {
    log.info('Received kill signal. Shutting down...');
    state.shutdown = true;
    // Wait 3 seconds before hard exiting
    setTimeout(() => process.exit(), 3000);
  }
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = app;
