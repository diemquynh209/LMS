const mysql = require('mysql2/promise');
require('dotenv').config();
const pool = mysql.createPool({
host: 'localhost',
    user: 'root',
    password: '200901',
    database: 'lms_database',
    waitForConnections: true
})
module.exports=pool;