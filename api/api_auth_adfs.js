"use strict";
var common    = require('./common'),
    log       = common.log,
    apiCommon = require('./api_common'),
    dbAuth    = require('./db_auth'),
    dbVersionUpdate = require('./db_version_update'),
    async     = require('vasync'),
    S         = require('string'),
    moment    = require('moment');

// this routine is called from the ADFS login page and saves the token from ADFS and expiry date (in one day) and then redirects to the ember ADFS login page
exports.adfsLogin = function(req, res, next) {
  var samlBuf = new Buffer(req.params.SAMLResponse, 'base64');
  var samlStr = samlBuf.toString();
  var token          = S(samlStr).between('<ds:DigestValue>', '</ds:DigestValue>').s;
  var emailClaim     = S(samlStr).between('Email"><AttributeValue>', '</AttributeValue>').s;
  var nameClaim      = S(samlStr).between('identity/claims/name"><AttributeValue>', '</AttributeValue>').s;
  var givenNameClaim = S(samlStr).between('identity/claims/givenname"><AttributeValue>', '</AttributeValue>').s;
  var surnameClaim   = S(samlStr).between('identity/claims/surname"><AttributeValue>', '</AttributeValue>').s;
  var roleClaim      = S(samlStr).between('identity/claims/role"><AttributeValue>', '</AttributeValue>').s;
  var orgClaim       = S(samlStr).between('Organisation"><AttributeValue>', '</AttributeValue>').s;
  var expires        = moment(S(samlStr).between('SubjectConfirmationData NotOnOrAfter="', '"').s).add(1, 'd').format('YYYY-MM-DD'); // token expires in a day
  // log.info({firstName: givenNameClaim, surname: surnameClaim, role: roleClaim, org: orgClaim, email: emailClaim, token: token, expires: expires});
  var fields  = [ { 'token'        : token,
                    // 'name'         : nameClaim,
                    'email'        : emailClaim,
                    'givenName'    : givenNameClaim,
                    'surname'      : surnameClaim,
                    // 'organisation' : orgClaim, commented out until ADFS claims are sorted
                    'tokenExp'     : expires },
                  emailClaim ];
  dbAuth.updateUser(fields, function (err) {
    if (err) {
      return cb(err, null);
    }
  });

  res.header('Location', process.env.OKR_EMBER + '/login?identification='+encodeURIComponent(token));
  res.send(302);
  return next();
};

// this routine is called from Ember login page and checks if the user has recently signed in with ADFS and if so will return the credentials to Ember
exports.adfsToken = function(req, res, next) {
  this.log = log.child({ action: 'adfsToken', token: token }); 
  var self = this;
  var token = null;
  token = decodeURIComponent(req.params.username);
  this.log.info('adfs log in attempt');

  async.waterfall([
    function authenticate(cb) {
      dbAuth.getUserByToken(token, function (err, user) {
        if (err) { 
          return cb(err, null); 
        }
        if (!user) { 
          res.send(401, null);
          return cb(401, null);
        }
        var tokenExp = moment(user.tokenExp).format('YYYY-MM-DD'),
            timeNow  = moment().format('YYYY-MM-DD');
        if (timeNow > tokenExp) { // if the token was issued by ADFS more than a day ago
          log.info('token has expired'); 
          return cb(new apiCommon.restify.InvalidCredentialsError('Expired token'), null);
        } else {
          return cb(null, user);
        }
      });
    },
    function checkVersionUpdate(user, cb) {
      if (user.lastVersionUpdate < common.latestVersion) { // get missed version updates for the user
        var fields = [user.lastVersionUpdate];
        var versionUpdates = '';
        dbVersionUpdate.getVersionUpdates(fields, function (err, updates) {
          if (err) {
            return cb(err, null);
          }
          for (var i in updates) {
            versionUpdates = versionUpdates + '<h3>' + 
                             updates[i].name + ' : ' + 
                             moment(updates[i].releaseDate).format('DD/MM/YYYY') + '</h3>' ;
            if (updates[i].id === common.latestVersion) {
              versionUpdates = versionUpdates + updates[i].description;
            } else {
              versionUpdates = versionUpdates + 'See detail in Help section';
            }
          }
          user.versionUpdate = versionUpdates;
          return cb(null, user); 
        });
      } else {
        return cb(null, user); 
      }
    },
    function updateLastVersion(user, cb) {
      if (user.versionUpdate) { // if there are new version updates we're showing them to the user so increment the user to the latest version
        var fields  = [{ 'lastVersionUpdate' : common.latestVersion },
                      user.name];
        dbAuth.updateUser(fields, function (err) {
          if (err) {
            return cb(err, null);
          }
        });
      }
      return cb(null, user);
    },
  ],
  function(err, result) {
    if (err) {
      self.log.error(err);
      return next(err);
    }
    let retval = { "access_token"      : token, 
                   "token_type"        : 'bearer',
                   "current_quarter"   : common.currentQuarter,
                   "user"              : result.givenName + ' ' + result.surname,
                   "organisation"      : result.organisation,
                   "organisation_name" : result.organisationName,
                   "role"              : result.role,
                   "user_organisation"      : result.organisation,
                   "user_organisation_name" : result.organisationName,
                   "user_role"              : result.role,
                   "version_update"    : result.versionUpdate };
    res.send(200, retval);
    self.log.info('log in success');
    return next();
  });
};


