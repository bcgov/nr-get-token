# Vue Skeleton Application

This node.js skeleton app hosts the Vue Skeleton frontend. It implements a minimal endpoint to allow for Keycloak authentication.

## Configuration

The Vue Skeleton App will require some configuration. The API will be locked down and require a valid JWT Token to access. We will need to configure the application to authenticate using the same Keycloak realm as the [frontend](frontend). Note that the Vue Skeleton Frontend is currently designed to expect all associated resources to be relative to the original access path.

## Super Quickstart

In [src/components/keycloak.js](src/components/keycloak.js), replace `YOURCLIENTHERE`, `YOURREALMHERE` and `YOURAUTHURLHERE` with the appropriate application values.

``` sh
npm run all:fresh-start
```

### Run tests

``` sh
npm run all:test
```

### Lints and fixes files

``` sh
npm run all:lint
npm run all:lint-fix
```
