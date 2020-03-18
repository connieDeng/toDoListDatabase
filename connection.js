const mysql = require('mysql');
// database configuration ===============================================================
var db = mysql.createConnection({
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b6034fb423fe74',
    password : 'c30bf13a',
    database : 'heroku_71ba344448d1b12',
});

db.connect((err) => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    
    console.error('connected');
});

module.exports = db;