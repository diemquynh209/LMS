const mysql = require('mysql2');
require('dotenv').config();
const pool = mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: pocess.env.DB_NAME,
    waitForConnection: true,
    connectionLImit:10,
    queueLimit:0
})
const db= pool.promise();
db.getConnection()
    .then(() => console.log("Ket noi thanh cong voi mySQL"))
    .catch((err)=> console.error("Loi ket noi mySQL",err));