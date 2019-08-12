# Natural Resources Get Token

Natural Resources Get Token (GETOK) will automate the process for Development teams to get setup to use the common services published on [https://apistore.nrs.gov.bc.ca/store/](https://apistore.nrs.gov.bc.ca/store/).

## Backend

The backend is a node server which serves the GETOK API used by the frontend. It uses the following dependencies from NPM:

Password Management & Authentication

* `cryptico-js` - Asymmetric key encryption
* `generate-password` - Password generator
* `passportjs` - JWT and OIDC strategies

Networking

* `axios` - Standard network caller
* `express` - Server middleware
* `express-validator` - Call validation

Logging

* `morgan` - HTTP request logger
* `npmlog` - General log framework

## Quickstart Guide

In order for the application to run correctly, you will need to ensure that the following have been addressed:

1. All node dependencies have been installed and resolved
2. Environment configurations have been set up

### Install

As this is a Node application, please ensure that you have all dependencies installed as needed. This can be done by running `npm install`.

### Configuration

Configuration management is done using the [config](https://www.npmjs.com/package/config) library. There are two ways to configure:

1. Look at [custom-environment-variables.json](/backend/config/custom-environment-variables.json) and ensure you have the environment variables locally set.
2. Create a `local.json` file in the config folder. This file should never be added to source control.

For more details, please consult the config library [documentation](https://github.com/lorenwest/node-config/wiki/Configuration-Files).

#### Environment Variables

| Environment Variable | Description |
| --- | --- |
| `OIDC_DISCOVERY` | Well Known OpenID Connect Configuration url endpoint |
| `OIDC_USERNAME` | OpenID Connect Client name |
| `OIDC_PASSWORD` | OpenID Connect Client secret |
| `OIDC_PUBLICKEY` | OpenID Connect JWT public key |
| `SERVER_FRONTEND` | Frontend host and path for redirection |
| `SERVER_LOGLEVEL` | Server log verbosity. Options: `silly`, `verbose`, `debug`, `info`, `warn`, `error` |
| `SERVER_MORGANFORMAT` | Morgan format style. Options: `dev`, `combined` |
| `SERVER_PORT` | Port server is listening to |
| `SC_GETOKINT_ENDPOINT` | Base API endpoint for WebADE OAuth (INT env) |
| `SC_GETOKINT_USERNAME` | Service client username (INT env) |
| `SC_GETOKINT_PASSWORD` | Service client password (INT env) |
| `SC_GETOKTEST_ENDPOINT` | Base API endpoint for WebADE OAuth (TEST env) |
| `SC_GETOKTEST_USERNAME` | Service client username (TEST env) |
| `SC_GETOKTEST_PASSWORD` | Service client password (TEST env) |
| `SC_GETOKPROD_ENDPOINT` | Base API endpoint for WebADE OAuth (PROD env) |
| `SC_GETOKPROD_USERNAME` | Service client username (PROD env) |
| `SC_GETOKPROD_PASSWORD` | Service client password (PROD env) |
| `SC_MSSC_ENDPOINT` | Base API endpoint for CMSG API |
| `SC_MSSC_USERNAME` | Service client username |
| `SC_MSSC_PASSWORD` | Service client password |

#### local.json

Note: for publicKey, you must enter the PEM encoded value with newlines encoded inline. It must also have the begin public key and end public key header and footer to be considered valid.

```json
{
  "oidc": {
    "clientID": "clientID",
    "clientSecret": "00000000-0000-0000-0000-000000000000",
    "publicKey": "-----BEGIN PUBLIC KEY-----\n................................................................\n................................................................\n................................................................\n................................................................\n................................................................\n................................................................\n........\n-----END PUBLIC KEY-----"
  },
  "server": {
    "frontend": "http://localhost:8080",
    "logLevel": "debug",
    "port": "8081"
  },
  "serviceClient": {
    "getok": {
      "username": "username",
      "password": "password"
    },
    "mssc": {
      "username": "username",
      "password": "password"
    }
  }
}
```

## Commands

After adressing the prerequisites, the following are common commands that are used for this application.

### Run the server with hot-reloads for development

``` sh
npm run serve
```

### Run the server

``` sh
npm run start
```

### Run your tests

``` sh
npm run test
```

### Lints files

``` sh
npm run lint
```

## Database Migrations

In order to handle changes to our code-first database, we need to periodically write in Sequelize compatible database migration scripts. You will likely require the `QueryInterface` API of Sequelize in order to achieve a proper up and down migration which can be found on Sequelize documentation. You may also look at previously implemented migrations as a design guide.

* [QueryInterface API](https://sequelize.org/master/class/lib/query-interface.js~QueryInterface.html)

### Creating a Migration

When creating a new migration, it is suggested to run the following to generate a new migration script scaffold to work with:

`npx sequelize-cli migration:generate --name yourmigrationname`

This tool will generate a new file with a verbose timestamp and the specified name appended (i.e. `20190812183401-yourmigrationname.js`). Please preserve this naming convention as that Sequelize appears to determine migration order alphanumerically.

The following is a simple migration script example which renames an existing column. Note that the transformation is specified on both the fowards up direction as well as the reverse down direction.

`20190812183401-yourmigrationname.js`

```javascript
module.exports = {
  up: queryInterface => {
    return queryInterface.renameColumn('lifecycle_history', 'previousEnv', 'env');
  },

  down: queryInterface => {
    return queryInterface.renameColumn('lifecycle_history', 'env', 'previousEnv');
  }
};
```

When creating a migration, you MUST ensure that the migrations can work on a properly functioning database before even considering making a PR as that any migration that doesn't work correctly can risk damaging the production database contents.
