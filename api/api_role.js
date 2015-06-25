'use strict';
var   common    = require('./common'),
      log       = common.log,
      apiCommon = require('./api_common'),
      async     = require('vasync'),
      moment    = require('moment'),
      dbRole    = require('./db_role');

exports.getRoles = function (req, res, next) {
  this.log = log.child({ action: 'getRoles' }); 
  var self = this;
  async.waterfall([
    function(cb) { // authenticate with node API
      apiCommon.passport.authenticate('bearer', { session: false }, function(err, user) {
        if (err) { return cb(err); }
        if (!user) { return cb(null, null); }
        return cb(null, user);
      })(req, res, next);
    },
    function(user, cb) { // get data from DB
      if (user) {
        dbRole.getAllRoles(function (err, result) {
          if (err) { 
            self.log.error(err);
            return cb(err); 
          }
          return cb(null, result);
        });
      } else {
        self.log.warn('Not logged in');
        return cb(null, null);
      }
    },
    function(result, cb) { // format data for return
      let roles = { roles: [] };
      for (var i in result) {
        let roleD = result[i];
        let roleF = { id:   roleD.id,
                      name: roleD.name };
        roles.roles[i] = roleF;
      }
      return cb(null, roles);
    }
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

exports.getRole = function (req, res, next) {
  this.log = log.child({ action: 'getRole' }); 
  var self = this;
  async.waterfall([
    function(cb) { // authenticate with node API
      apiCommon.passport.authenticate('bearer', { session: false }, function(err, user) {
        if (err) { return cb(err); }
        if (!user) { return cb(null, null); }
        return cb(null, user);
      })(req, res, next);
    },
    function(user, cb) { // get data from DB
      if (user) {
        let roleR = { role: {} };
        let fields = [ req.params.id ];
        dbRole.getRole(fields, function (err, result) {
          if (err) { 
            self.log.error(err, 'getRole');
            return cb(err); 
          }
          let roleD  = result[0];
          self.log.info({role: roleD});
          let roleF = { id:   roleD.id,
                        name: roleD.name };
          roleR.role = roleF;
          return cb(null, roleR);
        });
      } else {
        self.log.warn('Not logged in');
        return cb(null, null);
      }
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
