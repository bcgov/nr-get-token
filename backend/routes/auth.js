const config = require('config');
const passport = require('passport');
const router = require('express').Router();

const auth = require('../components/auth');

router.get('/', (_req, res) => {
  res.status(200).json({
    endpoints: [
      '/login',
      '/logout',
      '/token'
    ]
  });
});

router.use('/callback',
  passport.authenticate('oidc', {
    failureRedirect: 'error'
  }),
  (_req, res) => {
    res.redirect(config.get('server.frontend'));
  }
);

router.use('/error', (_req, res) => {
  res.status(401).json({
    status: 401,
    message: 'Error: Unable to authenticate'
  });
});

router.get('/login', passport.authenticate('oidc', {
  failureRedirect: 'error'
}));


router.get('/logout', (req, res) => {
  req.logout();
  res.redirect(config.get('server.frontend'));
});

router.use('/token', auth.removeExpired, (req, res) => {
  if (req.user && req.user.jwt && req.user.refreshToken) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json({
      status: 401,
      message: 'Not logged in'
    });
  }
});

module.exports = router;
