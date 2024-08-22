const mysql = require('mysql')
require('dotenv').config()
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

connection.connect();

// connection.query('', function (error, results, fields) {
//     if (error) throw error;
//     console.log('The solution is: ', results);
// });

module.exports = connection

// create table schools (id primary key serial, name varchar(50), address varchar(100), latitude float, longitude float)