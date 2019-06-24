# Integration Tools

We use both Jenkins and SonarQube in order to facilitate our PR based pipeline. We outline the instuctions to set up those tools below.

## Jenkins

Uses BcDevOPs CICD Jenkins Basic install  [link](https://github.com/BCDevOps/openshift-components/tree/cvarjao-update-jenkins-basic/cicd/jenkins-basic)

The commands, labels, and naming conventions follow the Pull Request Pipeline principles of the BcDevOPs pipeline-cli [link] (https://github.com/BCDevOps/pipeline-cli).

The jobs that Jenkins creates and uses will also follow those principles and build out an "environment" for each pull request.

This repository adds a script to the existing Jenkins deployment that will create our jobs.

See tools/docker/contrib/jenkins/configuration/init.groovy.d/003-create-jobs.groovy.

To add or change the jobs, this is where you want to go.  The name of this file is important, as it needs to get run *BEFORE* the 003-register-github-webhooks.groovy included in the basic install.  Scripts are run alphabetically.  The jobs need to be created before the github webhooks are created.  Our jobs script will read secrets and configmaps created during this setup; described below.

### Prerequisites

We assume that you already have 4 OpenShift projects with the following suffixes: `dev`, `test`, `prod`, `tools`.

You will need a github account and token (preferrably a team shared account) with access to your repo: [New Personal Access Token](https://github.com/settings/tokens/new?scopes=repo,read:user,user:email,admin:repo_hook).

### Setup Jenkins

The following commands setup up the Prod instance of Jenkins and uses this repository and specific OpenShift project namespaces.

### Notes

#### Parameters

-p VERSION={tag}

#### Labels

-l env-name={phase}

-l env-id={changeId/pull request number}

-l app={app name}{suffix}

### OpenShift Login

Login via web console, click your login name at top tight and click "Copy Login Command".  Go to your terminal, go to your project root and paste the copy command.

```sh
cd tools/jenkins
```

### Create Secrets

```sh
oc -n k8vopl-tools process -f 'openshift/secrets.yaml' -p 'GH_USERNAME=bcgov-nr-csst' -p 'GH_PASSWORD=<personal_access_token>' | oc  -n k8vopl-tools create -f -
```

### Create Config Maps

This identifies the associated namespaces that Jenkins will be manipulating.

```sh
oc -n k8vopl-tools process -f 'openshift/ns-config.yaml' -p 'DEV=k8vopl-dev' -p 'TEST=k8vopl-test' -p 'PROD=k8vopl-prod' -p 'TOOLS=k8vopl-tools' | oc  -n k8vopl-tools create -f -
```

This lets Jenkins know what repository it will be responsible for.

```sh
oc -n k8vopl-tools process -f 'openshift/jobs-config.yaml' -p 'REPO_OWNER=bcgov' -p 'REPO_NAME=nr-get-token' -p 'APP_NAME=getok' -p 'APP_DOMAIN=pathfinder.gov.bc.ca' | oc -n k8vopl-tools create -f -
```

### Grant Service Account Access

This is required in order to allow Jenkins to have the RBAC permissions to handle deployments in other namespaces.

```sh
oc -n k8vopl-dev policy add-role-to-user 'admin' 'system:serviceaccount:k8vopl-tools:jenkins-prod'
oc -n k8vopl-test policy add-role-to-user 'admin' 'system:serviceaccount:k8vopl-tools:jenkins-prod'
oc -n k8vopl-prod policy add-role-to-user 'admin' 'system:serviceaccount:k8vopl-tools:jenkins-prod'
```

### Build Config Templates

These build configs have no build triggers. They are to be invoked manually (or within a Jenkins job script)

#### Master Build

Process

```sh
oc -n k8vopl-tools process -f 'openshift/build-master.yaml' -p 'NAME=jenkins' -p 'SUFFIX=-prod' -p 'VERSION=prod-1.0.0' -p 'SOURCE_REPOSITORY_URL=https://github.com/bcgov/nr-get-token' -p 'SOURCE_REPOSITORY_REF=master' -l app-name=jenkins -l env-name=prod -l env-id=0 -l github-repo=https://github.com/bcgov/nr-get-token -l github-owner=bcgov -l app=jenkins-prod -o yaml | oc -n k8vopl-tools create -f -
```

Start the build and follow progress

```sh
oc -n k8vopl-tools start-build bc/jenkins-prod -F
```

#### Slave Build

Process

```sh
oc -n k8vopl-tools process -f 'openshift/build-slave.yaml' -p 'NAME=jenkins' -p 'SUFFIX=-prod' -p 'VERSION=prod-1.0.0' -p 'SLAVE_NAME=main' -p 'SOURCE_IMAGE_STREAM_TAG=jenkins:prod-1.0.0' -l app-name=jenkins -l env-name=prod -l env-id=0 -l github-repo=https://github.com/bcgov/nr-get-token -l github-owner=bcgov -l app=jenkins-prod -o yaml | oc -n k8vopl-tools create -f -
```

Start the build and follow progress

```sh
oc -n k8vopl-tools start-build bc/jenkins-slave-main-prod -F
```

### Deployment Templates

These deployment config templates generally bring up one Jenkins Master and one Jenkins Slave worker.

#### Master Deploy

```sh
oc -n k8vopl-tools process -f 'openshift/deploy-master.yaml' -p 'NAME=jenkins' -p 'SUFFIX=-prod' -p 'VERSION=prod-1.0.0' -p 'ROUTE_HOST=jenkins-prod-k8vopl-tools.pathfinder.gov.bc.ca' -p 'GH_USERNAME=bcgov-nr-csst' -p 'GH_PASSWORD=<personal_access_token>' -l app-name=jenkins -l env-name=prod -l env-id=0 -l github-repo=https://github.com/bcgov/nr-get-token -l github-owner=bcgov -l app=jenkins-prod -o yaml | oc -n k8vopl-tools create -f -
```

#### Slave Deploy

```sh
oc -n k8vopl-tools process -f 'openshift/deploy-slave.yaml' -p 'NAME=jenkins' -p 'SUFFIX=-prod' -p 'VERSION=prod-1.0.0' -p 'NAMESPACE=k8vopl-tools' -p 'SLAVE_NAME=build' -l app-name=jenkins -l env-name=prod -l env-id=0 -l github-repo=https://github.com/bcgov/nr-get-token -l github-owner=bcgov -l app=jenkins-prod -o yaml | oc -n k8vopl-tools create -f -
```

### Cleanup

Should you need to tear down the Jenkins, you will want to run the following command. Make sure you are sure this is what you want to do as you will not be able to recover old stored data!

```sh
oc -n k8vopl-tools delete all,template,secret,configmap,pvc,serviceaccount,rolebinding --selector app=jenkins-prod
```

## SonarQube

SonarQube is a static analysis tool which assists with improving and maintaining code quality. For this tool to work, you will need the SonarQube server, as well as an agent that runs the sonar-scanner.

### SonarQube Server

To deploy a SonarQube server instance to our tools project we simply leverage the prebuilt server image provided by the BCDevOps organization found on the [BCDevOps SonarQube repository](https://github.com/BCDevOps/sonarqube).

We outline below the rapid startup steps to get SonarQube Server setup. Refer to the original repository for more details if necessary.

#### SonarQube Deploy

You will need to get the `sonarqube-postgresql-template.yaml` file in order to deploy it to openshift. This will deploy BOTH the PostgreSQL database AND the SonarQube server.

*Note: At the time of writing, the master branch of BCDevOps SonarQube repo was at commit `bbb9f62e29706b61382cf24d7ad7e08f2476a01f`.*

```sh
curl https://raw.githubusercontent.com/BCDevOps/sonarqube/master/sonarqube-postgresql-template.yaml > sonarqube-postgresql-template.yaml
```

Deploying the database is done with the following:

```sh
oc new-app -f sonarqube-postgresql-template.yaml --param=SONARQUBE_VERSION=6.7.5
```

#### Admin Password

The SonarQube server instance is created with standard insecure credentials (User: `admin`, PW:). This should be reset to something stronger and stored in an OpenShift secret so authorized developers can find it.

The BCDevOps SonarQube repo provides a script that will generate a random PW, set it in SonarQube, and create a secret. This can be found under the  `/provisioning` folder of the cloned BCDevOps repo.

In order to directly get the password reset script, run the following:

```sh
curl https://raw.githubusercontent.com/BCDevOps/sonarqube/master/provisioning/updatesqadminpw.sh > updatesqadminpw.sh
```

Then simply run the following script and follow its instructions. Make sure you save the new password in an OpenShift secret or equivalent!

```sh
./updatesqadminpw.sh
```

### SonarQube Scanner

In order for static code analysis to happen, there must be a scanner agent that processes the code. This is achieved with the sonar-scanner distribution which can be found [here](https://github.com/SonarSource/sonar-scanner-cli). This should already be preinstalled on the Jenkins Slave agent - otherwise it will fail to run.

*Note: At the time of writing, we are currently using version `3.3.0.1492`.*

Should you wish to install and use `sonar-scanner` locally, follow the appropriate instructions depending on your platform.

#### Linux

```sh
curl -o /tmp/sonar-scanner-cli.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-3.3.0.1492-linux.zip
unzip /tmp/sonar-scanner-cli.zip -d /tmp/sonar-scanner-cli
mv /tmp/sonar-scanner-cli/sonar-scanner-3.3.0.1492-linux /opt/sonar-scanner
ln -s /opt/sonar-scanner/bin/sonar-scanner /usr/local/bin
```

#### Windows

*Note: The following assumes you are using the [Chocolatey Package Manager](https://chocolatey.org/). If you are not using Chocolatey, you will need to figure out how to get the client from the [official website](https://www.sonarqube.org/downloads/).*

```powershell
choco install -y sonarqube-scanner.portable --version 3.3.0.1492
```

### Static Analysis

Once you have `sonar-scanner` installed, ensure that you are in the same directory as the `sonar-project.properties` file. Then all you need to do is run the following (replace the arguments as necessary):

```sh
sonar-scanner -Dsonar.host.url='CHANGEURLHERE' -Dsonar.projectKey='CHANGEPROJECTKEYHERE' -Dsonar.projectName='NR Get Token (CHANGEBRANCHNAMEHERE)'
```
