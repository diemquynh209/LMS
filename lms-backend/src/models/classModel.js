const pool = require('../config/db');

const ClassModel = {
    // Admin thấy tất cả, bao gồm cả lớp Deleted
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
        query += " GROUP BY c.class_id ORDER BY c.created_at DESC";
        const [rows] = await pool.query(query, params);
        return rows;
    },

    // Giảng viên KHÔNG thấy các lớp đã bị Admin xóa mềm
    getMyClasses: async (instructorId, searchTerm = '') => {
        let query = `
            SELECT c.*, cat.category_name, COUNT(e.student_id) AS student_count
            FROM Classes c 
            LEFT JOIN Categories cat ON c.category_id = cat.category_id
            LEFT JOIN Enrollments e ON c.class_id = e.class_id AND e.status = 'Approved'
            WHERE c.instructor_id = ? AND c.status != 'Deleted' 
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

    createClass: async (instructorId, className, description, categoryId, imageUrl) => {
        const [result] = await pool.query(
            'INSERT INTO Classes (instructor_id, class_name, description, category_id, image_url, status) VALUES (?, ?, ?, ?, ?, "Draft")',
            [instructorId, className, description, categoryId || null, imageUrl || null]
        );
        return result;
    },

    updateClassInfo: async (classId, instructorId, className, description, categoryId, imageUrl) => {
        let query = 'UPDATE Classes SET class_name = ?, description = ?, category_id = ?';
        let params = [className, description, categoryId || null];
        if (imageUrl) {
            query += ', image_url = ?';
            params.push(imageUrl);
        }

        query += ' WHERE class_id = ? AND instructor_id = ?';
        params.push(classId, instructorId);

        const [result] = await pool.query(query, params);
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

    //Xóa mềm
    deleteClass: async (classId) => {
        const [result] = await pool.query("UPDATE Classes SET status = 'Deleted' WHERE class_id = ?", [classId]);
        return result;
    },

    getStudentsByClass: async (classId, instructorId) => {
        const [rows] = await pool.query(`
            SELECT 
                u.user_id, 
                u.full_name, 
                u.email, 
                u.phone, 
                u.status,
                u.date_of_birth, /* <--- THÊM DÒNG NÀY */
                (
                    SELECT GROUP_CONCAT(c2.class_name SEPARATOR ', ')
                    FROM Enrollments e2
                    JOIN Classes c2 ON e2.class_id = c2.class_id
                    WHERE e2.student_id = u.user_id 
                      AND c2.instructor_id = ? 
                      AND e2.status = 'Approved'
                      AND c2.status != 'Deleted'
                ) AS classes
            FROM Enrollments e
            JOIN Users u ON e.student_id = u.user_id
            JOIN Classes c ON e.class_id = c.class_id
            WHERE e.class_id = ? AND c.instructor_id = ? AND e.status = 'Approved'
        `, [instructorId, classId, instructorId]);
        return rows;
    },

    getAllStudentsByInstructor: async (instructorId) => {
        const [rows] = await pool.query(`
            SELECT DISTINCT
                u.user_id, 
                u.full_name, 
                u.email, 
                u.phone, 
                u.status,
                u.date_of_birth,
                (
                    SELECT GROUP_CONCAT(c2.class_name SEPARATOR ', ')
                    FROM Enrollments e2
                    JOIN Classes c2 ON e2.class_id = c2.class_id
                    WHERE e2.student_id = u.user_id 
                      AND c2.instructor_id = ? 
                      AND e2.status = 'Approved'
                      AND c2.status != 'Deleted'
                ) AS classes
            FROM Enrollments e
            JOIN Users u ON e.student_id = u.user_id
            JOIN Classes c ON e.class_id = c.class_id
            WHERE c.instructor_id = ? AND e.status = 'Approved'
        `, [instructorId, instructorId]);
        return rows;
    },
};

module.exports = ClassModel;