'use strict';
var   common        = require('./common'),
      log           = common.log,
      apiCommon     = require('./api_common'),
      async         = require('vasync'),
      moment        = require('moment'),
      dbDeliverable = require('./db_deliverable');

exports.getDeliverables = function (req, res, next) {
  this.log = log.child({ action: 'getDeliverables' }); 
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
          dbDeliverable.getDeliverablesWithIds(fields, function (err, result) {
            if (err) { 
              self.log.error(err, 'getDeliverablesWithIds');
              return cb(err); 
            }
            return cb(null, result);
          });
        } else if (req.params.quarter && !req.params.team) {
          let fields = [ req.params.quarter,
                         req.headers.organisation ];
          dbDeliverable.getDeliverables(fields, function (err, result) {
            if (err) { 
              self.log.error(err, 'getDeliverables');
              return cb(err); 
            }
            return cb(null, result);
          });
        } else { // must be team
          let fields = [ req.params.team,
                         req.params.quarter ];
          dbDeliverable.getDeliverablesForTeam(fields, function (err, result) {
            if (err) { 
              self.log.error(err, 'getDeliverables');
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
      let deliverables = { deliverables: [] };
      for (var i in result) {
        let deliverableD  = result[i];
        let riuIds = [];
        if (deliverableD.deliverableUpdates) { riuIds = JSON.parse("[" + deliverableD.deliverableUpdates + "]"); }
        let deliverableF = { id:                 deliverableD.id,
                             keyResult:          deliverableD.keyResult,
                             name:               deliverableD.name,
                             description:        deliverableD.description,
                             milestones:         deliverableD.milestones,
                             status:             deliverableD.status,
                             commentary:         deliverableD.commentary,
                             updateDate:         deliverableD.updateDate,
                             team:               deliverableD.team,
                             priority:           deliverableD.priority,
                             countryFlag:        deliverableD.countryFlag,
                             teamFlag:           deliverableD.teamFlag,
                             statusChangeDate:   deliverableD.statusChangeDate,
                             deliveryDate:       deliverableD.deliveryDate,
                             deliverableUpdates: riuIds };
        deliverables.deliverables[i] = deliverableF;
      }
      return cb(null, deliverables);
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

exports.getDeliverable = function (req, res, next) {
  this.log = log.child({ action: 'getDeliverable' }); 
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
      let deliverable = { deliverable: {} };
      if (user) {
        let fields = [ req.params.id ];
        dbDeliverable.getDeliverable(fields, function (err, result) {
          if (err) { 
            self.log.error(err, 'getDeliverable');
            return cb(err); 
          }
          let deliverableD  = result[0];
          let riuIds = [];
          if (deliverableD.deliverableUpdates) { riuIds = JSON.parse("[" + deliverableD.deliverableUpdates + "]"); }
          let deliverableF = { id:                 deliverableD.id,
                               keyResult:          deliverableD.keyResult,
                               name:               deliverableD.name,
                               description:        deliverableD.description,
                               milestones:         deliverableD.milestones,
                               status:             deliverableD.status,
                               commentary:         deliverableD.commentary,
                               updateDate:         deliverableD.updateDate,
                               team:               deliverableD.team,
                               priority:           deliverableD.priority,
                               countryFlag:        deliverableD.countryFlag,
                               teamFlag:           deliverableD.teamFlag,
                               statusChangeDate:   deliverableD.statusChangeDate,
                               deliveryDate:       deliverableD.deliveryDate,
                               deliverableUpdates: riuIds };
          
          deliverable.deliverable = deliverableF;
          return cb(null, deliverable);
        });
      } else {
        self.log.warn('Not logged in');
        return cb(null, deliverable);
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

exports.postDeliverable = function (req, res, next) {
  this.log = log.child({ action: 'postDeliverable' }); 
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
        dbDeliverable.postDeliverable(req.params.deliverable, user, function (err, result) {
          if (err) { 
            self.log.error(err, 'postDeliverable');
            return cb(err); 
          }
          req.params.deliverable.id = result.insertId;
          return cb(null, req.params.deliverable);
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
    res.send(200, {deliverable: result});
    next();
  });
};

exports.putDeliverable = function (req, res, next) {
  this.log = log.child({ action: 'putDeliverable' }); 
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
        let fields = [ req.params.deliverable,
                       req.params.id ];
        dbDeliverable.putDeliverable(fields, user, function (err, result) {
          if (err) { 
            self.log.error(err, 'putDeliverable');
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
    req.params.deliverable.id = req.params.id;
    res.send(200, {deliverable: req.params.deliverable});
    next();
  });
};

exports.archiveDeliverable = function (req, res, next) {
  this.log = log.child({ action: 'archiveDeliverable' }); 
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
        dbDeliverable.archiveDeliverable(fields, user, function (err, result) {
          if (err) { 
            self.log.error(err, 'archiveDeliverable');
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
