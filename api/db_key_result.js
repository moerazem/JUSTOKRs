// Database related
'use strict';
var common   = require('./common'),
    log      = common.log,
    dbCommon = require('./db_common'),
    pool     = dbCommon.pool;

exports.getKeyResults = function (fields, cb) {
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    connection.query('select * from keyResultsConcat where ?', fields, function(err, rows){
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

exports.getKeyResultsForSummary = function (fields, cb) {
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    connection.query('select * from keyResultsConcat where organisation = ? and quarter = ? and committed = ?', fields, function(err, rows){
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

exports.getKeyResultsForObjective = function (fields, cb) {
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    connection.query('select * from keyResultsConcat where objective = ? and quarter = ?', fields, function(err, rows){
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

exports.getKeyResultsWithIds = function (data, cb) {
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    connection.query('select * from keyResultsConcat where id in (?)', data, function(err, rows){
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

exports.getKeyResult = function (data, cb) {
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    let query = 'select * from keyResultsConcat where id = ?';
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

exports.postKeyResult = function (data, user, cb) {
  this.log = log.child({audit: true, method: 'post', entity: 'keyResult'}); 
  var self = this;
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    // remove fields in dataset that are used for query and not for insert
    delete data.rag;
    delete data.completionHorizon;
    delete data.horizonHistory;
    delete data.status;
    delete data.commentary;
    delete data.teams;
    let query = 'insert into keyResult set ?';
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

exports.putKeyResult = function (data, user, cb) {
  this.log = log.child({audit: true, method: 'put', entity: 'keyResult', id: data[1]}); 
  var self = this;
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    // remove fields in dataset that are used for query and not for insert
    delete data[0].rag;
    delete data[0].completionHorizon;
    delete data[0].horizonHistory;
    delete data[0].status;
    delete data[0].commentary;
    delete data[0].teams;
    let query = 'update keyResult set ? where id = ?';
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

exports.archiveKeyResult = function (data, user, cb) {
  this.log = log.child({audit: true, method: 'delete', entity: 'keyResult', id: data[0]}); 
  var self = this;
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    let query = 'update keyResult set archived = true where id = ?';
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
