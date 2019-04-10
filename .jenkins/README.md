# Setup

Clone this repository.

## Update config.xml files

specify `repoOwner` and `repository` in `/docker/contrib/jenkins/configuration/jobs/_jenkins/config.xml` and `/docker/contrib/jenkins/configuration/jobs/app/config.xml`:

```
<org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject ...
  <sources ...
    <data>
      <jenkins.branch.BranchSource>
        <source ...
          <id>generate a new giud</id>
            ...
          <repoOwner>bcgov</repoOwner>
          <repository>GDX-Analytics-OpenShift-Snowplow-Gateway-Service</repository>
```

## Update .jenkins/.pipeline/lib/config.js

to set the deployment phase namespaces according to the appropriate project namespaces

```
const phases = {
  build: {namespace:'8gsiqa-tools' ...
  dev:   {namespace:'8gsiqa-dev'   ...
  test:  {namespace:'8gsiqa-test'  ...
  prod:  {namespace:'8gsiqa-prod'  ...
```

## oc login
```
#perform oc login (Copy command from web console)
```

# create secrets template
```
oc -n 8gsiqa-tools process -f 'openshift/secrets.json' -p 'GH_USERNAME=<username>' -p 'GH_PASSWORD=<personal_access_token>' | oc  -n 8gsiqa-tools create -f -
```

# Build and Deploy Jenkins locally once for setup
```
cd "$(git rev-parse --show-toplevel)/.jenkins/.pipeline"

npm i

npm run build -- --pr=0 --dev-mode=true
# dev-mode=true makes a binary build from the working directory.

npm run deploy -- --pr=0 --env=prod

npm run clean -- --pr=0
# check in Jenkins PROD log to make sure that there are no Java exceptions logs;
# if there are any, you will have to escalate to devops team.
```

## Grant Admin access to Jenkins Service account in each managed namespace
```
oc -n 8gsiqa-dev policy add-role-to-user 'admin' 'system:serviceaccount:8gsiqa-tools:jenkins-prod'
oc -n 8gsiqa-test policy add-role-to-user 'admin' 'system:serviceaccount:8gsiqa-tools:jenkins-prod'
oc -n 8gsiqa-prod policy add-role-to-user 'admin' 'system:serviceaccount:8gsiqa-tools:jenkins-prod'
oc -n 8gsiqa-tools policy add-role-to-group 'system:image-puller' 'system:serviceaccounts:8gsiqa-dev' 'system:serviceaccounts:8gsiqa-test' 'system:serviceaccounts:8gsiqa-prod'
```

## For local development purposes

### Build
```
( cd "$(git rev-parse --show-toplevel)" && .jenkins/.pipeline/npmw build -- --pr=0 )
```

### Deploy
```
( cd "$(git rev-parse --show-toplevel)" && .jenkins/.pipeline/npmw deploy -- --pr=0 --env=dev )
```

### Cleanup
```
( cd "$(git rev-parse --show-toplevel)" && .jenkins/pipeline-cli clean -- --pr=0 --env=dev )
```
