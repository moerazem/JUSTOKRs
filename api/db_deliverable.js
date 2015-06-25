// Database related
'use strict';
var common   = require('./common'),
    log      = common.log,
    dbCommon = require('./db_common'),
    pool     = dbCommon.pool;

exports.getDeliverables = function (fields, cb) {
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    connection.query('select * from deliverablesConcat where quarter = ? and organisation = ?', fields, function(err, rows){
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

exports.getDeliverablesForTeam = function (data, cb) {
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    connection.query('select * from deliverablesConcat where team = ? and quarter = ?', data, function(err, rows){
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

exports.getDeliverablesWithIds = function (data, cb) {
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    connection.query('select * from deliverablesConcat where id in (?)', data, function(err, rows){
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

exports.getDeliverable = function (data, cb) {
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    let query = 'select * from deliverablesConcat where id = ?';
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

exports.postDeliverable = function (data, user, cb) {
  this.log = log.child({audit: true, method: 'put', entity: 'deliverable', id: data[1]}); 
  var self = this;
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    // remove fields in dataset that are used for query and not for insert
    delete data.status;
    delete data.commentary;
    delete data.updateDate;
    delete data.countryFlag;
    delete data.teamFlag;
    delete data.deliveryDate;
    let query = 'insert into deliverable set ?';
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

exports.putDeliverable = function (data, user, cb) {
  this.log = log.child({audit: true, method: 'put', entity: 'deliverable', id: data[1]}); 
  var self = this;
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    // remove fields in dataset that are used for query and not for insert
    delete data[0].status;
    delete data[0].commentary;
    delete data[0].updateDate;
    delete data[0].countryFlag;
    delete data[0].teamFlag;
    delete data[0].deliveryDate;
    let query = 'update deliverable set ? where id = ?';
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

exports.archiveDeliverable = function (data, user, cb) {
  this.log = log.child({audit: true, method: 'delete', entity: 'deliverable', id: data[0]}); 
  var self = this;
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    let query = 'update deliverable set archived = true where id = ?';
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
