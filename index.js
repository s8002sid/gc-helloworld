const {format} = require('util');
const express = require('express');
const Multer = require('multer');

const logger = require('./service/logging')('index');
const storage = require('./service/storage');
const db = require('./service/db');
const email = require('./service/email');
const iam = require('./service/iam')
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
      fileSize: 50 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

//use GOOGLE_APPLICATION_CREDENTIALS to set credential
//Delete all log from a given logname using "gcloud logging logs delete LOG_NAME"
const app = express();
app.use(express.static('static'))
app.get('/', (req, res) => {
  console.log('Hello world received a request.');

  const target = process.env.TARGET || 'Sid';
  res.send(`Hello ${target}!, how are you!!`);
  logger.info('route / called as I told you');
});

app.post('/job/submit', multer.single('file'), (req, res, next) => {
  if (!req.file) {
    res.status(400).send('No file uploaded.');
    return;
  }
  // Create a new blob in the bucket and upload the file data.
  storage.saveFile(req.file)
  .then((url) => res.status(200).send({status: "success", url: url}))
  //.then((url) => {res.redirect(url)})
  .catch((e) => {res.status(404).send({status: "error"});})
});

/******************************************/
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: '462043570647-jhv9unafh5kst6odo7ktd56j642n31kf.apps.googleusercontent.com',
    clientSecret: 'sr67FJd41of4pgxcr6bEsceh',
    callbackURL: "https://gc-helloworld-v4vl4rp6dq-uc.a.run.app/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
       User.findOrCreate({ googleId: profile.id }, function (err, user) {
         return done(err, user);
       });
  }
));

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
/******************************************/
const port = process.env.PORT || 8080;
app.listen(port, () => {
  logger.info('Hello world listening on port', port);
});
logger.info('Server is ready...');