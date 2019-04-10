'use strict';
const options= require('pipeline-cli').Util.parseArguments()
const changeId = options.pr //aka pull-request
const version = '1'
const name = 'getok'

const phases = {
  build: {namespace:'k8vopl-tools', name: `${name}`, phase: 'build', changeId:changeId, suffix: `-build-${changeId}`, instance: `${name}-build-${changeId}`, version:`${version}-${changeId}`, tag:`build-${version}-${changeId}`},
    dev: {namespace:'k8vopl-dev'  , name: `${name}`, phase: 'dev'  , changeId:changeId, suffix: `-dev-${changeId}`  , instance: `${name}-dev-${changeId}`  , version:`${version}-${changeId}`, tag:`dev-${version}-${changeId}`  , host:'dev-getok.pathfinder.gov.bc.ca'},
   test: {namespace:'k8vopl-test' , name: `${name}`, phase: 'test' , changeId:changeId, suffix: `-test-${changeId}` , instance: `${name}-test-${changeId}` , version:`${version}-${changeId}`, tag:`test-${version}`             , host:'test-getok.pathfinder.gov.bc.ca'},
   prod: {namespace:'k8vopl-prod' , name: `${name}`, phase: 'prod' , changeId:changeId, suffix: ''                  , instance: `${name}-prod`             , version:`${version}-${changeId}`, tag:`prod-${version}`             , host:'getok.pathfinder.gov.bc.ca'}
}

module.exports = exports = phases
