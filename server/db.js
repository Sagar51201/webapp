const mysql = require('mysql2');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "employee_management"
});

con.connect(function(err) {
    if (err) {
        console.error("Error connecting to MySQL:", err);
    } else {
        console.log("Connected to MySQL database successfully!");
    }
});

module.exports = con;
