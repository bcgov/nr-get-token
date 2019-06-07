# Natural Resources Get Token

Natural Resources Get Token (GETOK) will automate the process for Development teams to get setup to use the common services published on [https://apistore.nrs.gov.bc.ca/store/](https://apistore.nrs.gov.bc.ca/store/).

## Backend

The backend is a node server which serves the GETOK API used by the frontend.

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
| `SC_GETOK_ENDPOINT` | Base API endpoint for WebADE OAuth |
| `SC_GETOK_USERNAME` | Service client username |
| `SC_GETOK_PASSWORD` | Service clienet password |
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
