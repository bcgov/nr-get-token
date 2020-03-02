# Vue Skeleton Frontend

This is the Vue Skeleton frontend. It implements a Vue frontend with Keycloak authentication support.

## Configuration

The Vue Skeleton frontend will require some configuration. The API it invokes will be locked down and require a valid JWT Token to access. We will need to configure the application to authenticate using the same Keycloak realm as the [app](../). Note that the Vue Skeleton frontend is currently designed to expect all associated resources to be relative to the original access path.

## Super Quickstart

In [src/main.js](src/main.js), replace `YOURCLIENTHERE`, `YOURREALMHERE` and `YOURAUTHURLHERE` with the appropriate frontend values.

### Project setup

``` sh
npm install
```

### Compiles and hot-reloads for development

``` sh
npm run serve
```

### Compiles and minifies for production

``` sh
npm run build
```

### Run your unit tests

``` sh
npm run test:unit
```

### Lints and fixes files

``` sh
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
