const mysql = require('mysql');
// database configuration ===============================================================
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '0887Deng!',
    database : 'tododb'
});

db.connect((err) => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    
    console.error('connected');
});

module.exports = db;