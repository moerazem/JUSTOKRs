'use strict';
var   common    = require('./common'),
      log       = common.log,
      apiCommon = require('./api_common'),
      async     = require('vasync'),
      moment    = require('moment'),
      dbVersionUpdate = require('./db_version_update');

exports.getVersionUpdates = function (req, res, next) {
  this.log = log.child({ action: 'getVersionUpdates' }); 
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
      let vuR = { versionUpdates: [] };
      if (user) {
        dbVersionUpdate.getAllVersionUpdates(function (err, result) {
          if (err) { 
            self.log.error(err, 'getVersionUpdates');
            return cb(err); 
          }
          for (var i in result) {
            let vuD  = result[i];
            let vuF = { id:   vuD.id,
                        name: vuD.name,
                        description: vuD.description,
                        releaseDate: vuD.releaseDate };
            vuR.versionUpdates[i] = vuF;
          }
          return cb(null, vuR);
        });
      } else {
        self.log.warn('Not logged in');
        return cb(null, vuR);
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
