# Common Service Get Token

To learn more about the **Common Services** available visit the [Common Services Showcase](https://bcgov.github.io/common-service-showcase/) page.

GETOK is a web-based tool for development teams to manage their application's secure access to Common Services. Users can create and deploy Keycloak or WebADE service client application configuration instantly to gain access to common service APIs like email notifications, document management, or document generation.

## Frontend

The frontend of the application is built on the [Vue.js](https://vuejs.org/) framework as a static UI layer. The web application calls to the GETOK API (see [app](../app)) for authentication and application funtionality.

The frontend of the application allows users to fill in the appropriate info required to create a service client, and then test token aquisition. The backend API handles communication with the authorization systems to create the application configuration. The backend API also creates the password required for the service client and securely returns it to the UI (see [Password Generation](https://github.com/bcgov/nr-get-token/wiki/Password-Generation) for these details).

### Vue Archetecture

The frontend was built up from scratch using the official [Vue CLI](https://cli.vuejs.org/) distribution. See the [Vue CLI docs](https://cli.vuejs.org/) for more information.

#### Vuetify

The material design framework Vuetify is used for design and layout. All additional UI elements added should use Veutfify components and material design language. See the [Vuetify docs](https://vuetifyjs.com/en/getting-started/quick-start) for more information. We installed the Vuetify framework by running `vue add Vuetify`.

#### Vuex

The Vuex state management system is an integral part of the frontend application. It maintains a centralized store for all the components in the app. The location of the store in the project structure is `./src/store`. See the [Vuex docs](https://vuex.vuejs.org/) for more information.

#### Vue Router

Vue Router is used for Single Page App routing. See the [Vue Router docs](https://router.vuejs.org/) for more information. We are not using history mode in order to ensure network pathing remains consistent.

### Other Dependencies

Other imported libraries used in the application include:

* [axios](https://www.npmjs.com/package/axios) for REST calls
* [core-js](https://www.npmjs.com/package/core-js) standard JS library
* [cryptico-js](https://www.npmjs.com/package/cryptico-js) for password decryption
* [nprogress](https://www.npmjs.com/package/nprogress) AJAX progress bars

See `./package.json` for more.

## Environment Configuration

At the root of this `frontend` directory are environment files that create environment variables that are accessible to the app at build time.

For local development, create a `.env.development.local` file at this location (it will be ignored by Git) to provide local environment variables. This will be invoked when *npm run serve* is used.

See the Vue CLI docs on [Modes and Environment](https://cli.vuejs.org/guide/mode-and-env.html) variables for more information.

## Unit Tests

Unit tests are written in [Jest](https://jestjs.io/).

[Vue Test Utils](https://vue-test-utils.vuejs.org/) is included (scaffolded through Vue CLI) to facilitate unit test writing for the Vue components.

See [Run your unit tests](#run-your-unit-tests) below for details on executing tests

## Project scripts to run locally

All scripts are assuming terminal directory is `./frontend` and npm is installed.

First execute npm install to set up dependencies

``` sh
npm install
```

### Note on backend setup

Without the backend app API running correctly, the front end will not do much on a local system. This is because it must acquire dynamic configuration settings from it beforehand. See [backend instructions](../README.md) for details on running the api locally

If you are running the frontend in dev mode, it should not use the same port as the backend application. By default, the dev server will run on port 8081.

### Compiles and hot-reloads for development

Vue CLI provides a hot-reloadable server. Run the command bellow to start it up and any changes to the frontend source will automatically reload.

``` sh
npm run serve
```

### Compiles and minifies for production

If you need to build the deliverables you can run the following. This is normally done by the build pipeline.

``` sh
npm run build
```

### Run your unit tests

``` sh
npm run test
```

### Lints and fixes files

To check linting, run

``` sh
npm run lint
```

To autofix lint issues, run

``` sh
npm run lint:fix
```

Lint configuration can be seen in [./.eslintrc.js](./.eslintrc.js)

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
