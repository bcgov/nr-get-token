# Natural Resources Get Token

This tool will automate the process for getting setup to use common services published on [https://apistore.nrs.gov.bc.ca/store/](https://apistore.nrs.gov.bc.ca/store/).

## Frontend
The frontend of the application is built on the [Vue.js](https://vuejs.org/) framework as a static UI layer. The web application calls to the GETOK backend API (see [backend](../backend)) for authentication and application funtionality.

The frontend of the application allows users to fill in the appropriate info required to create a WebADE service client and submit it to WebADE, then test token aquisition. The backend API handles communication with the WebADE REST API to create the application configuration. The backend API also creates the password required for the service client and securely returns it to the UI (see [Password Generation](TBD) for these details)

### Vue Archetecture

#### Vue CLI
The frontend application is scaffolded with Vue CLI to set up the project structure and Webpack configuration. See the [Vue CLI docs](https://cli.vuejs.org/) for more information.
If additional Vue structural components are to be added they should be added with the **vue add** command (see CLI docs) rather than manually

#### Vuetify
The material design framework Vuetify is used for design and layout. All additional UI elements added should use Veutfify components and material design language. See the [Vuetify docs](https://vuetifyjs.com/en/getting-started/quick-start) for more information.

#### Vuex
The Vuex state management system is an integral part of the frontend application. It maintains a centralized store for all the components in the app. The location of the store in the project structure is `/frontend/src/store`. See the [Vuex docs](https://vuex.vuejs.org/) for more information

#### Vue Router
Vue Router is used for the Single Page App routing. See the [Vue Router docs](https://router.vuejs.org/) for more information.

### Other Dependencies
Other imported libraries used in the application include:

* [axios](https://github.com/axios/axios) for REST calls
* [cryptico-js](https://github.com/wwwtyro/cryptico) for password decryption


See `/frontend/package.json` for more

## Environment Configuration
At the root of the `/frontend` directory are environment files that create environment variables that are accessible to the app at build time.

For local development, create a `.env.development.local` file at this location (it will be ignored by Git) to provide local environment variables. This will be invoked when *npm run serve* is used

See the Vue CLI docs on [Modes and Environment](https://cli.vuejs.org/guide/mode-and-env.html) variables for more information.

## Unit Tests
Unit tests are written in [Jest](https://jestjs.io/).

[Vue Test Utils](https://vue-test-utils.vuejs.org/) is included (scaffolded through Vue CLI) to facilitate unit test writing for the Vue components.

See 'Run your tests' below for details on executing tests

## Project scripts to run locally
All scripts are assuming terminal directory is `/frontend` and npm is installed.

First execute npm install to set up dependencies

``` sh
npm install
```

### Note on backend setup
Without the backend API running, the front end will not do much on a local system. So you should be running the backend API before starting the Vue app. See [backend instructions](../backend/README.md) for details on running the api locally

The frontend and backend should not be running on the same port. To tell the front end where the backend is running, use the `VUE_APP_API_ROOT` variable in your .env.development.local file.

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

### Run your tests

``` sh
npm run test:unit
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
Lint configuration can be seen in the `eslintConfig` node of `package.json`

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
