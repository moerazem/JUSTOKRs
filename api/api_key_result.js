'use strict';
var   common      = require('./common'),
      log         = common.log,
      apiCommon   = require('./api_common'),
      async       = require('vasync'),
      moment      = require('moment'),
      dbKeyResult = require('./db_key_result');

exports.getKeyResults = function (req, res, next) {
  this.log = log.child({ action: 'getKeyResults' }); 
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
          dbKeyResult.getKeyResultsWithIds(fields, function (err, result) {
            if (err) { 
              self.log.error(err, 'getKeyResultsWithIds');
              return cb(err); 
            }
            return cb(null, result);
          });
        } else if (req.params.organisation && req.params.quarter && req.params.committed) {
          let fields = [ req.params.organisation, 
                         req.params.quarter,
                         req.params.committed ];
          dbKeyResult.getKeyResultsForSummary(fields, function (err, result) {
            if (err) { 
              self.log.error(err, 'getKeyResults');
              return cb(err); 
            }
            return cb(null, result);
          });
        } else if (req.params.quarter && !req.params.objective && !req.params.committed) {
          let fields = { quarter : req.params.quarter };
          dbKeyResult.getKeyResults(fields, function (err, result) {
            if (err) { 
              self.log.error(err, 'getKeyResults');
              return cb(err); 
            }
            return cb(null, result);
          });
        } else { // i.e. quarter and objective
          let fields = [ req.params.objective,
                         req.params.quarter ];
          dbKeyResult.getKeyResultsForObjective(fields, function (err, result) {
            if (err) { 
              self.log.error(err, 'getKeyResults');
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
      let keyResults = { keyResults: [] };
      for (var i in result) {
        let keyResultD  = result[i];
        let kruIds = [];
        let dIds = [];
        let tIds = [];
        if (keyResultD.keyResultUpdates) { kruIds = JSON.parse("[" + keyResultD.keyResultUpdates + "]"); }
        if (keyResultD.deliverables)     { dIds   = JSON.parse("[" + keyResultD.deliverables + "]"); }
        if (keyResultD.teams)            { tIds   = JSON.parse("[" + keyResultD.teams + "]"); }
        let keyResultF = { id:                keyResultD.id,
                           quarter:           keyResultD.quarter,
                           objective:         keyResultD.objective,
                           companyGoal:       keyResultD.companyGoal,
                           name:              keyResultD.name,
                           committed:         keyResultD.committed,
                           rag:               keyResultD.rag,
                           completionHorizon: keyResultD.completionHorizon,
                           horizonHistory:    keyResultD.horizonHistory,
                           status:            keyResultD.status,
                           commentary:        keyResultD.commentary,
                           capitalisable:     keyResultD.capitalisable,
                           jiraKR:            keyResultD.jiraKR,
                           risks:             keyResultD.risks,
                           docLink:           keyResultD.docLink,
                           keyResultUpdates:  kruIds,
                           deliverables:      dIds,
                           teams:             tIds };
        keyResults.keyResults[i] = keyResultF;
      }
      return cb(null, keyResults);
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

exports.getKeyResult = function (req, res, next) {
  this.log = log.child({ action: 'getKeyResult' }); 
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
      let keyResult = { keyResult: {} };
      if (user) {
        let fields = [ req.params.id ];
        dbKeyResult.getKeyResult(fields, function (err, result) {
          if (err) { 
            self.log.error(err, 'getKeyResult');
            return cb(err); 
          }
          let keyResultD  = result[0];
          let kruIds = [];
          let dIds  = [];
          let tIds   = [];
          if (keyResultD.keyResultUpdates) { kruIds = JSON.parse("[" + keyResultD.keyResultUpdates + "]"); }
          if (keyResultD.deliverables)     { dIds  = JSON.parse("[" + keyResultD.deliverables + "]"); }
          if (keyResultD.teams)            { tIds   = JSON.parse("[" + keyResultD.teams + "]"); }
          let keyResultF = { id:                keyResultD.id,
                             quarter:           keyResultD.quarter,
                             objective:         keyResultD.objective,
                             companyGoal:       keyResultD.companyGoal,
                             name:              keyResultD.name,
                             committed:         keyResultD.committed,
                             rag:               keyResultD.rag,
                             completionHorizon: keyResultD.completionHorizon,
                             horizonHistory:    keyResultD.horizonHistory,
                             status:            keyResultD.status,
                             commentary:        keyResultD.commentary,
                             engResp:           keyResultD.engResp,
                             productResp:       keyResultD.productResp,
                             uxResp:            keyResultD.uxResp,
                             engineers:         keyResultD.engineers,
                             capitalisable:     keyResultD.capitalisable,
                             jiraKR:            keyResultD.jiraKR,
                             risks:             keyResultD.risks,
                             docLink:           keyResultD.docLink,
                             keyResultUpdates:  kruIds,
                             deliverables:      dIds,
                             teams:             tIds };
          keyResult.keyResult = keyResultF;
          return cb(null, keyResult);
        });
      } else {
        self.log.warn('Not logged in');
        return cb(null, keyResult);
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

exports.postKeyResult = function (req, res, next) {
  this.log = log.child({ action: 'postKeyResult' }); 
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
        dbKeyResult.postKeyResult(req.params.keyResult, user, function (err, result) {
          if (err) { 
            self.log.error(err, 'postKeyResult');
            return cb(err); 
          }
          req.params.keyResult.id = result.insertId;
          return cb(null, req.params.keyResult);
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
    res.send(200, {keyResult: result});
    next();
  });
};

exports.putKeyResult = function (req, res, next) {
  this.log = log.child({ action: 'putKeyResult'}); 
  var self = this;
  async.waterfall([
    function(cb) { // authenticate with node API
      apiCommon.passport.authenticate('bearer', { session: false }, function(err, user, scope) {
        if (err) { return cb(err); }
        if (!user) { return cb(null, null); }
        if (scope.scope === 'readonly') {
          return cb(new apiCommon.restify.UnprocessableEntityError('Read only user'), null);
        }
        return cb(null, user);
      })(req, res, next);
    },
    function(user, cb) { // update DB
      if (user) {
        let fields = [ req.params.keyResult,
                       req.params.id ];
        dbKeyResult.putKeyResult(fields, user, function (err, result) {
          if (err) { 
            self.log.error(err, 'putKeyResult');
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
    req.params.keyResult.id = req.params.id;
    res.send(200, {keyResult: req.params.keyResult});
    next();
  });
};

exports.archiveKeyResult = function (req, res, next) {
  this.log = log.child({ action: 'archiveKeyResult' }); 
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
        dbKeyResult.archiveKeyResult(fields, user, function (err, result) {
          if (err) { 
            self.log.error(err, 'archiveKeyResult');
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
