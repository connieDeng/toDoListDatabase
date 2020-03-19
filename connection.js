const mysql = require('mysql');
const dbConfig = require("./db.config.js");

// database configuration ===============================================================
var db = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});


db.connect((err) => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    
    console.error('you have connected to the database successfully!');
});

db.end();

module.exports = db;