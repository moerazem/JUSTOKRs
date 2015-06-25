'use strict';
var   common    = require('./common'),
      log       = common.log,
      apiCommon = require('./api_common'),
      dbJira    = require('./db_jira'),
      async     = require('vasync'),
      restc     = require('node-rest-client').Client,
      moment    = require('moment');

// Jira prototype
var Jira = function() {
  this.id             = arguments.id;
  this.project        = arguments.project;
  this.keyResult      = arguments.keyResult;
  this.assignee       = arguments.assignee;
  this.implementedBy  = arguments.implementedBy;
  this.resolutionDate = arguments.resolutionDate;
  this.status         = arguments.status;
};

exports.getJiras = function (req, res, next) {
  this.log = log.child({ action: 'getJiras' }); 
  var self = this;

  async.waterfall([
    function(cb) { // get data from JIRA
      var authArgs = { user     : 'gordon.bazeley',
                       password : 'POTat0E/' };
      var client = new restc(authArgs);
      var jiras  = [];
      var total   = 51;

      // var query = encodeURI('https://jira.just-eat.net/rest/api/latest/issue/VGS-1133?expand=changelog'); // get a single JIRA and it's changelog
      // var query = encodeURI('https://jira.just-eat.net/rest/api/latest/search/?jql=key=VGS-1133&expand=changelog'); // get a complex JIRA query and changelog
      for (var maxRec = 0; maxRec < total; maxRec = maxRec + 50) {
        var query = encodeURI('https://jira.just-eat.net/rest/api/latest/search/?jql=project in (CAA, CIA, CWA, BUSI, RAPPS, EPOS, JAL, PRS, VGS, SIM) AND ImplementedBy is not EMPTY AND resolutiondate >= -31d&expand=changelog&startAt='+maxRec); // all JIRAs that have been completed in last month with implementedBy field set
      
        client.get(query, function(data, response) {
          total = data.total;

          for (var i in data.issues) {
            var issue = data.issues[i];
            self.log.info({ startAt: data.startAt, maxRec: maxRec, total: total });
            var jira = new Jira();
            jira.id             = issue.key;
            jira.project        = issue.fields.project.key;
            jira.keyResult      = issue.fields.customfield_11095.value;
            jira.assignee       = issue.fields.assignee.name;
            jira.implementedBy  = issue.fields.customfield_11792;
            jira.resolutionDate = issue.fields.resolutiondate;
            jira.status         = issue.fields.status.name;
            // self.log.info({ jira: jira });
            // dbJira.postJira(jira, function (err) {
            //   if (err) {
            //     log.error(err, 'error in postJira');
            //     return cb(err);
            //   }
            // });
          }
          self.log.info('ending');
        }).on('error', function(err) {
          self.log.err({err: err}, 'error');
          return cb(err);
        });
      }
      self.log.info('return end');
      // return cb(null, data);
    },
  ],
  function(err, result) {
    // self.log.info({result: result});
    if (err) {
      self.log.error(err);
      return next(err);
    }
    res.send(200, result);
    next();
  });
};
