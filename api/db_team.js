// Database related
'use strict';
var common   = require('./common'),
    log      = common.log,
    dbCommon = require('./db_common'),
    pool     = dbCommon.pool;

exports.getTeams = function (data, cb) {
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    connection.query('select * from team where ifnull(archived, false) = false and organisation = ? order by name', data, function(err, rows){
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

exports.getAllTeams = function (cb) {
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    connection.query('select * from team where ifnull(archived, false) = false order by name', function(err, rows){
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

exports.getTeamsByQuarter = function (data, cb) {
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    connection.query('select * from teamDeliverablesConcat where organisation = ? and (quarter = ? or quarter is null)', data, function(err, rows){
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

exports.getTeamsById = function (data, cb) {
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    connection.query('select * from teamDeliverablesConcat where id in (?)', data, function(err, rows){
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

exports.getTeam = function (data, cb) {
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    let query = 'select * from teamDeliverablesConcat where id = ?';
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

exports.postTeam = function (data, user, cb) {
  this.log = log.child({audit: true, method: 'post', entity: 'team'}); 
  var self = this;
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    let query = 'insert into team set ?';
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

exports.putTeam = function (data, user, cb) {
  this.log = log.child({audit: true, method: 'put', entity: 'team', id: data[1]}); 
  var self = this;
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    let query = 'update team set ? where id = ?';
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

exports.archiveTeam = function (data, user, cb) {
  this.log = log.child({audit: true, method: 'delete', entity: 'team', id: data[0]}); 
  var self = this;
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    let query = 'update team set archived = true where id = ?';
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
