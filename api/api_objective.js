'use strict';
var   common    = require('./common'),
      log       = common.log,
      apiCommon = require('./api_common'),
      async     = require('vasync'),
      moment    = require('moment'),
      dbObjective = require('./db_objective');

exports.getObjectives = function (req, res, next) {
  this.log = log.child({ action: 'getObjectives' }); 
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
      let objectives = { objectives: [] };
      if (user) {
        let fields = [];
        // something of a nasty hack as can't pass quarter as a parameter so pass it in header instead
        if (req.params.ids && req.headers.quarter) {
          fields = [req.params.ids, 
                    req.headers.quarter];
          dbObjective.getObjectivesWithIds(fields, function (err, result) {
            if (err) { 
              self.log.error(err, 'getObjectivesWithIds');
              return cb(err); 
            }
            for (var i in result) {
              let objectiveD  = result[i];
              let krIds = [];
              if (objectiveD.keyResults) { krIds = JSON.parse("[" + objectiveD.keyResults + "]"); }
              let objectiveF = { id:               objectiveD.id,
                                 name:             objectiveD.name,
                                 description:      objectiveD.description,
                                 programmeManager: objectiveD.programmeManager,
                                 engResp:          objectiveD.engResp,
                                 productResp:      objectiveD.productResp,
                                 uxDesResp:        objectiveD.uxDesResp,
                                 uxResResp:        objectiveD.uxResResp,
                                 biResp:           objectiveD.biResp,
                                 objectiveType:    objectiveD.objectiveType,
                                 engineers:        objectiveD.engineers,
                                 organisation:     objectiveD.organisation,
                                 docLink:          objectiveD.docLink,
                                 keyResults:       krIds };
              objectives.objectives[i] = objectiveF;
            }
            return cb(null, objectives);
          });
        } else if (req.params.organisation && req.params.quarter) {
          fields = [req.params.organisation,
                    req.params.quarter];
          dbObjective.getObjectives(fields, function (err, result) {
            if (err) { 
              self.log.error(err, 'getObjectives');
              return cb(err); 
            }
            for (var i in result) {
              let objectiveD  = result[i];
              let krIds = [];
              if (objectiveD.keyResults) { krIds = JSON.parse("[" + objectiveD.keyResults + "]"); }
              let objectiveF = { id:               objectiveD.id,
                                 name:             objectiveD.name,
                                 description:      objectiveD.description,
                                 programmeManager: objectiveD.programmeManager,
                                 engResp:          objectiveD.engResp,
                                 productResp:      objectiveD.productResp,
                                 uxDesResp:        objectiveD.uxDesResp,
                                 uxResResp:        objectiveD.uxResResp,
                                 biResp:           objectiveD.biResp,
                                 objectiveType:    objectiveD.objectiveType,
                                 engineers:        objectiveD.engineers,
                                 organisation:     objectiveD.organisation,
                                 docLink:          objectiveD.docLink,
                                 keyResults:       krIds };
              objectives.objectives[i] = objectiveF;
            }
            return cb(null, objectives);
          });
        } else if (req.params.organisation) { // get all objectives
          fields = [req.params.organisation];
          dbObjective.getAllObjectives(fields, function (err, result) {
            if (err) { 
              self.log.error(err, 'getAllObjectives');
              return cb(err); 
            }
            for (var i in result) {
              let objectiveD  = result[i];
              let krIds = [];
              if (objectiveD.keyResults) { krIds = JSON.parse("[" + objectiveD.keyResults + "]"); }
              let objectiveF = { id:               objectiveD.id,
                                 name:             objectiveD.name,
                                 description:      objectiveD.description,
                                 programmeManager: objectiveD.programmeManager,
                                 engResp:          objectiveD.engResp,
                                 productResp:      objectiveD.productResp,
                                 uxDesResp:        objectiveD.uxDesResp,
                                 uxResResp:        objectiveD.uxResResp,
                                 biResp:           objectiveD.biResp,
                                 objectiveType:    objectiveD.objectiveType,
                                 engineers:        objectiveD.engineers,
                                 organisation:     objectiveD.organisation,
                                 docLink:          objectiveD.docLink,
                                 keyResults:       krIds };
              objectives.objectives[i] = objectiveF;
            }
            return cb(null, objectives);
          });
        } 
      } else {
        self.log.warn('Not logged in');
        return cb(null, objectives);
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

exports.getObjective = function (req, res, next) {
  this.log = log.child({ action: 'getObjective' }); 
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
      let objective = { objective: {} };
      if (user) {
        let fields = [ req.params.id ];
        dbObjective.getObjective(fields, function (err, result) {
          if (err) { 
            self.log.error(err, 'getObjective');
            return cb(err); 
          }
          let objectiveD  = result[0];
          let krIds = [];
          if (objectiveD.keyResults) { krIds = JSON.parse("[" + objectiveD.keyResults + "]"); }
          let objectiveF = { id:               objectiveD.id,
                             name:             objectiveD.name,
                             description:      objectiveD.description,
                             programmeManager: objectiveD.programmeManager,
                             engResp:          objectiveD.engResp,
                             productResp:      objectiveD.productResp,
                             uxDesResp:        objectiveD.uxDesResp,
                             uxResResp:        objectiveD.uxResResp,
                             biResp:           objectiveD.biResp,
                             objectiveType:    objectiveD.objectiveType,
                             engineers:        objectiveD.engineers,
                             organisation:     objectiveD.organisation,
                             docLink:          objectiveD.docLink,
                             keyResults:       krIds };
          objective.objective = objectiveF;
          return cb(null, objective);
        });
      } else {
        self.log.warn('Not logged in');
        return cb(null, objective);
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

exports.postObjective = function (req, res, next) {
  this.log = log.child({ action: 'postObjective' }); 
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
        dbObjective.postObjective(req.params.objective, user, function (err, result) {
          if (err) { 
            self.log.error(err, 'postObjective');
            return cb(err); 
          }
          req.params.objective.id = result.insertId;
          return cb(null, req.params.objective);
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
    res.send(200, {objective: result});
    next();
  });
};

exports.putObjective = function (req, res, next) {
  this.log = log.child({ action: 'putObjective' }); 
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
        let fields = [ req.params.objective,
                       req.params.id ];
        dbObjective.putObjective(fields, user, function (err, result) {
          if (err) { 
            self.log.error(err, 'putObjective');
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
    req.params.objective.id = req.params.id;
    res.send(200, {objective: req.params.objective});
    next();
  });
};

exports.archiveObjective = function (req, res, next) {
  this.log = log.child({ action: 'archiveObjective' }); 
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
        dbObjective.archiveObjective(fields, user, function (err, result) {
          if (err) { 
            self.log.error(err, 'archiveObjective');
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
