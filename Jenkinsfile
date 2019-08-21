#!groovy
import bcgov.GitHubHelper

// ------------------
// Pipeline Variables
// ------------------

// Stash Names
def BE_COV_STASH = 'backend-coverage'
def FE_COV_STASH = 'frontend-coverage'

// --------------------
// Declarative Pipeline
// --------------------
pipeline {
  agent any

  environment {
    // Enable pipeline verbose debug output if greater than 0
    DEBUG_OUTPUT = 'false'

    // Get projects/namespaces from config maps
    DEV_PROJECT = new File('/var/run/configs/ns/project.dev').getText('UTF-8').trim()
    TEST_PROJECT = new File('/var/run/configs/ns/project.test').getText('UTF-8').trim()
    PROD_PROJECT = new File('/var/run/configs/ns/project.prod').getText('UTF-8').trim()
    TOOLS_PROJECT = new File('/var/run/configs/ns/project.tools').getText('UTF-8').trim()

    // Get application config from config maps
    REPO_OWNER = new File('/var/run/configs/jobs/repo.owner').getText('UTF-8').trim()
    REPO_NAME = new File('/var/run/configs/jobs/repo.name').getText('UTF-8').trim()
    APP_NAME = new File('/var/run/configs/jobs/app.name').getText('UTF-8').trim()
    APP_DOMAIN = new File('/var/run/configs/jobs/app.domain').getText('UTF-8').trim()

    // JOB_NAME should be the pull request/branch identifier (i.e. 'pr-5')
    JOB_NAME = JOB_BASE_NAME.toLowerCase()

    // SOURCE_REPO_* references git repository resources
    SOURCE_REPO_RAW = "https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/master"
    SOURCE_REPO_REF = 'master'
    SOURCE_REPO_URL = "https://github.com/${REPO_OWNER}/${REPO_NAME}.git"

    // HOST_ROUTE is the full domain route endpoint (ie. 'appname-pr-5-k8vopl-dev.pathfinder.gov.bc.ca')
    DEV_HOST_ROUTE = "${APP_NAME}-${JOB_NAME}-${DEV_PROJECT}.${APP_DOMAIN}"
    TEST_HOST_ROUTE = "${APP_NAME}-${JOB_NAME}-${TEST_PROJECT}.${APP_DOMAIN}"
    PROD_HOST_ROUTE = "${APP_NAME}-${JOB_NAME}-${PROD_PROJECT}.${APP_DOMAIN}"

    // SonarQube Endpoint URL
    SONARQUBE_URL_INT = 'http://sonarqube:9000'
    SONARQUBE_URL_EXT = "https://sonarqube-${TOOLS_PROJECT}.${APP_DOMAIN}"
  }

  options {
    parallelsAlwaysFailFast()
  }

  stages {
    stage('Initialize') {
      agent any
      steps {
        // Cancel any running builds in progress
        timeout(10) {
          echo "Cancelling previous ${APP_NAME}-${JOB_NAME} builds in progress..."
          abortAllPreviousBuildInProgress(currentBuild)
        }

        script {
          if(DEBUG_OUTPUT.equalsIgnoreCase('true')) {
            // Force OpenShift Plugin directives to be verbose
            openshift.logLevel(1)

            // Print all environment variables
            echo 'DEBUG - All pipeline environment variables:'
            echo sh(returnStdout: true, script: 'env')
          }
        }
      }
    }

    stage('Tests') {
      agent any
      steps {
        notifyStageStatus('Tests', 'PENDING')

        script {
          parallel(
            Backend: {
              dir('backend') {
                try {
                  timeout(10) {
                    echo 'Installing NPM Dependencies...'
                    sh 'npm ci'

                    echo 'Linting and Testing Backend...'
                    sh 'npm run test'

                    echo 'Backend Lint Checks and Tests passed'
                  }
                } catch (e) {
                  echo 'Backend Lint Checks and Tests failed'
                  throw e
                }
              }
            },

            Frontend: {
              dir('frontend') {
                try {
                  timeout(10) {
                  echo 'Installing NPM Dependencies...'
                  sh 'npm ci'

                  echo 'Linting and Testing Backend...'
                  sh 'npm run test:unit'

                  echo 'Frontend Lint Checks and Tests passed'

                  }
                } catch (e) {
                  echo 'Frontend Lint Checks and Tests failed'
                  throw e
                }
              }
            }
          )
        }
      }
      post {
        success {
          stash name: BE_COV_STASH, includes: 'backend/coverage/**'
          stash name: FE_COV_STASH, includes: 'frontend/coverage/**'

          echo 'All Lint Checks and Tests passed'
          notifyStageStatus('Tests', 'SUCCESS')
        }
        failure {
          echo 'Some Lint Checks and Tests failed'
          notifyStageStatus('Tests', 'FAILURE')
        }
      }
    }

    stage('Build') {
      agent any
      steps {
        script {
          openshift.withCluster() {
            openshift.withProject(TOOLS_PROJECT) {
              if(DEBUG_OUTPUT.equalsIgnoreCase('true')) {
                echo "DEBUG - Using project: ${openshift.project()}"
              }

              parallel(
                Backend: {
                  try {
                    notifyStageStatus('Backend', 'PENDING')

                    echo "Processing BuildConfig ${REPO_NAME}-backend..."
                    def bcBackend = openshift.process('-f',
                      'openshift/backend.bc.yaml',
                      "REPO_NAME=${REPO_NAME}",
                      "JOB_NAME=${JOB_NAME}",
                      "SOURCE_REPO_URL=${SOURCE_REPO_URL}",
                      "SOURCE_REPO_REF=${SOURCE_REPO_REF}"
                    )

                    echo "Building ImageStream ${REPO_NAME}-backend..."
                    openshift.apply(bcBackend).narrow('bc').startBuild('-w').logs('-f')

                    echo "Tagging Image ${REPO_NAME}-backend:${JOB_NAME}..."
                    openshift.tag("${REPO_NAME}-backend:latest",
                      "${REPO_NAME}-backend:${JOB_NAME}"
                    )

                    echo 'Backend build successful'
                    notifyStageStatus('Backend', 'SUCCESS')
                  } catch (e) {
                    echo 'Backend build failed'
                    notifyStageStatus('Backend', 'FAILURE')
                    throw e
                  }
                },

                Frontend: {
                  try {
                    notifyStageStatus('Frontend', 'PENDING')

                    echo "Processing BuildConfig ${REPO_NAME}-frontend..."
                    def bcFrontend = openshift.process('-f',
                      'openshift/frontend.bc.yaml',
                      "REPO_NAME=${REPO_NAME}",
                      "JOB_NAME=${JOB_NAME}",
                      "SOURCE_REPO_URL=${SOURCE_REPO_URL}",
                      "SOURCE_REPO_REF=${SOURCE_REPO_REF}"
                    )

                    echo "Building ImageStream ${REPO_NAME}-frontend..."
                    openshift.apply(bcFrontend).narrow('bc').startBuild('-w').logs('-f')

                    echo "Tagging Image ${REPO_NAME}-frontend:${JOB_NAME}..."
                    openshift.tag("${REPO_NAME}-frontend:latest",
                      "${REPO_NAME}-frontend:${JOB_NAME}"
                    )

                    echo "Processing BuildConfig ${REPO_NAME}-frontend-static..."
                    def bcFrontendStatic = openshift.process('-f',
                      'openshift/frontend-static.bc.yaml',
                      "REPO_NAME=${REPO_NAME}",
                      "JOB_NAME=${JOB_NAME}",
                      "NAMESPACE=${TOOLS_PROJECT}"
                    )

                    echo "Building ImageStream ${REPO_NAME}-frontend-static..."
                    openshift.apply(bcFrontendStatic).narrow('bc').startBuild('-w').logs('-f')

                    echo "Tagging Image ${REPO_NAME}-frontend-static:${JOB_NAME}..."
                    openshift.tag("${REPO_NAME}-frontend-static:latest",
                      "${REPO_NAME}-frontend-static:${JOB_NAME}"
                    )

                    echo 'Frontend build successful'
                    notifyStageStatus('Frontend', 'SUCCESS')
                  } catch (e) {
                    echo 'Frontend build failed'
                    notifyStageStatus('Frontend', 'FAILURE')
                    throw e
                  }
                },

                SonarQube: {
                  unstash BE_COV_STASH
                  unstash FE_COV_STASH

                  echo 'Performing SonarQube static code analysis...'
                  sh """
                  sonar-scanner \
                    -Dsonar.host.url='${SONARQUBE_URL_INT}' \
                    -Dsonar.projectKey='${REPO_NAME}' \
                    -Dsonar.projectName='NR Get Token (${JOB_NAME.toUpperCase()})'
                  """
                }
              )
            }
          }
        }
      }
      post {
        success {
          echo 'Cleanup Backend BuildConfigs...'
          script {
            openshift.withCluster() {
              openshift.withProject(TOOLS_PROJECT) {
                if(DEBUG_OUTPUT.equalsIgnoreCase('true')) {
                  echo "DEBUG - Using project: ${openshift.project()}"
                } else {
                  def bcBackend = openshift.selector('bc', "${REPO_NAME}-backend-${JOB_NAME}")
                  def bcFrontend = openshift.selector('bc', "${REPO_NAME}-frontend-${JOB_NAME}")
                  def bcFrontendStatic = openshift.selector('bc', "${REPO_NAME}-frontend-static-${JOB_NAME}")

                  if(bcBackend.exists()) {
                    echo "Removing BuildConfig ${REPO_NAME}-backend-${JOB_NAME}..."
                    bcBackend.delete()
                  }
                  if(bcFrontend.exists()) {
                    echo "Removing BuildConfig ${REPO_NAME}-frontend-${JOB_NAME}..."
                    bcFrontend.delete()
                  }
                  if(bcFrontendStatic.exists()) {
                    echo "Removing BuildConfig ${REPO_NAME}-frontend-static-${JOB_NAME}..."
                    bcFrontendStatic.delete()
                  }
                }
              }
            }
          }
        }
      }
    }

    stage('Deploy - Dev') {
      agent any
      steps {
        script {
          deployStage('Dev', DEV_PROJECT, DEV_HOST_ROUTE)
        }
      }
      post {
        success {
          createDeploymentStatus(DEV_PROJECT, 'SUCCESS', DEV_HOST_ROUTE)
          notifyStageStatus('Deploy - Dev', 'SUCCESS')
        }
        unsuccessful {
          createDeploymentStatus(DEV_PROJECT, 'FAILURE', DEV_HOST_ROUTE)
          notifyStageStatus('Deploy - Dev', 'FAILURE')
        }
      }
    }

    stage('Deploy - Test') {
      agent any
      steps {
        script {
          deployStage('Test', TEST_PROJECT, TEST_HOST_ROUTE)
        }
      }
      post {
        success {
          createDeploymentStatus(TEST_PROJECT, 'SUCCESS', TEST_HOST_ROUTE)
          notifyStageStatus('Deploy - Test', 'SUCCESS')
        }
        unsuccessful {
          createDeploymentStatus(TEST_PROJECT, 'FAILURE', TEST_HOST_ROUTE)
          notifyStageStatus('Deploy - Test', 'FAILURE')
        }
      }
    }

    stage('Deploy - Prod') {
      agent any
      steps {
        script {
          deployStage('Prod', PROD_PROJECT, PROD_HOST_ROUTE)
        }
      }
      post {
        success {
          createDeploymentStatus(PROD_PROJECT, 'SUCCESS', PROD_HOST_ROUTE)
          notifyStageStatus('Deploy - Prod', 'SUCCESS')
        }
        unsuccessful {
          createDeploymentStatus(PROD_PROJECT, 'FAILURE', PROD_HOST_ROUTE)
          notifyStageStatus('Deploy - Prod', 'FAILURE')
        }
      }
    }
  }
}

