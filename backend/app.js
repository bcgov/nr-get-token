const express = require('express');
// const config = require('config');

const log = require('npmlog');
const app = express();

app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/index.html', function (_, res) {
  res.sendFile(__dirname + '/static/index.html');
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
