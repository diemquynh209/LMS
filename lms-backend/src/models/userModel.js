const pool = require('../config/db');
const findUserByEmail = async(email)=>{
    const [rows]=await pool.query('SELECT*FROM Users WHERE email =?',[email]);
    return rows[0];
};
const createUser = async(fullName,email,phone,hashedPassword,role)=>{
    const[result]=await pool.query('INSERT INTO Users(full_name,email,phone,password_hash,role) VALUES (?,?,?,?,?)',[fullName,email,phone,hashedPassword,role]);
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
const getInstructors = async (searchTerm = '') => {
    let query = `
        SELECT u.*, GROUP_CONCAT(c.class_name SEPARATOR ', ') AS classes 
        FROM Users u 
        LEFT JOIN Classes c ON u.user_id = c.instructor_id 
        WHERE u.role = 'Instructor'
    `;
    let params = [];
    
    if (searchTerm) {
        query += " AND (u.full_name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)";
        const likeTerm = `%${searchTerm}%`;
        params.push(likeTerm, likeTerm, likeTerm); 
    }
    
    query += " GROUP BY u.user_id";
    const [rows] = await pool.query(query, params);
    return rows;
};
const updateUserRole = async (userId, newRole) => {
    const [result] = await pool.query('UPDATE Users SET role = ? WHERE user_id = ?', [newRole, userId]);
    if (newRole === 'Student') {
        await pool.query('DELETE FROM Classes WHERE instructor_id = ?', [userId]);
    }
    return result;
};
const deleteUser= async(userId)=>{
    const[result]=await pool.query('DELETE FROM Users WHERE user_id = ?',[userId]);
    return result;
};
const getStudents = async (searchTerm = '') => {
    let query = `
        SELECT u.*, GROUP_CONCAT(c.class_name SEPARATOR ', ') AS classes 
        FROM Users u 
        LEFT JOIN Enrollments e ON u.user_id = e.student_id 
        LEFT JOIN Classes c ON e.class_id = c.class_id 
        WHERE u.role = 'Student'
    `;
    let params = [];
    if (searchTerm) {
        query += " AND (u.full_name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)";
        const likeTerm = `%${searchTerm}%`;
        params.push(likeTerm, likeTerm, likeTerm); 
    }
    query += " GROUP BY u.user_id";
    const [rows] = await pool.query(query, params);
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