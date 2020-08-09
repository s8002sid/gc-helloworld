const {format} = require('util');
const express = require('express');
const Multer = require('multer');

const logger = require('./service/logging')('index');
const storage = require('./service/storage');
const db = require('./service/db');
const email = require('./service/email');
const app = express();
const iamRouter = require('./service/iam');
app.use('/', iamRouter);
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
      fileSize: 50 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

//use GOOGLE_APPLICATION_CREDENTIALS to set credential
//Delete all log from a given logname using "gcloud logging logs delete LOG_NAME"
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

app.get('/ping',
  function(req, res) {
    res.send({status: 'up'});
});

app.get('/unauthorized', function(req, res) {
    res.status(401).send({status: "unauthorized"});
})

app.get('/error', function (req, res) {
  res.status(404).send({status: "error"});
});

app.use(function (req, res, next) {
  res.redirect('/error');
})
const port = process.env.PORT || 8080;
app.listen(port, () => {
  logger.info('Hello world listening on port', port);
});
logger.info('Server is ready...');