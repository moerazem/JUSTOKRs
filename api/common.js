'use strict';
const bunyan = require('bunyan');
// get environment variables
let home                    = process.env.OKR_HOME;
let emberIP                 = process.env.OKR_EMBER.split();
exports.emberIP             = emberIP;

// constants that will need to be changed infrequently
exports.latestVersion       = 17; // id from versionUpdate table
exports.currentQuarter      = 7; // Q4 2015

// same for all environments
exports.httpsKey            = home + '/src/okr/je-labs.com-privatekey.cer';
exports.httpsCert           = home + '/src/okr/je-labs.com.cer';
exports.log = bunyan.createLogger({
  name: 'okr',
  // src:  false, // NB. needs to be disabled in production
  src:  true, // NB. shows line numbers and source files in development
  streams: 
  [ 
    { // these logs are kept for history
      level: 'info',
      type: 'rotating-file',
      path: home + '/src/okr/log/okr.log',
      period: '1d',   // daily rotation
      count: 365      // keep a years back copies
    },
    { // this one can be cleared down for test runs
      level: 'debug',
      type: 'file',
      path: home + '/src/okr/log/scratch.log'
    },
    {
      level: 'error',
      stream: process.stdout
    }
  ] 
});
