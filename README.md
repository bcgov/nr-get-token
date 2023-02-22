# Common Service Get Token [![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE) [![Lifecycle:Retired](https://img.shields.io/badge/Lifecycle-Retired-d45500)](https://github.com/bcgov/repomountie/blob/master/doc/lifecycle-badges.md)

![Tests](https://github.com/bcgov/nr-get-token/workflows/Tests/badge.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/1b687dfb13ea3390707d/maintainability)](https://codeclimate.com/github/bcgov/nr-get-token/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/1b687dfb13ea3390707d/test_coverage)](https://codeclimate.com/github/bcgov/nr-get-token/test_coverage)

To learn more about the **Common Services** available visit the [Common Services Showcase](https://bcgov.github.io/common-service-showcase/) page.

GETOK is a web-based tool for development teams to manage their application's secure access to Common Services. Users can create and deploy service clients instantly to gain access to common service APIs like email notifications, document management, or document generation.

## Directory Structure

    .github/                   - PR and Issue templates
    app                        - Application Root
    ├── frontend               - Frontend Root
    │   ├── src                - Vue.js frontend web application
    │   └── tests              - Vue.js frontend web application tests
    ├── src                    - Node.js backend web application
    └── tests                  - Node.js backend web application tests
    docs/                      - Documentation
    openshift/                 - OpenShift-deployment and shared pipeline files
    CODE-OF-CONDUCT.md         - Code of Conduct
    CONTRIBUTING.md            - Contributing Guidelines
    Jenkinsfile                - Top-level Pipeline
    Jenkinsfile.cicd           - Pull-Request Pipeline
    LICENSE                    - License
    vetur.config.js            - Vetur configuration

## Documentation

* [Overview](docs/overview.md)
* [Developer Guide](docs/developer-guide.md)
* [Application Readme](app/README.md)
* [Frontend Readme](app/frontend/README.md)
* [Openshift Readme](openshift/README.md)
* [Devops Tools Setup](https://github.com/bcgov/nr-showcase-devops-tools)
* [Get Token Wiki](https://github.com/bcgov/nr-get-token/wiki)
* [Showcase Team Roadmap](https://github.com/bcgov/nr-get-token/wiki/Product-Roadmap)

## Getting Help or Reporting an Issue

To report bugs/issues/features requests, please file an [issue](https://github.com/bcgov/nr-get-token/issues).

## How to Contribute

If you would like to contribute, please see our [contributing](CONTRIBUTING.md) guidelines.

Please note that this project is released with a [Contributor Code of Conduct](CODE-OF-CONDUCT.md). By participating in this project you agree to abide by its terms.

## License

    Copyright 2019 Province of British Columbia

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
