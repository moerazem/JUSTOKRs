'use strict';
var   common      = require('./common'),
      log         = common.log,
      apiCommon   = require('./api_common'),
      async       = require('vasync'),
      moment      = require('moment'),
      dbDeliverableUpdate = require('./db_deliverable_update');

exports.getDeliverableUpdates = function (req, res, next) {
  this.log = log.child({ action: 'getDeliverableUpdates' }); 
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
        if (req.params.ids) {
          let fields = [req.params.ids];
          dbDeliverableUpdate.getDeliverableUpdatesWithIds(fields, function (err, result) {
            if (err) { 
              self.log.error(err, 'getDeliverableUpdatesWithIds');
              return cb(err); 
            }
            return cb(null, result);
          });
        } else if (req.params.quarter) {
          let fields = { quarter : req.params.quarter };
          dbDeliverableUpdate.getDeliverableUpdates(fields, function (err, result) {
            if (err) { 
              self.log.error(err, 'getDeliverableUpdates');
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
      let deliverableUpdates = { deliverableUpdates: [] };
      for (var i in result) {
        let deliverableUpdateD = result[i];
        let deliverableUpdateF = { id:                 deliverableUpdateD.id,
                                   updateDate:         deliverableUpdateD.updateDate,
                                   deliveryDate:       deliverableUpdateD.deliveryDate,
                                   status:             deliverableUpdateD.status,
                                   commentary:         deliverableUpdateD.commentary };
        deliverableUpdates.deliverableUpdates[i] = deliverableUpdateF;
      }
      return cb(null, deliverableUpdates);
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

exports.getDeliverableUpdate = function (req, res, next) {
  this.log = log.child({ action: 'getDeliverableUpdate' }); 
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
      let deliverableUpdate = { deliverableUpdate: {} };
      if (user) {
        let fields = [ req.params.id ];
        dbDeliverableUpdate.getDeliverableUpdate(fields, function (err, result) {
          if (err) { 
            self.log.error(err, 'getDeliverableUpdate');
            return cb(err); 
          }
          let deliverableUpdateD  = result[0];
          let deliverableUpdateF = { id:                 deliverableUpdateD.id,
                                     updateDate:         deliverableUpdateD.updateDate,
                                     deliveryDate:       deliverableUpdateD.deliveryDate,
                                     status:             deliverableUpdateD.status,
                                     commentary:         deliverableUpdateD.commentary };
          deliverableUpdate.deliverableUpdate = deliverableUpdateF;
          return cb(null, deliverableUpdate);
        });
      } else {
        self.log.warn('Not logged in');
        return cb(null, deliverableUpdate);
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
exports.postDeliverableUpdate = function (req, res, next) {
  this.log = log.child({ action: 'postDeliverableUpdate' }); 
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
        req.params.deliverableUpdate.updateDate   = moment(req.params.deliverableUpdate.updateDate).format('YYYY-MM-DD');
        req.params.deliverableUpdate.deliveryDate = moment(req.params.deliverableUpdate.deliveryDate).format('YYYY-MM-DD');
        dbDeliverableUpdate.postDeliverableUpdate(req.params.deliverableUpdate, user, function (err, result) {
          if (err) { 
            self.log.error(err, 'postDeliverableUpdate');
            return cb(err); 
          }
          req.params.deliverableUpdate.id = result.insertId;
          return cb(null, req.params.deliverableUpdate);
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
    res.send(200, {deliverableUpdate: result});
    next();
  });
};

exports.putDeliverableUpdate = function (req, res, next) {
  this.log = log.child({ action: 'putDeliverableUpdate' }); 
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
        req.params.deliverableUpdate.updateDate   = moment(req.params.deliverableUpdate.updateDate).format('YYYY-MM-DD');
        req.params.deliverableUpdate.deliveryDate = moment(req.params.deliverableUpdate.deliveryDate).format('YYYY-MM-DD');
        let fields = [ req.params.deliverableUpdate,
                       req.params.id ];
        dbDeliverableUpdate.putDeliverableUpdate(fields, user, function (err, result) {
          if (err) { 
            self.log.error(err, 'putDeliverableUpdate');
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
    req.params.deliverableUpdate.id = req.params.id;
    res.send(200, {deliverableUpdate: req.params.deliverableUpdate});
    next();
  });
};

exports.archiveDeliverableUpdate = function (req, res, next) {
  this.log = log.child({ action: 'archiveDeliverableUpdate' }); 
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
        dbDeliverableUpdate.archiveDeliverableUpdate(fields, user, function (err, result) {
          if (err) { 
            self.log.error(err, 'archiveDeliverableUpdate');
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
