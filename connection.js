const mysql = require('mysql');
const dbConfig = require("./db.config.js");

// database configuration ===============================================================
var connection = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});

connection.end();

module.exports = connection;