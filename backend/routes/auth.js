const auth = require('express').Router();
const passport = require('passport');

auth.get('/', (_req, res) => {
  res.status(200).json({
    endpoints: [
      '/login',
      '/logout',
      '/token'
    ]
  });
});

auth.use('/callback',
  passport.authenticate('oidc', {
    failureRedirect: 'error'
  }),
  (_req, res) => {
    res.redirect('profile');
  }
);

auth.use('/error', (_req, res) => {
  res.status(401).json({
    status: 401,
    message: 'Error: Unable to authenticate'
  });
});

auth.get('/login', passport.authenticate('oidc', {
  failureRedirect: 'error'
}));


auth.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/getok');
});

auth.use('/profile', (req, res) => {
  res.status(200).json({
    user: req.session
  });
});

auth.use('/token', (req, res) => {
  if (req.user && req.user.jwt && req.user.refreshToken) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json({
      status: 401,
      message: 'Not logged in'
    });
  }
});

module.exports = auth;
