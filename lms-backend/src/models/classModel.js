const pool = require('../config/db');

const ClassModel = {
    getClasses: async (searchTerm = '') => {
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
    },

    getMyClasses: async (instructorId, searchTerm = '') => {
        let query = `
            SELECT c.*, cat.category_name, COUNT(e.student_id) AS student_count
            FROM Classes c 
            LEFT JOIN Categories cat ON c.category_id = cat.category_id
            LEFT JOIN Enrollments e ON c.class_id = e.class_id AND e.status = 'Approved'
            WHERE c.instructor_id = ?
        `;
        let params = [instructorId];    
        if (searchTerm) {
            query += " AND c.class_name LIKE ?";
            params.push(`%${searchTerm}%`);
        }   
        query += " GROUP BY c.class_id ORDER BY c.created_at DESC";
        const [rows] = await pool.query(query, params);
        return rows;
    },

    createClass: async (instructorId, className, description, categoryId) => {
        const [result] = await pool.query(
            'INSERT INTO Classes (instructor_id, class_name, description, category_id, status) VALUES (?, ?, ?, ?, "Draft")',
            [instructorId, className, description, categoryId || null]
        );
        return result;
    },

    updateClassInfo: async (classId, instructorId, className, description, categoryId) => {
        const [result] = await pool.query(
            'UPDATE Classes SET class_name = ?, description = ?, category_id = ? WHERE class_id = ? AND instructor_id = ?',
            [className, description, categoryId || null, classId, instructorId]
        );
        return result;
    },

    removeStudentFromClass: async (classId, studentId) => {
        const [result] = await pool.query(
            'DELETE FROM Enrollments WHERE class_id = ? AND student_id = ?',
            [classId, studentId]
        );
        return result;
    },

    updateClassStatus: async (classId, status, instructorId = null) => {
        let query = 'UPDATE Classes SET status = ? WHERE class_id = ?';
        let params = [status, classId];
        
        if (instructorId) {
            query += ' AND instructor_id = ?';
            params.push(instructorId);
        }
        
        const [result] = await pool.query(query, params);
        return result;
    },

    deleteClass: async (classId) => {
        const [result] = await pool.query('DELETE FROM Classes WHERE class_id = ?', [classId]);
        return result;
    }
};

module.exports = ClassModel;