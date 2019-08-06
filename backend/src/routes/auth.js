const atob = require('atob');
const config = require('config');
const passport = require('passport');
const router = require('express').Router();
const {
  body,
  validationResult
} = require('express-validator');

const auth = require('../components/auth');
const {
  acronyms,
  users
} = require('../controllers');

router.get('/', (_req, res) => {
  res.status(200).json({
    endpoints: [
      '/callback',
      '/login',
      '/logout',
      '/refresh',
      '/token'
    ]
  });
});

router.get('/callback',
  passport.authenticate('oidc', {
    failureRedirect: 'error'
  }),
  (_req, res) => {
    res.redirect(config.get('server.frontend'));
  }
);

router.get('/error', (_req, res) => {
  res.status(401).json({
    message: 'Error: Unable to authenticate'
  });
});

router.get('/login', passport.authenticate('oidc', {
  failureRedirect: '../error'
}));


router.get('/logout', (req, res) => {
  req.logout();
  res.redirect(config.get('server.frontend'));
});

router.post('/refresh', [
  body('refreshToken').exists()
], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  const refresh = await auth.renew(req.body.refreshToken);
  return res.status(200).json(refresh);
});

router.use('/token', auth.removeExpired, async (req, res) => {
  if (req.user && req.user.jwt && req.user.refreshToken) {
    // Add user if they don't already exist
    const user = req.user;
    users.findOrCreate(user.id, user.displayName, user._json.preferred_username);

    // Add keycloak authorized acronyms if they don't already exist
    const jwtPayload = req.user.jwt.split('.')[1];
    const payload = JSON.parse(atob(jwtPayload));
    const roles = payload.realm_access.roles;

    let acronymList = [];
    if (typeof roles === 'object' && roles instanceof Array) {
      acronymList = roles.filter(role => !role.match(/offline_access|uma_authorization/));
    }
    acronyms.findOrCreateList(acronymList);

    res.status(200).json(user);
  } else {
    res.status(401).json({
      message: 'Not logged in'
    });
  }
});

module.exports = router;
