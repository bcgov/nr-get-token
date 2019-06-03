const atob = require('atob');
const axios = require('axios');
const config = require('config');
const log = require('npmlog');
const qs = require('querystring');

const utils = require('./utils');

const auth = {
  // Check if JWT Access Token has expired
  isTokenExpired(token) {
    const now = Date.now().valueOf() / 1000;
    const jwtPayload = token.split('.')[1];
    const payload = JSON.parse(atob(jwtPayload));

    return (!!payload.exp && payload.exp < now);
  },

  // Check if JWT Refresh Token has expired
  isRenewable(token) {
    const now = Date.now().valueOf() / 1000;
    const jwtPayload = token.split('.')[1];
    const payload = JSON.parse(atob(jwtPayload));

    // Check if expiration exists, or lacks expiration
    return (typeof (payload.exp) !== 'undefined' && payload.exp !== null &&
      payload.exp == 0 || payload.exp > now);
  },

  // Get new JWT and Refresh tokens
  async renew(jwt, token) {
    const result = {
      jwtToken: null,
      refreshToken: null
    };

    try {
      const discovery = await utils.getOidcDiscovery();
      const response = await axios.post(discovery.token_endpoint,
        qs.stringify({
          client_id: config.get('oidc.clientID'),
          client_secret: config.get('oidc.clientSecret'),
          grant_type: 'refresh_token',
          refresh_token: token,
          scope: discovery.scopes_supported
        }), {
          headers: {
            Accept: 'application/json',
            Authentication: `Bearer ${jwt}`,
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
      );

      log.verbose(arguments.callee.name, utils.prettyStringify(response.data));
      result.jwtToken = response.data.access_token;
      result.refreshToken = response.data.refresh_token;
    } catch (error) {
      log.error(arguments.callee.name, error.message);
    }

    return result;
  },

  async removeExpired(req, _res, next) {
    try {
      if (!!req.user && !!req.user.jwt) {
        log.verbose(arguments.callee.name, 'User & JWT exists');

        if (auth.isTokenExpired(req.user.jwt)) {
          log.verbose(arguments.callee.name, 'JWT has expired');

          if (!!req.user.refreshToken && auth.isRenewable(req.user.refreshToken)) {
            log.verbose(arguments.callee.name, 'Can refresh JWT token');

            // Get new JWT and Refresh Tokens and update the request
            const { jwtToken, refreshToken } = await auth.renew(req.user.jwt, req.user.refreshToken);
            req.user.jwt = jwtToken;
            req.user.refreshToken = refreshToken;
          } else {
            log.verbose(arguments.callee.name, 'Cannot refresh JWT token - cleaning up user');
            delete req.user;
          }
        }
      } else {
        log.verbose(arguments.callee.name, 'No existing User or JWT - cleaning up user');
        delete req.user;
      }
    } catch (error) {
      log.error(arguments.callee.name, error.message);
    }

    next();
    return;
  }
};

module.exports = auth;
