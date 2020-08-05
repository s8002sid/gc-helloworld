const bunyan = require('bunyan');
const {LoggingBunyan} = require('@google-cloud/logging-bunyan');
const loggingBunyan = new LoggingBunyan();
const g = require('../common/global')
// const logger = bunyan.createLogger({
//   // The JSON payload of the log as it appears in Stackdriver Logging
//   // will contain "name": "SIDDJAIN-VM"
//   name: 'SIDDJAIN-VM',
//   streams: [
//     // Log to the console at 'info' and above
//     {stream: process.stdout, level: 'info'},
//     // And log to Stackdriver Logging, logging at 'info' and above
//     loggingBunyan.stream('info'),
//   ],
// });

function logger(module) {
  return bunyan.createLogger({
    // The JSON payload of the log as it appears in Stackdriver Logging
    // will contain "name": "SIDDJAIN-VM"
    name: g.PROJECT_NAME+':'+module,
    streams: [
      // Log to the console at 'info' and above
      {stream: process.stdout, level: g.LOG_LEVEL},
      // And log to Stackdriver Logging, logging at 'info' and above
      loggingBunyan.stream('info'),
    ],
  });
}

module.exports = logger;