const axios = require('axios');
const config = require('config');
const jsonwebtoken = require('jsonwebtoken');
const log = require('npmlog');
const qs = require('querystring');

const { userService } = require('../services');
const utils = require('./utils');

const auth = {
  /**
   *  @function getUserAcronyms
   *  @param {object} req An Express request object
   *  @param {object} _res An Express response object
   *  @param {function} next A callback function
   */
  async getUserAcronyms(req, _res, next) {
    if (req.user && !auth.isTokenExpired(req.user.jwt)) {
      const acronyms = await userService.getUserAcronymList(req.user.id);
      req.user.acronyms = Array.isArray(acronyms) ? acronyms : [];
    }

    next();
  },

  // Check if JWT Access Token has expired
  isTokenExpired(token) {
    const now = Date.now().valueOf() / 1000;
    const payload = jsonwebtoken.decode(token);

    return (payload && payload.exp && payload.exp < now);
  },

  // Check if JWT Refresh Token has expired
  isRenewable(token) {
    const now = Date.now().valueOf() / 1000;
    const payload = jsonwebtoken.decode(token);

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

      log.verbose('renew', JSON.stringify(response.data));
      result.jwt = response.data.access_token;
      result.refreshToken = response.data.refresh_token;
    } catch (error) {
      log.error('renew', error.message);
      result = error.response.data;
    }

    return result;
  },

  // Update or remove token based on JWT and user state
  async refreshJWT(req, _res, next) {
    try {
      if (!!req.user && !!req.user.jwt) {
        log.verbose('refreshJWT', 'User & JWT exists');

        if (auth.isTokenExpired(req.user.jwt)) {
          log.verbose('refreshJWT', 'JWT has expired');

          if (!!req.user.refreshToken && auth.isRenewable(req.user.refreshToken)) {
            log.verbose('refreshJWT', 'Can refresh JWT token');

            // Get new JWT and Refresh Tokens and update the request
            const result = await auth.renew(req.user.refreshToken);
            req.user.jwt = result.jwt; // eslint-disable-line require-atomic-updates
            req.user.refreshToken = result.refreshToken; // eslint-disable-line require-atomic-updates
          } else {
            log.verbose('refreshJWT', 'Cannot refresh JWT token');
            delete req.user;
          }
        }
      } else {
        log.verbose('refreshJWT', 'No existing User or JWT');
        delete req.user;
      }
    } catch (error) {
      log.error('refreshJWT', error.message);
    }

    next();
  },

  // Populate and update database based on incoming JWT token
  async updateDBFromToken(req, _res, next) {
    if (req.user && req.user.jwt) {
      // Add user if they don't already exist
      await userService.findOrCreate(req.user.id, req.user.displayName, req.user._json.preferred_username);
    }

    next();
  }
};

module.exports = auth;
