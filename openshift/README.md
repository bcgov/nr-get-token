# OpenShift Setup Notes

This README outlines the steps required for setting up ConfigMaps and Secrets as well as historical notes on creating build configs, deployments, and templating.

## Environment Setup - ConfigMaps and Secrets

The following commands must be run by an administrator for *each* of the target deployment namespace/project.

*Note: Ensure all of the following ConfigMaps and Secrets are implemented in the dev, test and prod environments first! Deployment will fail otherwise!*

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
  --from-literal=SC_GETOK_ENDPOINT=https://i1api.nrs.gov.bc.ca/webade-api/v1 \
  --from-literal=SC_MSSC_ENDPOINT=https://i1api.nrs.gov.bc.ca/cmsg-messaging-api/v1
```

### Secrets

Replace anything in angle brackets with the appropriate value!

_Note: Publickey should be a PEM-encoded value with newlines encoded as \n and encapsulated in double quotes in the argument._

```sh
oc create -n k8vopl-<env> secret generic getok-oidc-secret \
  --type=kubernetes.io/basic-auth \
  --from-literal=username=<username> \
  --from-literal=password=<password> \
  --from-literal=publickey="<key>"
```

```sh
oc create -n k8vopl-<env> secret generic getok-sc-getok-secret \
  --type=kubernetes.io/basic-auth \
  --from-literal=username=<username> \
  --from-literal=password=<password>
```

```sh
oc create -n k8vopl-<env> secret generic getok-sc-mssc-secret \
  --type=kubernetes.io/basic-auth \
  --from-literal=username=<username> \
  --from-literal=password=<password>
```

## Generating Build Configuration Templates

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
