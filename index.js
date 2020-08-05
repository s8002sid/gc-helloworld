const {format} = require('util');
const express = require('express');
const Multer = require('multer');

const logger = require('./service/logging')('index');
const storage = require('./service/storage');


const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
      fileSize: 50 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

//use GOOGLE_APPLICATION_CREDENTIALS to set credential
//Delete all log from a given logname using "gcloud logging logs delete LOG_NAME"
const app = express();
app.get('/', (req, res) => {
  console.log('Hello world received a request.');

  const target = process.env.TARGET || 'Sid';
  res.send(`Hello ${target}!, how are you!!`);
  logger.error('route / called as I told you');
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

const port = process.env.PORT || 8080;
app.listen(port, () => {
  logger.info('Hello world listening on port', port);
});
logger.info('Server is ready...');