# Natural Resources Get Token on Openshift

This application is deployed on Openshift. This readme will outline how to setup and configure an Openshift project to get the application to a deployable state. There are also some historical notes on how to bootstrap from nothing to fully deployed on Openshift. This document assumes a working knowledge of Kubernetes/Openshift container orchestration concepts (i.e. buildconfigs, deployconfigs, imagestreams, secrets, configmaps, routes, etc)

Our builds and deployments are orchestrated with Jenkins (see [tools](../tools/jenkins/README.md)). Refer to [Jenkinsfile](../Jenkinsfile) and [Jenkinsfile.cicd](../Jenkinsfile.cicd) to see how the Openshift templates are used for building and deploying in our CI/CD pipeline.

## Environment Setup - ConfigMaps and Secrets

There are some requirements in the target Openshift namespace/project which are **outside** of the CI/CD pipeline process. This application requires that a few Secrets as well as Config Maps are already present in the environment before it is able to function as intended. Otherwise the Jenkins pipeline will fail the deployment by design.

In order to prepare an environment, you will need to ensure that all of the following configmaps and secrets are populated. This is achieved by executing the following commands as a project administrator of the targeted environment. Note that this must be repeated on *each* of the target deployment namespace/projects (i.e. `dev`, `test` and `prod`) as that they are independent of each other. Deployment will fail otherwise. Refer to [custom-environment-variables](../backend/config/custom-environment-variables.json) for the direct mapping of environment variables for the backend.

### Config Maps

*Note: Replace anything in angle brackets with the appropriate value!*

```sh
oc create -n k8vopl-<env> configmap getok-oidc-config \
  --from-literal=OIDC_DISCOVERY=https://sso-dev.pathfinder.gov.bc.ca/auth/realms/vehizw2t/.well-known/openid-configuration
```

```sh
oc create -n k8vopl-<env> configmap getok-server-config \
  --from-literal=SERVER_LOGLEVEL=info \
  --from-literal=SERVER_MORGANFORMAT=combined \
  --from-literal=SERVER_PORT=8080
```

```sh
oc create -n k8vopl-<env> configmap getok-sc-config \
  --from-literal=SC_GETOK_ENDPOINT_INT=https://i1api.nrs.gov.bc.ca/webade-api/v1 \
  --from-literal=SC_GETOK_ENDPOINT_TEST=https://t1api.nrs.gov.bc.ca/webade-api/v1 \
  --from-literal=SC_GETOK_ENDPOINT_PROD=https://api.nrs.gov.bc.ca/webade-api/v1 \
  --from-literal=SC_MSSC_ENDPOINT=https://i1api.nrs.gov.bc.ca/cmsg-messaging-api/v1 \
  --from-literal=SC_KC_INT_ENDPOINT=https://sso-dev.pathfinder.gov.bc.ca \
  --from-literal=SC_KC_TEST_ENDPOINT=https://sso-test.pathfinder.gov.bc.ca \
  --from-literal=SC_KC_PROD_ENDPOINT=https://sso.pathfinder.gov.bc.ca \
  --from-literal=SC_KC_INT_REALM=jbd6rnxw \
  --from-literal=SC_KC_TEST_REALM=jbd6rnxw \
  --from-literal=SC_KC_PROD_REALM=jbd6rnxw
```

### Secrets

Replace anything in angle brackets with the appropriate value!

_Note: Publickey must be a PEM-encoded value encapsulated in double quotes in the argument. Newlines should not be re-encoded when using this command. If authentication fails, it's very likely a newline whitespace issue._

```sh
oc create -n k8vopl-<env> secret generic getok-oidc-secret \
  --type=kubernetes.io/basic-auth \
  --from-literal=username=<username> \
  --from-literal=password=<password> \
  --from-literal=publickey="<key>"
```

```sh
oc create -n k8vopl-<env> secret generic getok-sc-getokint-secret \
  --type=kubernetes.io/basic-auth \
  --from-literal=username=<username> \
  --from-literal=password=<password>
```

```sh
oc create -n k8vopl-<env> secret generic getok-sc-getoktest-secret \
  --type=kubernetes.io/basic-auth \
  --from-literal=username=<username> \
  --from-literal=password=<password>
```

