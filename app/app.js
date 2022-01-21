const compression = require('compression');
const config = require('config');
const express = require('express');
const path = require('path');
const Problem = require('api-problem');
const querystring = require('querystring');
const log = require('./src/components/log')(module.filename);
const httpLogger = require('./src/components/log').httpLogger;

const db = require('./src/models');
const keycloak = require('./src/components/keycloak');
const v1Router = require('./src/routes/v1');

const apiRouter = express.Router();
const state = {
  connections: {
    data: false,
  },
  ready: false,
  shutdown: false,
};
let probeId;

const app = express();
app.use(compression());
app.use(express.json({ limit: config.get('server.bodyLimit') }));
app.use(express.urlencoded({ extended: true }));

// Print out configuration settings in debug startup
log.debug('App configuration', config);

// Skip if running tests
if (process.env.NODE_ENV !== 'test') {
  app.use(httpLogger);

  // Initialize connections and exit if unsuccessful
  initializeConnections();
}

// Use Keycloak OIDC Middleware
app.use(keycloak.middleware());

// Block requests until service is ready
app.use((_req, res, next) => {
  if (state.shutdown) {
    new Problem(503, { details: 'Server is shutting down' }).send(res);
  } else if (!state.ready) {
    new Problem(503, { details: 'Server is not ready' }).send(res);
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
app.use('/favicon.ico', (_req, res) => {
  res.redirect(`${staticFilesPath}/favicon.ico`);
});
app.use(staticFilesPath, express.static(path.join(__dirname, 'frontend/dist')));

// Handle 500
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err.stack) {
    log.error(err);
  }

  if (err instanceof Problem) {
    err.send(res, null);
  } else {
    new Problem(500, 'Server Error', {
      detail: err.message ? err.message : err,
    }).send(res);
  }
});

// Handle 404
app.use((req, res) => {
  if (req.originalUrl.startsWith(`${config.get('server.basePath')}/api`)) {
    // Return a 404 problem if attempting to access API
    new Problem(404, 'Page Not Found', {
      detail: req.originalUrl,
    }).send(res);
  } else {
    // Redirect any non-API requests to static frontend with redirect breadcrumb
    const query = querystring.stringify({ r: req.path });
    res.redirect(`${staticFilesPath}/?${query}`);
  }
});

// Prevent unhandled errors from crashing application
process.on('unhandledRejection', (err) => {
  if (err && err.stack) {
    log.error(err);
  }
});

// Graceful shutdown support
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
process.on('SIGUSR1', shutdown);
process.on('SIGUSR2', shutdown);
process.on('exit', () => {
  log.info('Exiting...');
});

/**
 * @function shutdown
 * Shuts down this application after at least 3 seconds.
 */
function shutdown() {
  log.info('Received kill signal. Shutting down...');
  // Wait 3 seconds before starting cleanup
  if (!state.shutdown) setTimeout(cleanup, 3000);
}

/**
 * @function cleanup
 * Cleans up connections in this application.
 */
function cleanup() {
  log.info('Service no longer accepting traffic');
  state.shutdown = true;

  log.info('Cleaning up...');
  clearInterval(probeId);

  db.sequelize.close().then(() => process.exit());

  // Wait 10 seconds max before hard exiting
  setTimeout(() => process.exit(), 10000);
}

/**
 * @function initializeConnections
 * Initializes the database connection
 * This will force the application to exit if it fails
 */
function initializeConnections() {
  // Check database connection and exit if unsuccessful
  db.sequelize
    .authenticate()
    .then(() => {
      state.connections.data = true;
      log.info('Database connection reachable');
    })
    .catch((err) => {
      state.connections.data = false;
      log.error(
        'initializeConnections',
        'Connection initialization failure',
        err.message
      );
      process.exitCode = 1;
      shutdown();
    })
    .finally(() => {
      state.ready = Object.values(state.connections).every((x) => x);
      if (state.ready) {
        log.info('Service ready to accept traffic');
        // Start periodic 10 second connection probe check
        probeId = setInterval(checkConnections, 10000);
      }
    });
}

/**
 * @function checkConnections
 * Checks Database connectivity
 * This will force the application to exit if a connection fails
 */
function checkConnections() {
  const wasReady = state.ready;
  if (!state.shutdown) {
    db.sequelize
      .authenticate()
      .then(() => (state.connections.data = true))
      .catch((err) => {
        state.connections.data = false;
        log.error('checkConnections', 'Connection probe failure', err.message);
        process.exitCode = 1;
        shutdown();
      })
      .finally(() => {
        state.ready = Object.values(state.connections).every((x) => x);
        if (!wasReady && state.ready) {
          log.info('Service ready to accept traffic');
        }
      });
  }
}

module.exports = app;
