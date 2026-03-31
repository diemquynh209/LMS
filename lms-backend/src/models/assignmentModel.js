const pool = require('../config/db');

const AssignmentModel = {
    createAssignment: async (lessonId, title, description, dueDate) => {
        const [result] = await pool.query(
            'INSERT INTO Assignments (lesson_id, title, description, due_date) VALUES (?, ?, ?, ?)',
            [lessonId, title, description, dueDate]
        );
        return result;
    },

    getAssignmentsByLesson: async (lessonId) => {
        const [rows] = await pool.query(
            'SELECT * FROM Assignments WHERE lesson_id = ? ORDER BY due_date ASC',
            [lessonId]
        );
        return rows;
    },

    deleteAssignment: async (assignmentId) => {
        const [result] = await pool.query('DELETE FROM Assignments WHERE assignment_id = ?', [assignmentId]);
        return result;
    }
};

module.exports = AssignmentModel;