'use strict';
const common = require('./common');
const mysql = require('mysql');

exports.pool = mysql.createPool({
  host               : process.env.OKR_DB_HOST,
  user               : process.env.OKR_DB_USER,
  password           : process.env.OKR_DB_PASS,
  database           : process.env.OKR_DB_DB,
  waitForConnections : true,
  connectionLimit    : common.concurrentProcesses,
  queueLimit         : 0
});
