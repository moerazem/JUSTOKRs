'use strict';
var   common    = require('./common'),
      log       = common.log,
      apiCommon = require('./api_common'),
      async     = require('vasync'),
      moment    = require('moment'),
      dbQuarter = require('./db_quarter');

exports.getQuarters = function (req, res, next) {
  this.log = log.child({ action: 'getQuarters' }); 
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
      let quarters    = { quarters: [] };
      if (user) {
        self.log.info({params: req.params});
        if (req.params.organisation) {
          let fields = [req.params.organisation];
        
          dbQuarter.getQuarters(fields, function (err, result) {
            if (err) { 
              self.log.error(err, 'getQuarters');
              return cb(err); 
            }
            for (var i in result) {
              let quarterD  = result[i];
              let krIds = [];
              if (quarterD.keyResults) { krIds = JSON.parse("[" + quarterD.keyResults + "]"); }
              let quarterF = { id:           quarterD.id,
                               year:         quarterD.year,
                               quarter:      quarterD.quarter,
                               organisation: quarterD.organisation,
                               keyResults:   krIds };
              quarters.quarters[i] = quarterF;
            }
            return cb(null, quarters);
          });
        } else {
          dbQuarter.getAllQuarters(function (err, result) {
            if (err) { 
              self.log.error(err, 'getAllQuarters');
              return cb(err); 
            }
            for (var i in result) {
              let quarterD  = result[i];
              let krIds = [];
              let quarterF = { id:           quarterD.id,
                               year:         quarterD.year,
                               quarter:      quarterD.quarter,
                               keyResults:   krIds };
              quarters.quarters[i] = quarterF;
            }
            return cb(null, quarters);
          });
        }
      } else {
        self.log.warn('Not logged in');
        return cb(null, quarters);
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

exports.getQuarter = function (req, res, next) {
  this.log = log.child({ action: 'getQuarter' }); 
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
      let quarter = { quarter: {} };
      if (user) {
        let fields = [ req.params.id,
                       req.headers.organisation ];
        dbQuarter.getQuarter(fields, function (err, result) {
          if (err) { 
            self.log.error(err, 'getQuarter');
            return cb(err); 
          }
          let quarterD  = result[0];
          if (quarterD) {
            let krIds = [];
            if (quarterD.keyResults) { krIds = JSON.parse("[" + quarterD.keyResults + "]"); }
            let quarterF = { id:           quarterD.id,
                             year:         quarterD.year,
                             quarter:      quarterD.quarter,
                             organisation: quarterD.organisation,
                             keyResults:   krIds };
            quarter.quarter = quarterF;
          }
          return cb(null, quarter);
        });
      } else {
        self.log.warn('Not logged in');
        return cb(null, quarter);
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

exports.postQuarter = function (req, res, next) {
  this.log = log.child({ action: 'postQuarter' }); 
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
        dbQuarter.postQuarter(req.params.quarter, user, function (err, result) {
          if (err) { 
            self.log.error(err, 'postQuarter');
            return cb(err); 
          }
          req.params.quarter.id = result.insertId;
          return cb(null, req.params.quarter);
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
    res.send(200, {quarter: result});
    next();
  });
};

exports.putQuarter = function (req, res, next) {
  this.log = log.child({ action: 'putQuarter' }); 
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
        let fields = [ req.params.quarter,
                       req.params.id ];
        dbQuarter.putQuarter(fields, user, function (err, result) {
          if (err) { 
            self.log.error(err, 'putQuarter');
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
    req.params.quarter.id = req.params.id;
    res.send(200, {quarter: req.params.quarter});
    next();
  });
};

exports.archiveQuarter = function (req, res, next) {
  this.log = log.child({ action: 'archiveQuarter' }); 
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
        dbQuarter.archiveQuarter(fields, user, function (err, result) {
          if (err) { 
            self.log.error(err, 'archiveQuarter');
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
