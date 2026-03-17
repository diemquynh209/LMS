const mysql = require('mysql2');
require('dotenv').config();
const pool = mysql.createPool({
host: 'localhost',
    user: 'root',
    password: '200901',
    database: 'lms_database',
    waitForConnections: true
})
const db= pool.promise();
db.getConnection()
    .then(() => console.log("Ket noi thanh cong voi mySQL"))
    .catch((err)=> console.error("Loi ket noi mySQL",err));
module.exports=db;