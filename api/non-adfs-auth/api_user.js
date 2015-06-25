'use strict';
var   common    = require('./common'),
      log       = common.log,
      apiCommon = require('./api_common'),
      apiAuth   = require('./api_auth'),
      async     = require('vasync'),
      moment    = require('moment'),
      dbUser    = require('./db_user');

exports.getUser = function (req, res, next) {
  this.log = log.child({ action: 'getUser' }); 
  var self = this;
  async.waterfall([
    function(cb) { // get data from DB
      let userR = { user: {} };

      self.log.info({params: req.params});
      let fields = [ req.params.id ];
      dbUser.getUser(fields, function (err, result) {
        if (err) { 
          self.log.error(err, 'getUser');
          return cb(err); 
        }
        let userD  = result[0];
        self.log.info({user: userD});
        let userF = { id:   userD.id,
                      name: userD.name };
        userR.user = userF;
        return cb(null, userR);
      });
    },
  ],
  function(err, result) {
    if (err) {
      self.log.error(err);
      return next(err);
    }
    res.send(200, result);
    next();
  });
};

exports.putUser = function (req, res, next) {
  this.log = log.child({ action: 'putUser' }); 
  var self = this;
  async.waterfall([
    function(cb) { // authenticate with node API
      apiCommon.passport.authenticate('bearer', { session: false }, function(err, user) {
        if (err) { return cb(err); }
        if (!user) { return cb(null, null); }
        return cb(null, user);
      })(req, res, next);
    },
    function(user, cb) { // get existing user password
      if (user) {
        let fields = [ user.name ];
        dbUser.getUserPassword(fields, function (err, result) {
          if (err) { 
            self.log.error(err, 'getUser');
            return cb(err); 
          }
          return cb(null, result[0]);
        });
      } else {
        self.log.warn('Not logged in');
        return cb(null, null);
      }
    },
    function(user, cb) { // update DB
      if (req.params.user.newPassword1 !== req.params.user.newPassword2) {
        var error = new apiCommon.restify.WrongAcceptError("New passwords don't match");
        return cb(error, null);
      }
      if (req.params.user.newPassword1 === req.params.user.oldPassword) {
        var error = new apiCommon.restify.WrongAcceptError("New password can't be the same as old password");
        return cb(error, null);
      }
      let fields = [ { password:      req.params.user.newPassword1,
                       resetPassword: false },
                     req.params.id ];
      dbUser.putUser(fields, user, function (err, result) {
        if (err) { 
          self.log.error(err, 'putUser');
          return cb(err); 
        }
        return cb(null, null);
      });
    },
  ],
  function(err, result) {
    if (err) {
      return next(err);
    }
    req.params.user.id = req.params.id;
    res.send(200, {user: req.params.user});
    next();
  });
};
