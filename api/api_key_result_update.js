'use strict';
var   common    = require('./common'),
      log       = common.log,
      apiCommon = require('./api_common'),
      async     = require('vasync'),
      moment    = require('moment'),
      dbKeyResultUpdate = require('./db_key_result_update');

exports.getKeyResultUpdates = function (req, res, next) {
  this.log = log.child({ action: 'getKeyResultUpdates' }); 
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
      let keyResultUpdates = { keyResultUpdates: [] };
      if (user) {
        let fields = [req.params.ids];
        dbKeyResultUpdate.getKeyResultUpdatesWithIds(fields, function (err, result) {
          if (err) { 
            self.log.error(err, 'getKeyResultUpdates');
            return cb(err); 
          }
          keyResultUpdates.keyResultUpdates = result;
          return cb(null, keyResultUpdates);
        });
      } else {
        self.log.warn('Not logged in');
        return cb(null, keyResultUpdates);
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

exports.getKeyResultUpdate = function (req, res, next) {
  this.log = log.child({ action: 'getKeyResultUpdate' }); 
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
      let keyResultUpdate = { keyResultUpdate: {} };
      if (user) {
        let fields = [ req.params.id ];
        dbKeyResultUpdate.getKeyResultUpdate(fields, function (err, result) {
          if (err) { 
            self.log.error(err, 'getKeyResultUpdate');
            return cb(err); 
          }
          keyResultUpdate.keyResultUpdate = result;
          return cb(null, keyResultUpdate);
        });
      } else {
        self.log.warn('Not logged in');
        return cb(null, keyResultUpdate);
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

exports.postKeyResultUpdate = function (req, res, next) {
  this.log = log.child({ action: 'postKeyResultUpdate' }); 
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
        // get just the date portion
        req.params.keyResultUpdate.updateDate = moment(req.params.keyResultUpdate.updateDate).format('YYYY-MM-DD');
        dbKeyResultUpdate.postKeyResultUpdate(req.params.keyResultUpdate, user, function (err, result) {
          if (err) { 
            self.log.error(err, 'postKeyResultUpdate');
            return cb(err); 
          }
          req.params.keyResultUpdate.id = result.insertId;
          return cb(null, req.params.keyResultUpdate);
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
    res.send(200, {keyResultUpdate: req.params.keyResultUpdate});
    next();
  });
};

exports.putKeyResultUpdate = function (req, res, next) {
  this.log = log.child({ action: 'putKeyResultUpdate' }); 
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
        // get just the date portion
        req.params.keyResultUpdate.updateDate = moment(req.params.keyResultUpdate.updateDate).format('YYYY-MM-DD');
        let fields = [ req.params.keyResultUpdate,
                       req.params.id ];
        dbKeyResultUpdate.putKeyResultUpdate(fields, user, function (err, result) {
          if (err) { 
            self.log.error(err, 'putKeyResultUpdate');
            return cb(err); 
          }
          return cb(null, result);
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
    req.params.keyResultUpdate.id = req.params.id;
    res.send(200, {keyResultUpdate: req.params.keyResultUpdate});
    next();
  });
};

exports.archiveKeyResultUpdate = function (req, res, next) {
  this.log = log.child({ action: 'archiveKeyResulUpdatet' }); 
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
        let fields = [ req.params.id ];
        dbKeyResultUpdate.archiveKeyResultUpdate(fields, user, function (err, result) {
          if (err) { 
            self.log.error(err, 'archiveKeyResultUpdate');
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
    res.send(200, {});
    next();
  });
};