```sh
oc create -n k8vopl-<env> secret generic getok-sc-getokprod-secret \
  --type=kubernetes.io/basic-auth \
  --from-literal=username=<username> \
  --from-literal=password=<password>
```

```sh
oc create -n k8vopl-<env> secret generic getok-sc-ches-secret \
  --type=kubernetes.io/basic-auth \
  --from-literal=username=<username> \
  --from-literal=password=<password>
```

```sh
oc create -n k8vopl-<env> secret generic getok-sc-keycloakint-secret \
  --type=kubernetes.io/basic-auth \
  --from-literal=username=<username> \
  --from-literal=password=<password>
```

```sh
oc create -n k8vopl-<env> secret generic getok-sc-keycloaktest-secret \
  --type=kubernetes.io/basic-auth \
  --from-literal=username=<username> \
  --from-literal=password=<password>
```

```sh
oc create -n k8vopl-<env> secret generic getok-sc-keycloakprod-secret \
  --type=kubernetes.io/basic-auth \
  --from-literal=username=<username> \
  --from-literal=password=<password>
```

## Build Config & Deployment

Get Token is currently designed with two discrete pod deployments: a static frontend which hosts all of the Vue.js resources and assets, and a Node.js backend which serves the API that the frontend requires. We are currently leveraging Openshift Routes with path based filtering in order to forward incoming traffic to the right deployment service.

### Frontend

