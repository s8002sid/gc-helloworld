const express = require('express');
const app = express();
const logger = require('./service/logging')


app.get('/', (req, res) => {
  console.log('Hello world received a request.');

  const target = process.env.TARGET || 'Sid';
  res.send(`Hello ${target}!`);
  logger.info('route / called');
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  logger.info('Hello world listening on port', port);
});
logger.info('Server is ready...');