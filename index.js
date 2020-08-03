const express = require('express');
const app = express();
const bunyan = require('bunyan');
const {LoggingBunyan} = require('@google-cloud/logging-bunyan');
const loggingBunyan = new LoggingBunyan();
const logger = bunyan.createLogger({
  // The JSON payload of the log as it appears in Stackdriver Logging
  // will contain "name": "my-service"
  name: 'my-service',
  streams: [
    // Log to the console at 'info' and above
    {stream: process.stdout, level: 'info'},
    // And log to Stackdriver Logging, logging at 'info' and above
    loggingBunyan.stream('info'),
  ],
});


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