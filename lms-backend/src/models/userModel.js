const pool = require('../config/db');

const UserModel = {
    findUserByEmail: async (email) => {
        const [rows] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
        return rows[0];
    },

    createUser: async (fullName, email, phone, hashedPassword, role) => {
        const [result] = await pool.query(
            'INSERT INTO Users(full_name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)',
            [fullName, email, phone, hashedPassword, role]
        );
        return result;
    },

    getInstructors: async (searchTerm = '') => {
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
    },

    updateUserRole: async (userId, newRole) => {
        const [result] = await pool.query('UPDATE Users SET role = ? WHERE user_id = ?', [newRole, userId]);
        if (newRole === 'Student') {
            await pool.query('DELETE FROM Classes WHERE instructor_id = ?', [userId]);
        }
        return result;
    },

    deleteUser: async (userId) => {
        const [result] = await pool.query('DELETE FROM Users WHERE user_id = ?', [userId]);
        return result;
    },

    getStudents: async (searchTerm = '') => {
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
    },

    checkDuplicateInfo: async (email, phone, userId) => {
        const [rows] = await pool.query(
            'SELECT * FROM Users WHERE (email = ? OR phone = ?) AND user_id != ?',
            [email, phone, userId]
        );
        return rows;
    },

    updateProfile: async (userId, fullName, email, phone, avatarUrl) => {
        let query = 'UPDATE Users SET full_name = ?, email = ?, phone = ?';
        let params = [fullName, email, phone];

        // Nếu có upload ảnh mới thì mới update cột avatar_url
        if (avatarUrl) {
            query += ', avatar_url = ?';
            params.push(avatarUrl);
        }

        query += ' WHERE user_id = ?';
        params.push(userId);

        const [result] = await pool.query(query, params);
        return result;
    },
};

module.exports = UserModel;