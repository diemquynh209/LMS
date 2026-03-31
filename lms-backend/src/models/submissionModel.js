const pool = require('../config/db');

const SubmissionModel = {
    getSubmissionsForAssignment: async (assignmentId) => {
        const query = `
            SELECT sub.*, u.full_name, u.email 
            FROM Assignment_Submissions sub
            JOIN Users u ON sub.student_id = u.user_id
            WHERE sub.assignment_id = ?
            ORDER BY sub.submitted_at DESC
        `;
        const [rows] = await pool.query(query, [assignmentId]);
        return rows;
    },

    gradeSubmission: async (submissionId, grade, feedback) => {
        const [result] = await pool.query(
            'UPDATE Assignment_Submissions SET grade = ?, feedback = ?, status = "Graded" WHERE submission_id = ?',
            [grade, feedback, submissionId]
        );
        return result;
    }
};

module.exports = SubmissionModel;