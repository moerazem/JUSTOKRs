'use strict';
const restify          = require('restify'),
      common           = require('./common'),
      dbAuth           = require('./db_auth'),
      log              = common.log,
      passport         = require('passport'),
      passportBearer   = require('passport-http-bearer');
exports.restify        = restify;
exports.passport       = passport;
exports.passportBearer = passportBearer;
