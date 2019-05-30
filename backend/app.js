const axios = require('axios');
const config = require('config');
const express = require('express');
const session = require('express-session');
const log = require('npmlog');
const morgan = require('morgan');
const passport = require('passport');

const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const OidcStrategy = require('passport-openidconnect').Strategy;

const utils = require('./components/utils');
const authRouter = require('./routes/auth');
const v1Router = require('./routes/v1');

const apiRouter = express.Router();

const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

app.use(morgan(config.get('server.morganFormat')));

app.use(session({
  secret: config.get('oidc.clientSecret'),
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Logging Setup
log.level = config.get('server.logLevel');
log.addLevel('debug', 1500, {
  fg: 'green'
});

// Print out configuration settings in verbose startup
log.verbose('Config', utils.prettyStringify(config));

// Resolves OIDC Discovery values and returns an OIDC Strategy Config
async function getOidcDiscovery() {
  try {
    const response = await axios.get(config.get('oidc.discovery'));

    log.verbose(arguments.callee.name, utils.prettyStringify(response.data));
    return {
      issuer: response.data.issuer,
      authorizationURL: response.data.authorization_endpoint,
      tokenURL: response.data.token_endpoint,
      userInfoURL: response.data.userinfo_endpoint,
      clientID: config.get('oidc.clientID'),
      clientSecret: config.get('oidc.clientSecret'),
      callbackURL: '/getok/api/auth/callback',
      scope: response.data.scopes_supported
    };
  } catch (error) {
    log.error(arguments.callee.name, `OIDC Discovery failed - ${error.message}`);
    process.exit(1);
  }
}

getOidcDiscovery().then(oidcConfig => {
  // Add Passport OIDC Strategy
  passport.use('oidc', new OidcStrategy(oidcConfig, (_issuer, _sub, profile, accessToken, refreshToken, done) => {
    if ((typeof (accessToken) === 'undefined') || (accessToken === null) ||
      (typeof (refreshToken) === 'undefined') || (refreshToken === null)) {
      return done('No access token', null);
    }

    profile.jwt = accessToken;
    profile.refreshToken = refreshToken;
    return done(null, profile);
  }));

  // Add Passport JWT Strategy
  passport.use('jwt', new JWTStrategy({
    audience: config.get('oidc.clientID'),
    issuer: oidcConfig.issuer,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.get('oidc.clientSecret')
  }, (jwtPayload, done) => {
    if ((typeof (jwtPayload) === 'undefined') || (jwtPayload === null)) {
      return done('No JWT token', null);
    }

    done(null, {
      email: jwtPayload.email,
      familyName: jwtPayload.familyName,
      givenName: jwtPayload.givenName,
      jwt: jwtPayload,
      name: jwtPayload.name,
      preferredUsername: jwtPayload.preferredUsername,
    });
  }));
});

passport.serializeUser((user, next) => next(null, user));
passport.deserializeUser((obj, next) => next(null, obj));

// GetOK Base API Directory
apiRouter.get('/', (_req, res) => {
  res.status(200).json({
    endpoints: [
      '/api/auth',
      '/api/v1'
    ],
    versions: [
      1
    ]
  });
});

// Root level Router
app.use(/(\/getok)?(\/api)?/, apiRouter);

// Auth Router
apiRouter.use('/auth', authRouter);

// v1 Router
apiRouter.use('/v1', v1Router);

// Handle 500
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  log.error(err.stack);
  res.status(500).json({
    status: 500,
    message: 'Internal Server Error: ' + err.stack.split('\n', 1)[0]
  });
});

// Handle 404
app.use((_req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Page Not Found'
  });
});

// Prevent unhandled errors from crashing application
process.on('unhandledRejection', err => {
  log.error(err.stack);
});

module.exports = app;
