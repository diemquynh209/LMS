const pool = require('../config/db');
const findUserByEmail = async(email)=>{
    const [rows]=await pool.query('SELECT*FROM Users WHERE email =?',[email]);
    return rows[0];
};
const createUser = async(fullName,email,hashedPassword,role)=>{
    const[result]=await pool.query('INSERT INTO Users(full_name,email,phone,password_hash,role) VALUES (?,?,?,?)',[fullName,email,phone,hashedPassword,role]);
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
const createInviteCode = async (email, inviteCode) => {
    const [result] = await pool.query(
        'INSERT INTO Instructor_Invites (email, invite_code, is_used) VALUES (?, ?, FALSE)',[email, inviteCode]
    );
    return result;
};
const getInstructors = async () => {
    const [rows] = await pool.query(
        "SELECT user_id, full_name, email,phone, created_at FROM Users WHERE role = 'Instructor' ORDER BY created_at DESC"
    );
    return rows;
};
const updateUserRole =async(userId,newRole)=>{
    const[result]=await pool.query('UPDATE Users SET role= ? WHERE user_id=?',[newRole,userId]);
    return result;
}
const deleteUser= async(userId)=>{
    const[result]=await pool.query('DELETE FROM Users WHERE user_id = ?',[userId]);
    return result;
}
const getStudents = async () => {
    const [rows] = await pool.query(
        'SELECT * FROM Users WHERE role = ?', 
        ['Student']
    );
    return rows;
};

module.exports = {
        findUserByEmail,
        createUser,
        checkInviteCode,
        burnInviteCode,
        createInviteCode,
        getInstructors,
        updateUserRole,
        deleteUser,
        getStudents
    };