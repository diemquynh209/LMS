const pool = require('../config/db');
const getClasses = async (searchTerm = '') => {
    let query = `
        SELECT c.*, u.full_name AS instructor_name, COUNT(e.student_id) AS student_count
        FROM Classes c 
        LEFT JOIN Users u ON c.instructor_id = u.user_id 
        LEFT JOIN Enrollments e ON c.class_id = e.class_id AND e.status = 'Approved'
        WHERE 1=1
    `;
    let params = [];  
    if (searchTerm) {
        query += " AND (c.class_name LIKE ? OR u.full_name LIKE ?)";
        const likeTerm = `%${searchTerm}%`;
        params.push(likeTerm, likeTerm);
    }
    query += " GROUP BY c.class_id";
    const [rows] = await pool.query(query, params);
    return rows;
};

const deleteClass = async (classId) => {
    const [result] = await pool.query('DELETE FROM Classes WHERE class_id = ?', [classId]);
    return result;
};

const updateClassStatus = async (classId, newStatus) => {
    const [result] = await pool.query(
        'UPDATE Classes SET status = ? WHERE class_id = ?',
        [newStatus, classId]
    );
    return result;
};
module.exports = {
    getClasses,
    deleteClass,
    updateClassStatus
};