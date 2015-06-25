"use strict";
// this module is no longer used since ADFS is now being used
var common    = require('./common'),
    log       = common.log,
    apiCommon = require('./api_common'),
    dbAuth    = require('./db_auth'),
    dbVersionUpdate  = require('./db_version_update'),
    async     = require('vasync'),
    moment    = require('moment'),
    crypto    = require('crypto');

function generateToken(data) {
  var random = Math.floor(Math.random() * 100001);
  var timestamp = (new Date()).getTime();
  var sha256 = crypto.createHmac("sha256", random + "KRO" + timestamp);

  return sha256.update(data).digest("base64");
}

exports.login = function(req, res, next) {
  this.log = log.child({ action: 'login', account: req.params.username }); 
  this.log.info('log in attempt');
  var self = this;
  let username = req.params.username, 
      password = req.params.password;
  let fields  = [ username,
                  password ];
  async.waterfall([
    function authenticate(cb) { 
      dbAuth.validateUser(fields, function (err, user) {
        if (err) {
          return cb(err, null);
        }
        if (!user || user.length === 0) { 
          res.send(401, null);
          return cb(401, null);
        }
        return cb(null, user[0]);
      });
    },
    function checkVersionUpdate(user, cb) {
      if (user.lastVersionUpdate < common.latestVersion) { // get missed version updates for the user
        fields = [user.lastVersionUpdate];
        var versionUpdates = '';
        dbVersionUpdate.getVersionUpdates(fields, function (err, updates) {
          if (err) {
            return cb(err, null);
          }
          for (var i in updates) {
            versionUpdates = versionUpdates + '<h3>' + 
                             updates[i].name + ' : ' + 
                             moment(updates[i].releaseDate).format('DD/MM/YYYY') + '</h3>' ;
            if (updates[i].id === common.latestVersion) {
              versionUpdates = versionUpdates + updates[i].description;
            } else {
              versionUpdates = versionUpdates + 'See detail in Help section';
            }
          }
          user.versionUpdate = versionUpdates;
          return cb(null, user); 
        });
      } else {
        return cb(null, user); 
      }
    },
    function genToken(user, cb) {
      let token = generateToken(username + ":" + password);
      if (user.versionUpdate) { // if there are new version updates we're showing them to the user so increment the user to the latest version
        fields  = [{ 'token'             : token,
                     'lastVersionUpdate' : common.latestVersion },
                   username];
      } else {
        fields  = [{ 'token' : token },
                   username];
      }
      dbAuth.updateUser(fields, function (err) {
        if (err) {
          return cb(err, null);
        }
      });
      user.token = token;
      return cb(null, user);
    },
  ],
  function(err, result) {
    if (err) {
      self.log.error(err);
      return next(err);
    }
    let retval = { "access_token"    : result.token, 
                   "token_type"      : 'bearer',
                   "current_quarter" : common.currentQuarter,
                   "user"            : result.name,
                   "reset_password"  : result.resetPassword,
                   "version_update"  : result.versionUpdate };
    res.send(200, retval);
    self.log.info('log in success');
    return next();
  });
};

// check that the token is valid - is used for authorising Ember and API calls
exports.verifyToken = function (token, cb) {
  dbAuth.getUser(token, function (err, user) {
    if (err) { return cb(err); }
    // if not authenticated return error - could be due to two people logging into same account
    if (!user) { 
      return cb(new apiCommon.restify.InvalidCredentialsError('Invalid token'), null);
    }
    var tokenExp = moment(user.tokenExp).format('YYYY-MM-DD'),
        timeNow  = moment().format('YYYY-MM-DD');
    if (timeNow > tokenExp) { // if the token was issued by ADFS more than a day ago
      log.info('token has expired'); 
      return cb(new apiCommon.restify.InvalidCredentialsError('Expired token'), null);
    }
    var scope = 'all';
    if (!user.organisation) {
      scope = 'readonly';
    }
    return cb(null, user, { scope: scope });
  });
};
