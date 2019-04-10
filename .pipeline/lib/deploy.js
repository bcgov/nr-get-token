'use strict';
const {OpenShiftClientX} = require('pipeline-cli')
const path = require('path');

module.exports = (settings)=>{
  const phases = settings.phases
  const options= settings.options
  const phase=options.env
  const changeId = phases[phase].changeId
  const oc=new OpenShiftClientX({'namespace':phases[phase].namespace});
  const templatesLocalBaseUrl =oc.toFileUrl(path.resolve(__dirname, '../../openshift'))
  var objects = []

  //Secrets for PGSQL/Patroni
  //First call will create/generate default values and a template
  oc.createIfMissing(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/postgresql-secrets.yaml`, {
    'param':{
      'NAME': `template.${phases[phase].name}-pgsql-patroni`,
      'SUFFIX': '',
      'APP_DB_USERNAME': 'caps',
      'APP_DB_NAME': 'caps'
    }
  }))

  //Second call will create the required object using their respective template (default ones generated above)
  objects = objects.concat(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/postgresql-secrets.yaml`, {
    'param':{
      'NAME': `${phases[phase].name}-pgsql`,
      'SUFFIX': phases[phase].suffix,
      'APP_DB_USERNAME': 'caps',
      'APP_DB_NAME': 'caps'
    }
  }))


  //Deployment objects for Patroni
  objects = objects.concat(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/postgresql.yaml`, {
    'param':{
      'NAME': `${phases[phase].name}-pgsql`,
      'SUFFIX': phases[phase].suffix,
      'INSTANCE': `${phases[phase].name}-pgsql${phases[phase].suffix}`,
      'IMAGE_STREAM_NAMESPACE': 'bcgov',
//      'OPENSHIFT_IMAGE_REGISTRY': '172.30.1.1:5000',
      'IMAGE_STREAM_TAG': 'patroni:v10-stable'
    }
  }))
  
  objects = objects.concat(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/python-deploy.yaml`, {
    'param':{
      'NAME': phases[phase].name,
      'SUFFIX': phases[phase].suffix,
      'VERSION': phases[phase].tag,
      'HOST': phases[phase].host || ''
    }
  }))

  oc.applyRecommendedLabels(objects, phases[phase].name, phase, `${changeId}`, phases[phase].instance)
  oc.importImageStreams(objects, phases[phase].tag, phases.build.namespace, phases.build.tag)
  oc.applyAndDeploy(objects, phases[phase].instance)

}