#!groovy
import bcgov.GitHubHelper

// ------------------
// Pipeline Functions
// ------------------

// Parameterized deploy stage
def deployStage(String stageEnv, String projectEnv, String hostEnv, String pathEnv) {
  if (!stageEnv.equalsIgnoreCase('Dev')) {
    input("Deploy to ${projectEnv}?")
  }

  notifyStageStatus("Deploy - ${stageEnv}", 'PENDING')

  openshift.withCluster() {
    openshift.withProject(projectEnv) {
      if(DEBUG_OUTPUT.equalsIgnoreCase('true')) {
        echo "DEBUG - Using project: ${openshift.project()}"
      }

      echo "Checking for ConfigMaps and Secrets in project ${openshift.project()}..."
      if(!(openshift.selector('cm', "getok-frontend-config").exists() &&
      openshift.selector('cm', "getok-oidc-config").exists() &&
      openshift.selector('cm', "getok-sc-config").exists() &&
      openshift.selector('cm', "getok-server-config").exists() &&
      openshift.selector('secret', "getok-keycloak-secret").exists() &&
      openshift.selector('secret', "getok-oidc-secret").exists() &&
      openshift.selector('secret', "getok-sc-getokint-secret").exists() &&
      openshift.selector('secret', "getok-sc-getoktest-secret").exists() &&
      openshift.selector('secret', "getok-sc-getokprod-secret").exists() &&
      openshift.selector('secret', "getok-sc-keycloakint-secret").exists() &&
      openshift.selector('secret', "getok-sc-keycloaktest-secret").exists() &&
      openshift.selector('secret', "getok-sc-keycloakprod-secret").exists() &&
      openshift.selector('secret', "getok-sc-ches-secret").exists())) {
        echo 'Some ConfigMaps and/or Secrets are missing. Please consult the openshift readme for details.'
        throw new Exception('Missing ConfigMaps and/or Secrets')
      }

      if(openshift.selector('secret', "patroni-${JOB_NAME}-secret").exists()) {
        echo "Patroni Secret already exists. Skipping..."
      } else {
        echo "Processing Patroni Secret..."
        def dcPatroniSecretTemplate = openshift.process('-f',
          'openshift/patroni.secret.yaml',
          "APP_DB_NAME=${APP_NAME}",
          "INSTANCE=${JOB_NAME}"
        )

        echo "Creating Patroni Secret..."
        openshift.create(dcPatroniSecretTemplate)
      }

      // Apply Patroni Database
      timeout(10) {
        def dcPatroniTemplate
        if(JOB_BASE_NAME.startsWith('PR-')) {
          echo "Processing Patroni StatefulSet (Ephemeral)..."
          dcPatroniTemplate = openshift.process('-f',
            'openshift/patroni-ephemeral.dc.yaml',
            "APP_NAME=${APP_NAME}",
            "INSTANCE=${JOB_NAME}",
            "NAMESPACE=${projectEnv}"
          )
        } else {
          echo "Processing Patroni StatefulSet (Persistent)..."
          dcPatroniTemplate = openshift.process('-f',
            'openshift/patroni.dc.yaml',
            "INSTANCE=${JOB_NAME}",
            "NAMESPACE=${projectEnv}"
          )
        }

        echo "Applying Patroni StatefulSet..."
        def dcPatroni = openshift.apply(dcPatroniTemplate).narrow('statefulset')
        dcPatroni.rollout().status('--watch=true')
      }

      commonPipeline.createDeploymentStatus(projectEnv, 'PENDING', JOB_NAME, hostEnv, pathEnv)

      // Wait for deployments to roll out
      timeout(10) {
        // Apply App Server
        echo "Tagging Image ${REPO_NAME}-app:${JOB_NAME}..."
        openshift.tag("${TOOLS_PROJECT}/${REPO_NAME}-app:${JOB_NAME}", "${REPO_NAME}-app:${JOB_NAME}")

        echo "Processing DeploymentConfig ${REPO_NAME}-app-${JOB_NAME}..."
        def dcAppTemplate = openshift.process('-f',
          'openshift/app.dc.yaml',
          "REPO_NAME=${REPO_NAME}",
          "JOB_NAME=${JOB_NAME}",
          "NAMESPACE=${projectEnv}",
          "APP_NAME=${APP_NAME}",
          "ROUTE_HOST=${hostEnv}",
          "ROUTE_PATH=${pathEnv}"
        )

        echo "Applying ${REPO_NAME}-app-${JOB_NAME} Deployment..."
        def dcApp = openshift.apply(dcAppTemplate).narrow('dc')
        dcApp.rollout().status('--watch=true')
      }
    }
  }
}

// --------------------
// Supporting Functions
// --------------------

// Notify stage status and pass to Jenkins-GitHub library
def notifyStageStatus(String name, String status) {
  def sha1 = GIT_COMMIT
  if(JOB_BASE_NAME.startsWith('PR-')) {
    sha1 = GitHubHelper.getPullRequestLastCommitId(this)
  }

  GitHubHelper.createCommitStatus(
    this, sha1, status, BUILD_URL, '', "Stage: ${name}"
  )
}

// Create deployment status and pass to Jenkins-GitHub library
def createDeploymentStatus(String environment, String status, String jobName, String hostEnv, String pathEnv) {
  def task = (JOB_BASE_NAME.startsWith('PR-')) ? "deploy:pull:${CHANGE_ID}" : "deploy:${jobName}"
  def ghDeploymentId = new GitHubHelper().createDeployment(
    this,
    SOURCE_REPO_REF,
    [
      'environment': environment,
      'task': task
    ]
  )

  new GitHubHelper().createDeploymentStatus(
    this,
    ghDeploymentId,
    status,
    ['targetUrl': "https://${hostEnv}${pathEnv}"]
  )

  if (status.equalsIgnoreCase('SUCCESS')) {
    echo "${environment} deployment successful at https://${hostEnv}${pathEnv}"
  } else if (status.equalsIgnoreCase('PENDING')) {
    echo "${environment} deployment pending..."
  } else if (status.equalsIgnoreCase('FAILURE')) {
    echo "${environment} deployment failed"
  }
}

// Creates a comment and pass to Jenkins-GitHub library
def commentOnPR(String comment) {
  if(JOB_BASE_NAME.startsWith('PR-')) {
    GitHubHelper.commentOnPullRequest(this, comment)
  }
}

return this
