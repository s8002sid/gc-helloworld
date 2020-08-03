const express = require('express');
const app = express();
const logger = require('./service/logging')


app.get('/', (req, res) => {
  console.log('Hello world received a request.');

  const target = process.env.TARGET || 'Sid';
  res.send(`Hello ${target}!, how are you!!`);
  logger.error('route / called as I told you');
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  logger.info('Hello world listening on port', port);
});
logger.info('Server is ready...');