# Natural Resources Get Token  

Natural Resources Get Token (GETOK) will automate the process for Development teams to get setup to use the common services published on [https://apistore.nrs.gov.bc.ca/store/](https://apistore.nrs.gov.bc.ca/store/).   

GETOK has a service client GETOK_SERVICE which is granted the WEBADE-REST "profileRole" of APPLICATION_ADMINISTRATOR. This allows the GETOK_SERVICE to create new WebADE service Clients.   
> The first deployment of this webade-cfg information had to be done manually using the process we are replacing. See [Bitbucket GETOK Repo](https://apps.nrs.gov.bc.ca/int/stash/projects/GETOK/repos/getok-webade-cfg/browse) for the package that was used for the first deployment. Subsequent deployment to modify this can be done through the WEBADE-REST-API endpoints.

GETOK will be a front end access point for authorized IDIR users to request the ability to create and update their application's WebADE service Client. GETOK will allow authorized IDIR users to grant Developers that ability for their app and for a common service. Once approved a developer will be able to create and deploy WebADE service client application configuration instantly to gain access to common service APIs like email notifications, document management, or document generation.  

## Project Status  

[Showcase Team Roadmap](https://github.com/bcgov/nr-get-token/wiki/Product-Roadmap)  
  
TBD - This will have build status and badges  

## Directory Structure  

    .github/                   - PR and Issue templates
    backend/                   - Backend codebase
    docs/                      - Documentation
    frontend/                  - Frontend codebase
    openshift/                 - OpenShift-deployment specific files
    tools/                     - Devops utilities
    └── jenkins                - Jenkins standup
    CODE-OF-CONDUCT.md         - Code of Conduct
    CONTRIBUTING.md            - Contributing Guidelines
    Jenkinsfile                - Top-level Pipeline
    Jenkinsfile.cicd           - Pull-Request Pipeline
    LICENSE                    - License

## Documentation

* [Backend Readme](backend/README.md)
* [Frontend Readme](frontend/README.md)
* [Openshift Readme](openshift/README.md)
* [Get Token Wiki](https://github.com/bcgov/nr-get-token/wiki)

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
