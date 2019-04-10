'use strict';
const options= require('pipeline-cli').Util.parseArguments()
const changeId = options.pr //aka pull-request
const version = 'v2.0'
const NAME = 'jenkins'

if (options.pr == null){
  throw new Error("Missing --pr argument")
}

const phases = {
  build: {namespace:'k8vopl-tools' , name: NAME, phase: 'build', changeId:changeId, suffix: `-build-${changeId}`, instance: `${NAME}-build-${changeId}`, tag:`build-${version}-${changeId}`},
    dev: {namespace:'k8vopl-tools' , name: NAME, phase: 'dev'  , changeId:changeId, suffix: `-dev-${changeId}`  , instance: `${NAME}-dev-${changeId}`  , tag:`dev-${version}-${changeId}`},
   test: {namespace:'k8vopl-tools' , name: NAME, phase: 'test' , changeId:changeId, suffix: '-test'             , instance: `${NAME}-test`             , tag:`test-${version}`},
   prod: {namespace:'k8vopl-tools' , name: NAME, phase: 'prod' , changeId:changeId, suffix: '-prod'             , instance: `${NAME}-prod`             , tag:`prod-${version}`}
}

module.exports = exports = phases
