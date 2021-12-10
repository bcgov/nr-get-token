# Common Service Get Token

To learn more about the **Common Services** available visit the [Common Services Showcase](https://bcgov.github.io/common-service-showcase/) page.

GETOK is a web-based tool for development teams to manage their application's secure access to Common Services. Users can create and deploy Keycloak  service clients instantly to gain access to common service APIs like email notifications, document management, or document generation.

## Application

This application is a node server which serves two roles. Anything under the HTTP `/app` path (or whatever is configured) will contain resources needed for the frontend to render on the browser, while anything under HTTP `/api` responds to keycloak authenticated requests. It uses the following dependencies from NPM:

Authentication & Password Management

* `cryptico-js` - Asymmetric key encryption
* `generate-password` - Password generator
* `jsonwebtoken` - JWT parsing library
* `keycloak-connect` - Keycloak authentication middleware

Database Management

* `pg` - Postgres library
* `sequelize` - Promise-based ORM
* `sequelize-cli` - DB Migration manager

Networking

* `api-problem` - RFC 7807 response handler
* `axios` - Standard network caller
* `express` - Server middleware
* `express-validator` - Call validation
* `js-yaml` - YAML parser and serializer

Logging

* `morgan` - HTTP request logger
* `npmlog` - General log framework

### General Code Layout

The codebase is separated into a few discrete layers:

* `components` - Business logic layer - the majority of useful functionality resides here
* `docs` - Contains OpenAPI 3.0 Yaml specification and ReDoc renderer
* `migrations` - Database migration scripts
* `models` - Database ORM models
* `routes` - Express middleware routing
* `services` - Database Access Object layer

## Quickstart Guide

In order for the application to run correctly, you will need to ensure that the following have been addressed:

1. All node dependencies have been installed and resolved
2. Environment configurations have been set up
3. A Postgres database instance that is reachable
4. The database has been initialized with the correct migrations
5. (Optional) The database has been seeded with dev data

### Install

As this is a Node application, please ensure that you have all dependencies installed as needed. This can be done by running `npm install`.

### Configuration

Configuration management is done using the [config](https://www.npmjs.com/package/config) library. There are two ways to configure:

1. Look at [custom-environment-variables.json](/backend/config/custom-environment-variables.json) and ensure you have the environment variables locally set.
2. Create a `local.json` file in the config folder. This file should never be added to source control.
3. Consider creating a `local-test.json` file in the config folder if you want to use different configurations while running unit tests.

For more details, please consult the config library [documentation](https://github.com/lorenwest/node-config/wiki/Configuration-Files).

#### Environment Variables

| Environment Variable | Description |
| --- | --- |
| `DB_DATABASE` | Name of the database |
| `DB_HOST` | Location the database is hosted at |
| `DB_USERNAME` | Database username |
| `DB_PASSWORD` | Database password |
| `FRONTEND_APIPATH` | Relative API path |
| `FRONTEND_BASEPATH` | Base subpath for all access |
| `FRONTEND_KC_CLIENTID` | Keycloak Client Name |
| `FRONTEND_KC_REALM` | Keycloak Client Realm |
| `FRONTEND_KC_SERVERURL` | Keycloak Authentication URL |
| `SERVER_APIPATH` | Relative API path |
| `SERVER_BASEPATH` | Base subpath for all access |
| `SERVER_BODYLIMIT` | Maximum acceptable request body length |
| `SERVER_KC_CLIENTID` | Keycloak Client Name |
| `SERVER_KC_CLIENTSECRET` | Keycloak Client Secret |
| `SERVER_KC_REALM` | Keycloak Client Realm |
| `SERVER_KC_SERVERURL` | Keycloak Authentication URL |
| `SERVER_LOGLEVEL` | Server log verbosity. Options: `silly`, `verbose`, `debug`, `info`, `warn`, `error` |
| `SERVER_MORGANFORMAT` | Morgan format style. Options: `dev`, `combined` |
| `SERVER_PORT` | Port server is listening to |

The following variables are not re-implemented yet

| Environment Variable | Description |
| `CHES_TOKEN_ENDPOINT` | Keycloak token endpoint (YAMS Realm) for common service token fetching |
| `CHES_EMAIL_ENDPOINT` | CHES endpoint for sending email |
| `CHES_HEALTH_ENDPOINT` | CHES health check endpoint |
| `CHES_SC_USERNAME` | YAMS service client username |
| `CHES_SC_PASSWORD` | YAMS service client password |

### Database Setup

The backend requires a valid Postgres database to connect to in order to function. Please ensure you have either installed a Postgres server on your local development machine OR have an equivalent Postgres database available to connect to BEFORE attempting to start up the application.

#### Database Initialization

You will need to ensure that your Postgres database has an empty database initialized that the backend can utilize. We suggest naming the database `getok` to minimize naming impact on other potentially existing databases. There are many ways of ensuring that a viable user can access the postgres server depending on which type of operating system being used. Below is an example of what needs to be executed in SQL to achieve the equivalent of making a new user and database.

``` sql
CREATE USER username WITH ENCRYPTED PASSWORD 'password';
CREATE DATABASE getok;
GRANT ALL PRIVILEGES ON DATABASE getok TO username;
```

#### Initial Migration

Assuming you have a database ready to go, you will still require the database schema to be populated. This can be achieved by executing the following in the root backend directory:

``` sh
npm run migrate
```

#### Initial Seeding

If you need the database pre-populated with some data, you can run the following:

``` sh
npm run seed:dev
```

If you have to remove the seed data, or need to reapply it, you will want to undo the seed with:

``` sh
npm run seed:dev:undo
```

Once the migration and optional seeding steps are done, you should be able to start up the backend application.

## Commands

After addressing the prerequisites, the following are common commands that are used for this application. In the event you want to do the same action for both this app and the frontend, you can prepend an `all:` to the command (where it makes sense).

### Build production frontend static assets

``` sh
npm run build
```

### Run the server with hot-reloads for development

``` sh
npm run serve
```

### Run the server

``` sh
npm run start
```

### Migrate DB to latest schema

``` sh
npm run migrate
```

### Run your tests

``` sh
npm run test
```

### Lints files

``` sh
npm run lint
npm run lint-fix
```

## Database Migrations

In order to handle changes to our code-first database, we need to periodically write in Sequelize compatible database migration scripts. You will likely require the `QueryInterface` API of Sequelize in order to achieve a proper up and down migration which can be found on Sequelize documentation. You may also look at previously implemented migrations as a design guide.

* [QueryInterface API](https://sequelize.org/master/class/lib/query-interface.js~QueryInterface.html)

### Creating a Migration

When creating a new migration, it is suggested to run the following to generate a new migration script scaffold to work with:

`npx sequelize-cli migration:generate --name yourmigrationname`

This tool will generate a new file with a verbose timestamp and the specified name appended (i.e. `20190812183401-yourmigrationname.js`). Please preserve this naming convention as that Sequelize appears to determine migration order alphanumerically.

The following is a simple migration script example which renames an existing column. Note that the transformation is specified on both the forwards up direction as well as the reverse down direction.

`20190812183401-yourmigrationname.js`

``` javascript
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

### Applying Migrations

Once you have a migration written, you may apply the migration by running

``` sh
npm run migrate
```

while the backend is not running. In the event a migration must be undone, you can revert to the last migration by running

``` sh
npx sequelize-cli db:migrate:undo
```

Should the database need to be nuked and rebuilt from scratch, you can do so by undoing all migrations and reapplying them as follows:

``` sh
npx sequelize-cli db:migrate:undo:all
npm run migrate
```

For more details on how to leverage Sequelize CLI, refer to the [Sequelize Documentation](https://sequelize.org/master/manual/migrations.html).
