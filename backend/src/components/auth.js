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
  async renew(refreshToken) {
    let result = {};

    try {
      const discovery = await utils.getOidcDiscovery();
      const response = await axios.post(discovery.token_endpoint,
        qs.stringify({
          client_id: config.get('oidc.clientID'),
          client_secret: config.get('oidc.clientSecret'),
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          scope: discovery.scopes_supported
        }), {
          headers: {
            Accept: 'application/json',
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
      );

      log.verbose('renew', utils.prettyStringify(response.data));
      result.jwt = response.data.access_token;
      result.refreshToken = response.data.refresh_token;
    } catch (error) {
      log.error('renew', error.message);
      result = error.response.data;
    }

    return result;
  },

  // Update or remove token based on JWT and user state
  async removeExpired(req, _res, next) {
    try {
      if (!!req.user && !!req.user.jwt) {
        log.verbose('removeExpired', 'User & JWT exists');

        if (auth.isTokenExpired(req.user.jwt)) {
          log.verbose('removeExpired', 'JWT has expired');

          if (!!req.user.refreshToken && auth.isRenewable(req.user.refreshToken)) {
            log.verbose('removeExpired', 'Can refresh JWT token');

            // Get new JWT and Refresh Tokens and update the request
            const {
              jwt,
              refreshToken
            } = await auth.renew(req.user.refreshToken);
            req.user.jwt = jwt; // eslint-disable-line require-atomic-updates
            req.user.refreshToken = refreshToken; // eslint-disable-line require-atomic-updates
          } else {
            log.verbose('removeExpired', 'Cannot refresh JWT token');
            delete req.user;
          }
        }
      } else {
        log.verbose('removeExpired', 'No existing User or JWT');
        delete req.user;
      }
    } catch (error) {
      log.error('removeExpired', error.message);
    }

    next();
    return;
  }
};

module.exports = auth;
