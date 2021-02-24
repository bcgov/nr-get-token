# Application on Openshift

This application is deployed on Openshift. This readme will outline how to setup and configure an Openshift project to get the application to a deployable state. There are also some historical notes on how to bootstrap from nothing to fully deployed on Openshift. This document assumes a working knowledge of Kubernetes/Openshift container orchestration concepts (i.e. buildconfigs, deployconfigs, imagestreams, secrets, configmaps, routes, etc)

Our builds and deployments are orchestrated with Jenkins. Refer to [Jenkinsfile](../Jenkinsfile) and [Jenkinsfile.cicd](../Jenkinsfile.cicd) to see how the Openshift templates are used for building and deploying in our CI/CD pipeline.

## Table of Contents

- [Openshift Deployment Prerequisites](#openshift-deployment-prerequisites)
- [Environment Setup - ConfigMaps and Secrets](#environment-setup---configmaps-and-secrets)
- [Build Config & Deployment](#build-config--deployment)
- [Templates](#templates)
- [Pull Request Cleanup](#pull-request-cleanup)
- [Appendix - Supporting Deployments](#appendix-generating-build-configuration-templates)

## Openshift Deployment Prerequisites

We assume you are logged into OpenShift and are in the repo/openshift local directory.  We will run the scripts from there.

### Add Default Kubernetes Network Policies

Before deploying, ensure that you have the Network Policies `deny-by-default` and `allow-from-openshift-ingress` by running the following:

``` sh
export NAMESPACE=<yournamespace>

oc process -n $NAMESPACE -f https://raw.githubusercontent.com/wiki/bcgov/nr-get-token/assets/templates/default.np.yaml | oc apply -n $NAMESPACE -f -
```

## Environment Setup - ConfigMaps and Secrets

There are some requirements in the target Openshift namespace/project which are **outside** of the CI/CD pipeline process. This application requires that a few Secrets as well as Config Maps are already present in the environment before it is able to function as intended. Otherwise the Jenkins pipeline will fail the deployment by design.

### Config Maps

In order to prepare an environment, you will need to ensure that all of the following configmaps and secrets are populated. This is achieved by executing the following commands as a project administrator of the targeted environment. Note that this must be repeated on *each* of the target deployment namespace/projects (i.e. `dev`, `test` and `prod`) as that they are independent of each other. Deployment will fail otherwise. Refer to [custom-environment-variables](../backend/config/custom-environment-variables.json) for the direct mapping of environment variables for the backend.

*Note:* Replace anything in angle brackets with the appropriate value!

*Note 2:* The Keycloak Public Key can be found in the Keycloak Admin Panel under Realm Settings > Keys. Look for the Public key button (normally under RS256 row), and click to see the key. The key should begin with a pattern of `MIIBIjANB...`.

```sh
export NAMESPACE=<yournamespace>
export APP_NAME=<yourappshortname>
export PUBLIC_KEY=<yourkeycloakpublickey>

oc create -n $NAMESPACE configmap $APP_NAME-frontend-config \
  --from-literal=FRONTEND_APIPATH=api/v1 \
  --from-literal=FRONTEND_BASEPATH=/app \
  --from-literal=FRONTEND_KC_CLIENTID=$APP_NAME-frontend \
  --from-literal=FRONTEND_KC_REALM=vehizw2t \
  --from-literal=FRONTEND_KC_SERVERURL=https://dev.oidc.gov.bc.ca/auth
```

```sh
oc create -n $NAMESPACE configmap $APP_NAME-sc-config \
  --from-literal=SC_CHES_API_ENDPOINT=https://ches-dev.pathfinder.gov.bc.ca/api \
  --from-literal=SC_CHES_TOKEN_ENDPOINT=https://dev.oidc.gov.bc.ca/auth/realms/jbd6rnxw/protocol/openid-connect/token \
  --from-literal=SC_GETOK_ENDPOINT_INT=https://i1api.nrs.gov.bc.ca/webade-api/v1 \
  --from-literal=SC_GETOK_ENDPOINT_TEST=https://t1api.nrs.gov.bc.ca/webade-api/v1 \
  --from-literal=SC_GETOK_ENDPOINT_PROD=https://api.nrs.gov.bc.ca/webade-api/v1 \
  --from-literal=SC_KC_DEV_ENDPOINT=https://dev.oidc.gov.bc.ca \
  --from-literal=SC_KC_TEST_ENDPOINT=https://test.oidc.gov.bc.ca \
  --from-literal=SC_KC_PROD_ENDPOINT=https://oidc.gov.bc.ca \
  --from-literal=SC_KC_DEV_REALM=jbd6rnxw \
  --from-literal=SC_KC_TEST_REALM=jbd6rnxw \
  --from-literal=SC_KC_PROD_REALM=jbd6rnxw
```

```sh
oc create -n $NAMESPACE configmap $APP_NAME-server-config \
  --from-literal=SERVER_APIPATH=/api/v1 \
  --from-literal=SERVER_BODYLIMIT=30mb \
  --from-literal=SERVER_KC_PUBLICKEY=$PUBLIC_KEY \
  --from-literal=SERVER_KC_REALM=vehizw2t \
  --from-literal=SERVER_KC_SERVERURL=https://dev.oidc.gov.bc.ca/auth \
  --from-literal=SERVER_LOGLEVEL=info \
  --from-literal=SERVER_MORGANFORMAT=combined \
  --from-literal=SERVER_PORT=8080
```

### Secrets

Replace anything in angle brackets with the appropriate value!

*Note:* Publickey must be a PEM-encoded value encapsulated in double quotes in the argument. Newlines should not be re-encoded when using this command. If authentication fails, it's very likely a newline whitespace issue.

```sh
export NAMESPACE=<yournamespace>
export APP_NAME=<yourappshortname>

oc create -n $NAMESPACE secret generic $APP_NAME-keycloak-secret \
  --type=kubernetes.io/basic-auth \
  --from-literal=username=<username> \
  --from-literal=password=<password>
```

```sh
oc create -n $NAMESPACE secret generic $APP_NAME-sc-ches-secret \
  --type=kubernetes.io/basic-auth \
  --from-literal=username=<username> \
  --from-literal=password=<password>
```

If generating a new token is required for the github access below. Log in to the repo with the Parrot (nr-csst) account and regenerate a personal access token. Only public_repo scope is needed

```sh
oc create -n $NAMESPACE secret generic $APP_NAME-sc-github-secret \
  --from-literal=personal-access-token=<token>
```

```sh
oc create -n $NAMESPACE secret generic $APP_NAME-sc-keycloak-dev-secret \
  --type=kubernetes.io/basic-auth \
  --from-literal=username=<username> \
  --from-literal=password=<password>
```

```sh
oc create -n $NAMESPACE secret generic $APP_NAME-sc-keycloak-test-secret \
  --type=kubernetes.io/basic-auth \
  --from-literal=username=<username> \
  --from-literal=password=<password>
```

```sh
oc create -n $NAMESPACE secret generic $APP_NAME-sc-keycloak-prod-secret \
  --type=kubernetes.io/basic-auth \
  --from-literal=username=<username> \
  --from-literal=password=<password>
```

```sh
oc create -n $NAMESPACE secret generic $APP_NAME-sc-webade-int-secret \
  --type=kubernetes.io/basic-auth \
  --from-literal=username=<username> \
  --from-literal=password=<password>
```

```sh
oc create -n $NAMESPACE secret generic $APP_NAME-sc-webade-test-secret \
  --type=kubernetes.io/basic-auth \
  --from-literal=username=<username> \
  --from-literal=password=<password>
```

```sh
oc create -n $NAMESPACE secret generic $APP_NAME-sc-webade-prod-secret \
  --type=kubernetes.io/basic-auth \
  --from-literal=username=<username> \
  --from-literal=password=<password>
```

## Build Config & Deployment

Get Token is currently designed as a single application pod deployments. It will host a static frontend containing all of the Vue.js resources and assets, and a Node.js backend which serves the API that the frontend requires. We are currently leveraging Openshift Routes with path based filtering in order to forward incoming traffic to the right deployment service.

### Frontend

The frontend temporarily installs dependencies needed to generate the static assets that will appear in the `/app/frontend/dist` folder. These contents will be picked up by the application and hosted appropriately.

### Application

The backend is a standard [Node](https://nodejs.org)/[Express](https://expressjs.com) server. It handles the JWT based authentication via OIDC authentication flow, and exposes the API to authorized users. This deployment container is built up on top of an Alpine Node image. The resulting container after build is what is deployed.

## Templates

The Jenkins pipeline heavily leverages Openshift Templates in order to ensure that all of the environment variables, settings, and contexts are pushed to Openshift correctly. Files ending with `.bc.yaml` specify the build configurations, while files ending with `.dc.yaml` specify the components required for deployment.

### Build Configurations

Build configurations will emit and handle the chained builds or standard builds as necessary. They take in the following parameters:

| Name | Required | Description |
| --- | --- | --- |
| REPO_NAME | yes | Application repository name |
| JOB_NAME | yes | Job identifier (i.e. 'pr-5' OR 'master') |
| SOURCE_REPO_REF | yes | Git Pull Request Reference (i.e. 'pull/CHANGE_ID/head') |
| SOURCE_REPO_URL | yes | Git Repository URL |

The template can be manually invoked and deployed via Openshift CLI. For example:

```sh
oc -n e9bfa5-<env> process -f openshift/app.bc.yaml -p REPO_NAME=nr-get-token
 -p JOB_NAME=master -p SOURCE_REPO_URL=https://github.com/bcgov/nr-get-token.git -p SOURCE_REPO_REF=master -o yaml | oc -n e9bfa5-<env> apply -f -
```

Note that these build configurations do not have any triggers defined. They will be invoked by the Jenkins pipeline, started manually in the console, or by an equivalent oc command for example:

```sh
oc -n e9bfa5-<env> start-build <buildname> --follow
```

Finally, we generally tag the resultant image so that the deployment config will know which exact image to use. This is also handled by the Jenkins pipeline. The equivalent oc command for example is:

```sh
oc -n e9bfa5-<env> tag <buildname>:latest <buildname>:master
```

*Note: Remember to swap out the bracketed values with the appropriate values!*

### Deployment Configurations

Deployment configurations will emit and handle the deployment lifecycles of running containers based off of the previously built images. They generally contain a deploymentconfig, a service, and a route. Before our application is deployed, Patroni (a Highly Available Postgres Cluster implementation) needs to be deployed. Refer to any `patroni*` templates and their [official documentation](https://patroni.readthedocs.io/en/latest/) for more details.

Our application template take in the following parameters:

| Name | Required | Description |
| --- | --- | --- |
| REPO_NAME | yes | Application repository name |
| JOB_NAME | yes | Job identifier (i.e. 'pr-5' OR 'master') |
| NAMESPACE | yes | which namespace/"environment" are we deploying to? dev, test, prod? |
| APP_NAME | yes | short name for the application |
| ROUTE_HOST | yes | base domain for the publicly accessible URL |
| ROUTE_PATH | yes | base path for the publicly accessible URL |

The Jenkins pipeline will handle deployment invocation automatically. However should you need to run it manually, you can do so with the following for example:

```sh
oc -n e9bfa5-<env> process -f openshift/app.dc.yaml -p REPO_NAME=nr-get-token -p JOB_NAME=master -p NAMESPACE=e9bfa5-<env> -p APP_NAME=getok -p ROUTE_HOST=getok-dev.pathfinder.gov.bc.ca -p ROUTE_PATH=master -o yaml | oc -n e9bfa5-<env> apply -f -
```

Due to the triggers that are set in the deploymentconfig, the deployment will begin automatically. However, you can deploy manually by use the following command for example:

```sh
oc -n e9bfa5-<env> rollout latest dc/<buildname>-master
```

*Note: Remember to swap out the bracketed values with the appropriate values!*

## Pull Request Cleanup

As of this time, we do not automatically clean up resources generated by a Pull Request once it has been accepted and merged in. This is still a manual process. Our PR deployments are all named in the format "pr-###", where the ### is the number of the specific PR. In order to clear all resources for a specific PR, run the following two commands to delete all relevant resources from the Openshift project (replacing `PRNUMBER` with the appropriate number):

```sh
oc delete all,secret,networkpolicy -n e9bfa5-dev --selector app=getok-pr-<PRNUMBER>
oc delete all,svc,cm,sa,role,secret -n e9bfa5-dev --selector cluster-name=pr-<PRNUMBER>
```

The first command will clear out all related executable resources for the application, while the second command will clear out the remaining Patroni cluster resources associated with that PR.

## Appendix: Generating Build Configuration Templates

You will likely not need to run the new template generation sections as that the base templates should already be in git. You should be able to skip those steps.

### New Node Builder Template

*If you are creating a new build configuration template, you will likely use the following commands:*

```sh
oc new-build -n e9bfa5-tools registry.access.redhat.com/rhscl/nodejs-8-rhel7:latest~https://github.com/bcgov/nr-get-token.git#master --context-dir=frontend --name=get-token-frontend --dry-run -o yaml > openshift/frontend.bc.yaml
sed -i '' -e 's/kind: List/kind: Template/g' openshift/frontend.bc.yaml
sed -i '' -e 's/items:/objects:/g' openshift/frontend.bc.yaml
```

*Note: You need to remove any secrets and credentials that are auto-inserted into the frontend.bc.yaml file.*

### Process and Apply Builder Template

```sh
oc process -n e9bfa5-tools -f openshift/frontend.bc.yaml -o yaml | oc create -n e9bfa5-tools -f -
```

### New Caddy Static Image Template

*If you are creating a new build configuration template, you will likely use the following commands:*

```sh
oc new-build -n e9bfa5-tools --docker-image=docker-registry.default.svc:5000/bcgov/s2i-caddy:v1-stable --source-image=frontend:latest --source-image-path=/opt/app-root/src/dist:tmp -D $'FROM docker-registry.default.svc:5000/bcgov/s2i-caddy:v1-stable\nCOPY tmp/dist/ /var/www/html/\nCMD /tmp/scripts/run' --dry-run --name=get-token-frontend-static -o yaml > openshift/frontend-static.bc.yaml
sed -i '' -e 's/kind: List/kind: Template/g' openshift/frontend-static.bc.yaml
sed -i '' -e 's/items:/objects:/g' openshift/frontend-static.bc.yaml
```

*Note: You need to remove any secrets and credentials that are auto-inserted into the frontend-static.bc.yaml file.*

### Process and Apply Static Image Template

```sh
oc process -n e9bfa5-tools -f openshift/frontend-static.bc.yaml -o yaml | oc create -n e9bfa5-tools -f -
```

### Tag the latest build and migrate it to the correct project namespace

```sh
oc tag -n e9bfa5-dev e9bfa5-tools/frontend-static:latest frontend-static:dev --reference-policy=local
```

### Create new Application Deployment

*If you are creating a new application deployment template, you will likely use the following commands:*

```sh
oc new-app -n e9bfa5-dev --image-stream=frontend-static:dev --name=get-token-frontend --dry-run -o yaml > openshift/frontend-static.dc.yaml
```

### Process and Apply the Application Deployment

```sh
oc process -n e9bfa5-dev -f openshift/frontend-static.dc.yaml -o yaml | oc create -n e9bfa5-dev -f -
oc create -n e9bfa5-dev route edge frontend --service=frontend --port=2015-tcp
```

### Templating Work in Progress

The above commands will need to be templated. We can expect something like the following in part of the commands:

```sh
'--name=${NAME}${SUFFIX}' '--context-dir=${GIT_DIR}'
```
