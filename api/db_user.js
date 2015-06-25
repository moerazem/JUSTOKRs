// Database related
'use strict';
var common   = require('./common'),
    log      = common.log,
    dbCommon = require('./db_common'),
    pool     = dbCommon.pool;

exports.getAllUsers = function (cb) {
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    let query = 'select id, name, email, givenName, surname, organisation, team, role, staffNumber from user order by name';
    connection.query(query, function(err, rows){
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

exports.getTeamUsers = function (data, cb) {
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    let query = 'select id, name, email, givenName, surname, organisation, team, role, staffNumber from user where team = ? order by name';
    connection.query(query, data, function(err, rows){
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

exports.getUser = function (data, cb) {
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    let query = 'select id, name, email, givenName, surname, organisation, team, role, staffNumber from user where id = ?';
    connection.query(query, data, function(err, rows){
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

exports.postUser = function (data, user, cb) {
  this.log = log.child({audit: true, method: 'post', entity: 'user'}); 
  var self = this;
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    let query = 'insert into user set ?';
    connection.query(query, data, function(err, rows){
      if(err) {
        log.error(err);
        connection.release();
        return cb(err);
      } else {
        connection.release();
        self.log.info({data: data, user: user, id: rows.insertId});
        return cb(null, rows);
      }
    });
  });
};

exports.putUser = function (data, user, cb) {
  this.log = log.child({audit: true, method: 'put', entity: 'user', id: data[1]}); 
  var self = this;
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    let query = 'update user set ? where id = ?';
    connection.query(query, data, function(err, rows){
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
