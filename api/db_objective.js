// Database related
'use strict';
var common   = require('./common'),
    log      = common.log,
    dbCommon = require('./db_common'),
    common   = require('./common'),
    pool     = dbCommon.pool;

exports.getObjectives = function (data, cb) {
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    let query = 'select * from objectiveKeyResultsConcat where organisation = ? and quarter = ?';
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

exports.getAllObjectives = function (data, cb) { // for list in addKeyResult
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    let query = 'select * from objective where ifnull(archived, false) = false and organisation = ?';
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

exports.getObjectivesWithIds = function (data, cb) {
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    let query = 'select * from objectiveKeyResultsConcat where id in (?) and quarter = ?';
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

exports.getObjective = function (data, cb) {
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    let query = 'select * from objectiveKeyResultsConcat where id = ?';
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

exports.postObjective = function (data, user, cb) {
  this.log = log.child({audit: true, method: 'post', entity: 'objective'}); 
  var self = this;
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    let query = 'insert into objective set ?';
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

exports.putObjective = function (data, user, cb) {
  this.log = log.child({audit: true, method: 'put', entity: 'objective', id: data[1]}); 
  var self = this;
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    let query = 'update objective set ? where id = ?';
    connection.query(query, data, function(err, rows){
      if(err) {
        log.error(err);
        connection.release();
        return cb(err);
      } else {
        connection.release();
        self.log.info({data: data[0], user: user});
        return cb(null, rows);
      }
    });
  });
};

exports.archiveObjective = function (data, user, cb) {
  this.log = log.child({audit: true, method: 'delete', entity: 'objective', id: data[0]}); 
  var self = this;
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    let query = 'update objective set archived = true where id = ?';
    connection.query(query, data, function(err, rows){
      if(err) {
        log.error(err);
        connection.release();
        return cb(err);
      } else {
        connection.release();
        self.log.info({user: user});
        return cb(null, rows);
      }
    });
  });
};
