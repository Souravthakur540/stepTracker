const mysql = require('mysql2')

let connection = mysql.createConnection({
    user: 'root',
    password: 'password',
    localhost: 'localhost',
    database: 'steptracker'
})

module.exports = connection;