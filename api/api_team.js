'use strict';
var   common    = require('./common'),
      log       = common.log,
      apiCommon = require('./api_common'),
      async     = require('vasync'),
      moment    = require('moment'),
      dbTeam    = require('./db_team');

exports.getTeams = function (req, res, next) {
  this.log = log.child({ action: 'getTeams' }); 
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
          dbTeam.getTeamsById(fields, function (err, result) {
            if (err) { 
              self.log.error(err, 'getTeamsById');
              return cb(err); 
            }
            return cb(null, result);
          });
        } else if (req.params.organisation && req.params.quarter) {
          let fields = [req.params.organisation,
                        req.params.quarter];
          dbTeam.getTeamsByQuarter(fields, function (err, result) {
            if (err) { 
              self.log.error(err, 'getTeamsByQuarter');
              return cb(err); 
            }
            return cb(null, result);
          });
        } else if (req.params.organisation) {
          let fields = [req.params.organisation];
          dbTeam.getTeams(fields, function (err, result) {
            if (err) { 
              self.log.error(err, 'getTeams');
              return cb(err); 
            }
            return cb(null, result);
          });
        } else { // get teams for all organisations
          dbTeam.getAllTeams(function (err, result) {
            if (err) { 
              self.log.error(err, 'getAllTeams');
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
      let teams = { teams: [] };
      for (var i in result) {
        let teamD  = result[i];
        let dIds = [];
        if (teamD.deliverables) { dIds = JSON.parse("[" + teamD.deliverables + "]"); }
        let teamF = { id:               teamD.id,
                      name:             teamD.name,
                      shortCode:        teamD.shortCode,
                      techLead:         teamD.techLead,
                      productManager:   teamD.productManager,
                      uxDesigner:       teamD.uxDesigner,
                      programmeManager: teamD.programmeManager,
                      organisation:     teamD.organisation,
                      deliverables:     dIds };
        teams.teams[i] = teamF;
      }
      return cb(null, teams);
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

exports.getTeam = function (req, res, next) {
  this.log = log.child({ action: 'getTeam' }); 
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
      let team = { team: {} };
      if (user) {
        let fields = [ req.params.id ];
        dbTeam.getTeam(fields, function (err, result) {
          if (err) { 
            self.log.error(err, 'getTeam');
            return cb(err); 
          }
          let teamD  = result[0];
          let dIds = [];
          if (teamD.deliverables) { dIds = JSON.parse("[" + teamD.deliverables + "]"); }
          let teamF = { id:               teamD.id,
                        name:             teamD.name,
                        shortCode:        teamD.shortCode,
                        techLead:         teamD.techLead,
                        productManager:   teamD.productManager,
                        uxDesigner:       teamD.uxDesigner,
                        programmeManager: teamD.programmeManager,
                        organisation:     teamD.organisation,
                        deliverables:     dIds };
          team.team = teamF;
          return cb(null, team);
        });
      } else {
        self.log.warn('Not logged in');
        return cb(null, team);
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

exports.postTeam = function (req, res, next) {
  this.log = log.child({ action: 'postTeam' }); 
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
        dbTeam.postTeam(req.params.team, user, function (err, result) {
          if (err) { 
            self.log.error(err, 'postTeam');
            return cb(err); 
          }
          req.params.team.id = result.insertId;
          return cb(null, req.params.team);
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

exports.putTeam = function (req, res, next) {
  this.log = log.child({ action: 'putTeam' }); 
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
        let fields = [ req.params.team,
                       req.params.id ];
        dbTeam.putTeam(fields, user, function (err, result) {
          if (err) { 
            self.log.error(err, 'putTeam');
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
    req.params.team.id = req.params.id;
    res.send(200, {team: req.params.team});
    next();
  });
};

exports.archiveTeam = function (req, res, next) {
  this.log = log.child({ action: 'archiveTeam' }); 
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
        dbTeam.archiveTeam(fields, user, function (err, result) {
          if (err) { 
            self.log.error(err, 'archiveTeam');
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
