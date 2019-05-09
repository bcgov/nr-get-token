global.__basedir = __dirname;

// const config = require('config');
const express = require('express');
const log = require('npmlog');
const path = require('path');

const v1Router = require(path.join(__basedir, 'routes/v1/v1'));

const app = express();
app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Temporary Hello World
app.get('/api', (_req, res) => {
  res.sendFile(path.join(__basedir, '/static/index.html'));
});

// v1 Router
app.use('/api/v1', v1Router);

// Handle 500
app.use((err, _req, res, _next) => {
  log.error(err.stack)
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

module.exports = app;
