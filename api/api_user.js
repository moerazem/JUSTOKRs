'use strict';
var   common    = require('./common'),
      log       = common.log,
      apiCommon = require('./api_common'),
      async     = require('vasync'),
      moment    = require('moment'),
      dbUser    = require('./db_user');

exports.getUsers = function (req, res, next) {
  this.log = log.child({ action: 'getUsers' }); 
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
        if (req.params.team) {
          dbUser.getTeamUsers(req.params.team, function (err, result) {
            if (err) { 
              self.log.error(err);
              return cb(err); 
            }
            return cb(null, result);
          });
        } else {
          dbUser.getAllUsers(function (err, result) {
            if (err) { 
              self.log.error(err);
              return cb(err); 
            }
            return cb(null, result);
          });
        }
      } else {
        self.log.warn('Not logged in');
        return cb(null, null);
      }
    },
    function(result, cb) { // format data for return
      let users = { users: [] };
      for (var i in result) {
        let userD = result[i];
        let userF = { id:           userD.id,
                      name:         userD.name,
                      email:        userD.name,
                      givenName:    userD.givenName,
                      surname:      userD.surname,
                      organisation: userD.organisation,
                      team:         userD.team,
                      role:         userD.role,
                      staffNumber:  userD.staffNumber };
        users.users[i] = userF;
      }
      return cb(null, users);
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

exports.getUser = function (req, res, next) {
  this.log = log.child({ action: 'getUser' }); 
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
        let userR = { user: {} };
        let fields = [ req.params.id ];
        dbUser.getUser(fields, function (err, result) {
          if (err) { 
            self.log.error(err, 'getUser');
            return cb(err); 
          }
          let userD  = result[0];
          self.log.info({user: userD});
          let userF = { id:           userD.id,
                        name:         userD.name,
                        email:        userD.name,
                        givenName:    userD.givenName,
                        surname:      userD.surname,
                        organisation: userD.organisation,
                        team:         userD.team,
                        role:         userD.role,
                        staffNumber:  userD.staffNumber };
          userR.user = userF;
          return cb(null, userR);
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

exports.postUser = function (req, res, next) {
  this.log = log.child({ action: 'postUser' }); 
  var self = this;
  async.waterfall([
    function(cb) { // authenticate with node API
      apiCommon.passport.authenticate('bearer', { session: false }, function(err, user) {
        if (err) { return cb(err); }
        if (!user) { return cb(null, null); }
        return cb(null, user);
      })(req, res, next);
    },
    function(user, cb) { // insert data into DB
      if (user) {
        dbUser.postUser(req.params.user, user, function (err, result) {
          if (err) { 
            self.log.error(err, 'postUser');
            return cb(err); 
          }
          req.params.user.id = result.insertId;
          return cb(null, req.params.user);
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
    res.send(200, {team: result});
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
    function(user, cb) { // update DB
      if (user) {
        // expire the users token so that they'll be automatically logged out and in again with the new rights
        req.params.user.tokenExp = moment().subtract(1, 'd').format('YYYY-MM-DD');
        let fields = [ req.params.user,
                       req.params.id ];
        dbUser.putUser(fields, user, function (err, result) {
          if (err) { 
            self.log.error(err, 'putUser');
            return cb(err); 
          }
          return cb(null, null);
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
    req.params.user.id = req.params.id;
    res.send(200, {user: req.params.user});
    next();
  });
};
