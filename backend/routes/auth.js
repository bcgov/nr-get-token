const auth = require('express').Router();
const passport = require('passport');

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

auth.use('/login', passport.authenticate('oidc', {
  failureRedirect: 'error'
}));


auth.use('/logout', (req, res) => {
  req.logout();
  res.redirect('/getok');
});

auth.use('/profile', (req, res) => {
  res.status(200).json({
    user: req.session
  });
});

module.exports = auth;
