const pool = require('../config/db');
const findByEmail = async(email)=>{
    const [rows]=await pool.query('SELECT*FROM Users WHERE email =?',[email]);
    return rows[0];
};
const createUser = async(fullName,email,password,role)=>{
    const[result]=await pool.query('INSERT INTO Users(full_name,email,password_hash,role) VALUES (?,?,?,?)',[fullName,email,hashesPassword,role]);
    return result;
};

module.exports = {findByEmail,createUser};