// Database related
'use strict';
var common   = require('./common'),
    log      = common.log,
    dbCommon = require('./db_common'),
    pool     = dbCommon.pool;

exports.getUser = function(token, cb) {
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    connection.query('select * from userOrganisation where token = ?', token, function(err, rows){
      if(err) {
        log.error(err);
        connection.release();
        return cb(err);
      } else {
        connection.release();
        if (rows.length === 0) {
          return cb(null, null);
        } else {
          return cb(null, rows[0]);
        }
      }
    });
  });
};

exports.validateUser = function (credentials, cb) {
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    connection.query('select u.name, u.resetPassword, u.lastVersionUpdate from user u where u.name = ? and u.password = ?', credentials, function(err, rows){
      if(err) {
        log.error(err);
        connection.release();
        return cb(err);
      } else {
        connection.release();
        return cb(null, rows);
      }
    });
  });
};

exports.updateUser = function (fields, cb) {
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    connection.query('update user set ? where name = ?', fields, function(err, rows){
      if(err) {
        log.error(err);
        connection.release();
        return cb(err);
      } else {
        connection.release();
        return cb(null, rows);
      }
    });
  });
};