The frontend uses [Caddy](https://caddyserver.com) to host the static Vue UI. The service itself does not do much other than serve the static assets, handle some path rewriting rules and proxying API calls to the appropriate route.

The deployment container is built up using a two step chained build strategy. The first step yields an imagestream which uses a minimal Node Alpine container to temporarily install dependencies and generate the static assets in the `/dist` folder. The second step yields the Caddy server with only the static assets in the `/dist` folder copied over to minimize unnecessary container bloat.

### Backend

The backend is a standard [Node](https://nodejs.org)/[Express](https://expressjs.com) server. It handles the JWT based authentication via OIDC authentication flow, and exposes the API to authorized users. This deployment container is built up using an Openshift S2I image strategy. The resulting container after build is what is deployed.

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
oc -n k8vopl-<env> process -f openshift/app.bc.yaml -p REPO_NAME=nr-get-token
 -p JOB_NAME=master -p SOURCE_REPO_URL=https://github.com/bcgov/nr-get-token.git -p SOURCE_REPO_REF=master -o yaml | oc -n k8vopl-<env> create -f -
```

Note that these build configurations do not have any triggers defined. They will be invoked by the Jenkins pipeline, started manually in the console, or by an equivalent oc command for example:

```sh
oc -n k8vopl-<env> start-build <buildname> --follow
```

Finally, we generally tag the resultant image so that the deployment config will know which exact image to use. This is also handled by the Jenkins pipeline. The equivalent oc command for example is:

```sh
oc -n k8vopl-<env> tag <buildname>:latest <buildname>:master
```

*Note: Remember to swap out the bracketed values with the appropriate values!*

### Deployment Configurations

Deployment configurations will emit and handle the deployment lifecycles of running containers based off of the previously built images. They generally contain a deploymentconfig, a service, and a route. They take in the following parameters:

| Name | Required | Description |
| --- | --- | --- |
| REPO_NAME | yes | Application repository name |
| JOB_NAME | yes | Job identifier (i.e. 'pr-5' OR 'master') |
| NAMESPACE | yes | which namespace/"environment" are we deploying to? dev, test, prod? |
| APP_NAME | yes | short name for the application |
| HOST_ROUTE | yes | used to set the publicly accessible url |

The Jenkins pipeline will handle deployment invocation automatically. However should you need to run it manually, you can do so with the following for example:

```sh
oc -n k8vopl-<env> process -f openshift/app.dc.yaml -p REPO_NAME=nr-get-token -p JOB_NAME=master -p NAMESPACE=k8vopl-<env> -p APP_NAME=getok -p HOST_ROUTE=getok-master-k8vopl-<env>.pathfinder.gov.bc.ca -o yaml | oc -n k8vopl-<env> apply -f -
```

Due to the triggers that are set in the deploymentconfig, the deployment will begin automatically. However, you can deploy manually by use the following command for example:

```sh
oc -n k8vopl-<env> rollout latest dc/<buildname>-master
```

*Note: Remember to swap out the bracketed values with the appropriate values!*

## Pull Request Cleanup

As of this time, we do not automatically clean up resources generated by a Pull Request once it has been accepted and merged in. This is still a manual process. Our PR deployments are all named in the format "pr-###", where the ### is the number of the specific PR. In order to clear all resources for a specific PR, run the following two commands to delete all relevant resources from the Openshift project (replacing `PRNUMBER` with the appropriate number):

```sh
oc delete all -n k8vopl-dev --selector app=getok-pr-<PRNUMBER>
oc delete all,svc,cm,sa,role,secret -n k8vopl-dev --selector cluster-name=pr-<PRNUMBER>
```

The first command will clear out all related executable resources for the application, while the second command will clear out the remaining Patroni cluster resources associated with that PR.

## Appendix: Generating Build Configuration Templates

You will likely not need to run the new template generation sections as that the base templates should already be in git. You should be able to skip those steps.

### New Node Builder Template

*If you are creating a new build configuration template, you will likely use the following commands:*

```sh
oc new-build -n k8vopl-tools registry.access.redhat.com/rhscl/nodejs-8-rhel7:latest~https://github.com/bcgov/nr-get-token.git#master --context-dir=frontend --name=get-token-frontend --dry-run -o yaml > openshift/frontend.bc.yaml
sed -i '' -e 's/kind: List/kind: Template/g' openshift/frontend.bc.yaml
sed -i '' -e 's/items:/objects:/g' openshift/frontend.bc.yaml
```

*Note: You need to remove any secrets and credentials that are auto-inserted into the frontend.bc.yaml file.*

### Process and Apply Builder Template

```sh
oc process -n k8vopl-tools -f openshift/frontend.bc.yaml -o yaml | oc create -n k8vopl-tools -f -
```

### New Caddy Static Image Template

*If you are creating a new build configuration template, you will likely use the following commands:*

```sh
oc new-build -n k8vopl-tools --docker-image=docker-registry.default.svc:5000/bcgov/s2i-caddy:v1-stable --source-image=frontend:latest --source-image-path=/opt/app-root/src/dist:tmp -D $'FROM docker-registry.default.svc:5000/bcgov/s2i-caddy:v1-stable\nCOPY tmp/dist/ /var/www/html/\nCMD /tmp/scripts/run' --dry-run --name=get-token-frontend-static -o yaml > openshift/frontend-static.bc.yaml
sed -i '' -e 's/kind: List/kind: Template/g' openshift/frontend-static.bc.yaml
sed -i '' -e 's/items:/objects:/g' openshift/frontend-static.bc.yaml
```

*Note: You need to remove any secrets and credentials that are auto-inserted into the frontend-static.bc.yaml file.*

### Process and Apply Static Image Template

```sh
oc process -n k8vopl-tools -f openshift/frontend-static.bc.yaml -o yaml | oc create -n k8vopl-tools -f -
```

### Tag the latest build and migrate it to the correct project namespace

```sh
oc tag -n k8vopl-dev k8vopl-tools/frontend-static:latest frontend-static:dev --reference-policy=local
```

### Create new Application Deployment

*If you are creating a new application deployment template, you will likely use the following commands:*

```sh
oc new-app -n k8vopl-dev --image-stream=frontend-static:dev --name=get-token-frontend --dry-run -o yaml > openshift/frontend-static.dc.yaml
```

### Process and Apply the Application Deployment

```sh
oc process -n k8vopl-dev -f openshift/frontend-static.dc.yaml -o yaml | oc create -n k8vopl-dev -f -
oc create -n k8vopl-dev route edge frontend --service=frontend --port=2015-tcp
```

### Templating Work in Progress

The above commands will need to be templated. We can expect something like the following in part of the commands:

```sh
'--name=${NAME}${SUFFIX}' '--context-dir=${GIT_DIR}'
```
