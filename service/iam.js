const express = require('express');
const router = express.Router();
const logger = require('./logging')('iam');
const passport = require('passport');
router.use(require('cookie-parser')());
router.use(require('body-parser').urlencoded({ extended: true }));
router.use(require('express-session')({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
router.use(passport.initialize());
router.use(passport.session());
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    state: true
  },
  function(accessToken, refreshToken, profile, done) {
       logger.info(`<<< Profile ID: ${profile.id} logged in >>>`);
       let name='', email='', photo='';
       name = profile.displayName;
       if (profile.emails && profile.emails.length >= 1) {
           email = profile.emails[0].value; 
       }
       if (profile.photos && profile.photos.length >= 1) {
           photo = profile.photos[0].value;
       }
       let user = {
           id: profile.id,
           name: name,
           email: email,
           photo: photo
        };
       return done(null, user);
  }
));

router.get('/login',
  passport.authenticate('google', { 
    scope: ['https://www.googleapis.com/auth/plus.login',
            'https://www.googleapis.com/auth/userinfo.email'
          ]
  }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect(req.session.returnTo||'/');
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

//require('connect-ensure-login').ensureLoggedIn(),
router.get('/auth/check',
    function (req, res) {
        if (req.user)
            res.status(200).send({status: "authenticated"})
        else
            res.status(401).send({status: "unauthenticated"})
});
module.exports = router;