const pool = require('../config/db');
const findUserByEmail = async(email)=>{
    const [rows]=await pool.query('SELECT*FROM Users WHERE email =?',[email]);
    return rows[0];
};
const createUser = async(fullName,email,password,role)=>{
    const[result]=await pool.query('INSERT INTO Users(full_name,email,password_hash,role) VALUES (?,?,?,?)',[fullName,email,password,role]);
    return result;
};
//xu ly ma moi cho gvien
const checkInviteCode = async (email,inviteCode)=>{
    const[rows]= await pool.query('SELECT*FROM Instructor_Invites WHERE email = ? AND invite_code = ? AND is_used = FALSE',[email, inviteCode]);
    return rows[0];
};
const burnInviteCode =async(email, inviteCode)=>{
    await pool.query('UPDATE Instructor_Invites SET is_used = TRUE WHERE email = ? AND invite_code =?', [email,inviteCode]);
};

module.exports = {findUserByEmail,createUser,checkInviteCode,burnInviteCode};