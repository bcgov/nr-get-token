'use strict';
const phases = require('./lib/config')
const build = require('./lib/build.js')

build({phases:phases})