// ------------------
// Pipeline Functions
// ------------------

// Parameterized deploy stage
def deployStage(String stageEnv, String projectEnv, String hostRouteEnv) {
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
      if(!(openshift.selector('cm', "getok-oidc-config").exists() &&
      openshift.selector('cm', "getok-sc-config").exists() &&
      openshift.selector('cm', "getok-server-config").exists() &&
      openshift.selector('secret', "getok-oidc-secret").exists() &&
      openshift.selector('secret', "getok-sc-getokint-secret").exists() &&
      openshift.selector('secret', "getok-sc-getoktest-secret").exists() &&
      openshift.selector('secret', "getok-sc-getokprod-secret").exists() &&
      openshift.selector('secret', "getok-sc-keycloakint-secret").exists() &&
      openshift.selector('secret', "getok-sc-mssc-secret").exists())) {
        echo 'Some ConfigMaps and/or Secrets are missing. Please consult the openshift readme for details.'
        throw e
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

      createDeploymentStatus(projectEnv, 'PENDING', hostRouteEnv)

      // Apply Patroni Database
      timeout(10) {
        echo "Processing Patroni StatefulSet.."
        def dcPatroniTemplate = openshift.process('-f',
          'openshift/patroni.dc.yaml',
          "INSTANCE=${JOB_NAME}"
        )

        echo "Applying Patroni StatefulSet..."
        def dcPatroni = openshift.apply(dcPatroniTemplate).narrow('statefulset')
        dcPatroni.rollout().status('--watch=true')
      }

      // Wait for deployments to roll out
      timeout(10) {
        parallel(
          Backend: {
            // Apply Backend Server
            echo "Tagging Image ${REPO_NAME}-backend:${JOB_NAME}..."
            openshift.tag("${TOOLS_PROJECT}/${REPO_NAME}-backend:${JOB_NAME}", "${REPO_NAME}-backend:${JOB_NAME}")

            echo "Processing DeploymentConfig ${REPO_NAME}-backend..."
            def dcBackendTemplate = openshift.process('-f',
              'openshift/backend.dc.yaml',
              "REPO_NAME=${REPO_NAME}",
              "JOB_NAME=${JOB_NAME}",
              "NAMESPACE=${projectEnv}",
              "APP_NAME=${APP_NAME}",
              "HOST_ROUTE=${hostRouteEnv}"
            )

            echo "Applying ${REPO_NAME}-backend Deployment..."
            def dcBackend = openshift.apply(dcBackendTemplate).narrow('dc')
            dcBackend.rollout().status('--watch=true')
          },

          Frontend: {
            // Apply Frontend Server
            echo "Tagging Image ${REPO_NAME}-frontend-static:${JOB_NAME} Deployment..."
            openshift.tag("${TOOLS_PROJECT}/${REPO_NAME}-frontend-static:${JOB_NAME}", "${REPO_NAME}-frontend-static:${JOB_NAME}")

            echo "Processing ${REPO_NAME}-frontend-static Deployment..."
            def dcFrontendStaticTemplate = openshift.process('-f',
              'openshift/frontend-static.dc.yaml',
              "REPO_NAME=${REPO_NAME}",
              "JOB_NAME=${JOB_NAME}",
              "NAMESPACE=${projectEnv}",
              "APP_NAME=${APP_NAME}",
              "HOST_ROUTE=${hostRouteEnv}"
            )

            echo "Applying ${REPO_NAME}-frontend-static Deployment..."
            def dcFrontendStatic = openshift.apply(dcFrontendStaticTemplate).narrow('dc')
            dcFrontendStatic.rollout().status('--watch=true')
          }
        )
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
def createDeploymentStatus(String environment, String status, String hostUrl) {
  def ghDeploymentId = new GitHubHelper().createDeployment(
    this,
    SOURCE_REPO_REF,
    [
      'environment': environment,
      'task': "deploy:master"
    ]
  )

  new GitHubHelper().createDeploymentStatus(
    this,
    ghDeploymentId,
    status,
    ['targetUrl': "https://${hostUrl}"]
  )

  if (status.equalsIgnoreCase('SUCCESS')) {
    echo "${environment} deployment successful at https://${hostUrl}"
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
