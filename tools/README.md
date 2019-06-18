# Jenkins

Uses BcDevOPs CICD Jenkins Basic install  [link](https://github.com/BCDevOps/openshift-components/tree/cvarjao-update-jenkins-basic/cicd/jenkins-basic)

The commands, labels, and naming conventions follow the Pull Request Pipeline principles of the BcDevOPs pipeline-cli [link] (https://github.com/BCDevOps/pipeline-cli).

The jobs that Jenkins creates and uses will also follow those principles and build out an "environment" for each pull request.

This repository adds a script to the existing Jenkins deployment that will create our jobs.

See tools/docker/contrib/jenkins/configuration/init.groovy.d/003-create-jobs.groovy.

To add or change the jobs, this is where you want to go.  The name of this file is important, as it needs to get run *BEFORE* the 003-register-github-webhooks.groovy included in the basic install.  Scripts are run alphabetically.  The jobs need to be created before the github webhooks are created.  Our jobs script will read secrets and configmaps created during this setup; described below.

## Prerequisites

You should have your 4 OpenShift projects created for you by ???: dev, test, prod, tools.

You will need a github account and token (preferrably a team shared account) with access to your repo: [New Personal Access Token](https://github.com/settings/tokens/new?scopes=repo,read:user,user:email,admin:repo_hook).

# Setup Jenkins

The following commands setup up the Prod instance of Jenkins and uses this repository and specific OpenShift project namespaces.

Change as necessary...

Fill in this documentation about parameters and labels from pipeline-cli...

*phases*: build, dev, test, prod
*changeId*: (pull request number)
*suffix*: build = -build-{changeId}, dev = -dev-{changeId}, test = -test, prod = -prod
*version* (N.n.n): build = {version}-{changeId}, dev = {version}-{changeId}, test = {version}, prod = {version}
*tag*: build = build-{version}-{changeId}, dev = dev-{version}-{changeId}, test = test-{version}, prod = prod-{version}

#### parameter notes

-p VERSION={tag}

#### label notes

-l env-name={phase}
-l env-id={changeId/pull request number}
-l app={app name}{suffix}

### login to openshift
Login via web console, click your login name at top tight and click "Copy Login Command".  Go to your terminal, go to your project root and paste the copy command.

```sh
cd tools/jenkins
```

### create secrets

```sh
oc -n k8vopl-tools process -f 'openshift/secrets.yaml' -p 'GH_USERNAME=bcgov-nr-csst' -p 'GH_PASSWORD=<personal_access_token>' | oc  -n k8vopl-tools create -f -
```

### create config map for related namespaces

```sh
oc -n k8vopl-tools process -f 'openshift/ns-config.yaml' -p 'DEV=k8vopl-dev' -p 'TEST=k8vopl-test' -p 'PROD=k8vopl-prod' -p 'TOOLS=k8vopl-tools' | oc  -n k8vopl-tools create -f -
```

### create config map for the application

```sh
oc -n k8vopl-tools process -f 'openshift/jobs-config.yaml' -p 'REPO_OWNER=bcgov' -p 'REPO_NAME=nr-get-token' -p 'APP_NAME=getok' -p 'APP_DOMAIN=pathfinder.gov.bc.ca' | oc -n k8vopl-tools create -f -
```

### process the build config templates...

These build configs have no build triggers, we start them manually (or in Jenkins job script)

#### master

```sh
oc -n k8vopl-tools process -f 'openshift/build-master.yaml' -p 'NAME=jenkins' -p 'SUFFIX=-prod' -p 'VERSION=prod-1.0.0' -p 'SOURCE_REPOSITORY_URL=https://github.com/bcgov/nr-get-token' -p 'SOURCE_REPOSITORY_REF=master' -l app-name=jenkins -l env-name=prod -l env-id=0 -l github-repo=https://github.com/bcgov/nr-get-token -l github-owner=bcgov -l app=jenkins-prod -o yaml | oc -n k8vopl-tools create -f -
```

##### build and follow...

```sh
oc -n k8vopl-tools start-build bc/jenkins-prod -F
```

#### slave

```sh
oc -n k8vopl-tools process -f 'openshift/build-slave.yaml' -p 'NAME=jenkins' -p 'SUFFIX=-prod' -p 'VERSION=prod-1.0.0' -p 'SLAVE_NAME=main' -p 'SOURCE_IMAGE_STREAM_TAG=jenkins:prod-1.0.0' -l app-name=jenkins -l env-name=prod -l env-id=0 -l github-repo=https://github.com/bcgov/nr-get-token -l github-owner=bcgov -l app=jenkins-prod -o yaml | oc -n k8vopl-tools create -f -
```

##### build and follow...

```sh
oc -n k8vopl-tools start-build bc/jenkins-slave-main-prod -F
```

### process the deployment templates

#### master

```sh
oc -n k8vopl-tools process -f 'openshift/deploy-master.yaml' -p 'NAME=jenkins' -p 'SUFFIX=-prod' -p 'VERSION=prod-1.0.0' -p 'ROUTE_HOST=jenkins-prod-k8vopl-tools.pathfinder.gov.bc.ca' -p 'GH_USERNAME=bcgov-nr-csst' -p 'GH_PASSWORD=<personal_access_token>' -l app-name=jenkins -l env-name=prod -l env-id=0 -l github-repo=https://github.com/bcgov/nr-get-token -l github-owner=bcgov -l app=jenkins-prod -o yaml | oc -n k8vopl-tools create -f -

```

#### add service account access to other projects

```sh
oc -n k8vopl-dev policy add-role-to-user 'admin' 'system:serviceaccount:k8vopl-tools:jenkins-prod'
oc -n k8vopl-test policy add-role-to-user 'admin' 'system:serviceaccount:k8vopl-tools:jenkins-prod'
oc -n k8vopl-prod policy add-role-to-user 'admin' 'system:serviceaccount:k8vopl-tools:jenkins-prod'
```

#### slave

```sh
oc -n k8vopl-tools process -f 'openshift/deploy-slave.yaml' -p 'NAME=jenkins' -p 'SUFFIX=-prod' -p 'VERSION=prod-1.0.0' -p 'NAMESPACE=k8vopl-tools' -p 'SLAVE_NAME=build' -p 'SLAVE_LABELS=build deploy test ui-test' -p 'SLAVE_EXECUTORS=3' -p 'CPU_REQUEST=300m' -p 'CPU_LIMIT=2000m' -p 'MEMORY_REQUEST=256Mi' -p 'MEMORY_LIMIT=2Gi' -l app-name=jenkins -l env-name=prod -l env-id=0 -l github-repo=https://github.com/bcgov/nr-get-token -l github-owner=bcgov -l app=jenkins-prod -o yaml | oc -n k8vopl-tools create -f -
```

### cleanup

This will not clean up the initial secret and config maps we explicitly created

```sh
oc delete all,template,secret,configmap,pvc,serviceaccount,rolebinding --selector app=jenkins-prod -n k8vopl-tools
```

# SonarQube

## SonarQube Server

To deploy a SonarQube server instance to our project we simply use the prebuilt server image provided by the BCDevOps organization.

Full details should be found at the [BCDevOps SonarQube repository](https://github.com/BCDevOps/sonarqube).

Do deploy the server and the backing PostgreSQL database clone the repo linked above and, from the root folder (where the template yaml is located), run the following command in the `Tools` project:

```sh
oc -n k8vopl-tools new-app -f sonarqube-postgresql-template.yaml --param=SONARQUBE_VERSION=6.7.5
```

At the point this was done on the GETOK tools project, the BCDevOps SonarQube repo was at commit `bbb9f62e29706b61382cf24d7ad7e08f2476a01f` (on master branch).

### Admin Password

The SonarQube server instance creates with a default admin password. This should be reset to something stronger and stored in an OpenShift secret so authorized developers can find it.

The BCDevOps SonarQube repo provides a script that will generate a random PW, set it in SonarQube, and create a secret.
In the `/provisioning` folder in the cloned BCDevOps repo, run (ensure your console is in the `Tools` project, k8vopl-tools in this instance):

```sh
./updatesqadminpw.sh
```

## SonarQube Scanner

TBD
