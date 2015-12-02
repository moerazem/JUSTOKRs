"use strict";
var common    = require('./common'),
    log       = common.log,
    apiCommon = require('./api_common'),
    dbAuth    = require('./db_auth'),
    dbVersionUpdate = require('./db_version_update'),
    async     = require('vasync'),
    S         = require('string'),
    moment    = require('moment');

// check that the token is valid - is used for authorising Ember and API calls
exports.verifyToken = function (token, cb) {
  dbAuth.getUserByToken(token, function (err, user) {
    if (err) { return cb(err); }
    // if not authenticated return error - could be due to two people logging into same account
    if (!user) { 
      return cb(new apiCommon.restify.InvalidCredentialsError('Invalid token'), null);
    }
    var tokenExp = moment(user.tokenExp).format('YYYY-MM-DD'),
        timeNow  = moment().format('YYYY-MM-DD');
    if (process.env.OKR_AUTH_METHOD === 'ADFS') { // if the token was issued by ADFS more than a day ago
      if (timeNow > tokenExp) { 
        log.info({user: user}, 'token has expired'); 
        return cb(new apiCommon.restify.InvalidCredentialsError('Expired token'), null);
      }
    }
    var scope = 'all';
    if (!user.organisation) {
      scope = 'readonly';
    }
    return cb(null, user, { scope: scope });
  });
};
