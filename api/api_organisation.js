'use strict';
var   common    = require('./common'),
      log       = common.log,
      apiCommon = require('./api_common'),
      async     = require('vasync'),
      moment    = require('moment'),
      dbOrganisation    = require('./db_organisation');

exports.getOrganisations = function (req, res, next) {
  this.log = log.child({ action: 'getOrganisations' }); 
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
        dbOrganisation.getAllOrganisations(function (err, result) {
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
      let organisations = { organisations: [] };
      for (var i in result) {
        let organisationD = result[i];
        let organisationF = { id:   organisationD.id,
                              name: organisationD.name };
        organisations.organisations[i] = organisationF;
      }
      return cb(null, organisations);
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

exports.getOrganisation = function (req, res, next) {
  this.log = log.child({ action: 'getOrganisation' }); 
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
        let organisationR = { organisation: {} };
        let fields = [ req.params.id ];
        dbOrganisation.getOrganisation(fields, function (err, result) {
          if (err) { 
            self.log.error(err, 'getOrganisation');
            return cb(err); 
          }
          let organisationD  = result[0];
          self.log.info({organisation: organisationD});
          let organisationF = { id:   organisationD.id,
                                name: organisationD.name };
          organisationR.organisation = organisationF;
          return cb(null, organisationR);
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
