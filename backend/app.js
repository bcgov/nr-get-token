const express = require('express');
// const config = require('config');

const log = require('npmlog');
const app = express();

app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Temporary Hello World
app.get('/api', function (_, res) {
  res.sendFile(__dirname + '/static/index.html');
});

// Temporary OpenAPI Endpoint
app.use('/api/v1/docs', function (_, res) {
  const docs = require('./docs/docs');
  res.send(docs.getDocHTML('v1'));
});

// Temporary OpenAPI YAML File
app.get('/api/v1/api-spec.yaml', function (_, res) {
  res.sendFile(__dirname + '/static/v1.api-spec.yaml');
});

// Handle 500
app.use(function (err, _, res, _) {
  log.error(err.stack)
  res.status(500);
  res.json({
    status: 500,
    message: 'Internal Server Error: ' + err.stack.split('\n', 1)[0]
  });
});

// Handle 404
app.use(function (_, res) {
  res.status(404);
  res.json({
    status: 404,
    message: 'Page Not Found'
  });
});

module.exports = app;
