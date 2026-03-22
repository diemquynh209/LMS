const pool = require('../config/db');
const getClasses = async (searchTerm = '') => {
   
    let query = `
        SELECT c.*, u.full_name AS instructor_name FROM Classes c 
        LEFT JOIN Users u ON c.instructor_id = u.user_id WHERE 1=1
        `;
    let params = [];
    if (searchTerm) {
        query += " AND (c.class_name LIKE ? OR u.full_name LIKE ?)";
        const likeTerm = `%${searchTerm}%`;
        params.push(likeTerm, likeTerm);
    }

    const [rows] = await pool.query(query, params);
    return rows;
};
const deleteClass = async (classId) => {
    const [result] = await pool.query('DELETE FROM Classes WHERE class_id = ?', [classId]);
    return result;
};
module.exports = {
    getClasses,
    deleteClass
};