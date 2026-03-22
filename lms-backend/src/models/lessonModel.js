const pool = require('../config/db');
const getAllReports = async (statusFilter = '') => {
    let query = `
        SELECT r.report_id, r.reason, r.status, r.created_at,
               l.lesson_id, l.lesson_name,
               u.full_name AS student_name, u.email AS student_email,
               c.class_name
        FROM Lesson_Reports r
        JOIN Lessons l ON r.lesson_id = l.lesson_id
        JOIN Chapters ch ON l.chapter_id = ch.chapter_id
        JOIN Classes c ON ch.class_id = c.class_id
        JOIN Users u ON r.student_id = u.user_id
        WHERE 1=1
    `;
    let params = [];

    if (statusFilter) {
        query += " AND r.status = ?";
        params.push(statusFilter);
    }

    query += " ORDER BY r.created_at DESC"; 

    const [rows] = await pool.query(query, params);
    return rows;
};

const updateReportStatus = async (reportId, newStatus) => {
    const [result] = await pool.query(
        'UPDATE Lesson_Reports SET status = ? WHERE report_id = ?',
        [newStatus, reportId]
    );
    return result;
};

const deleteLesson = async (lessonId) => {
    const [result] = await pool.query('DELETE FROM Lessons WHERE lesson_id = ?', [lessonId]);
    return result;
};

module.exports = {
    getAllReports,
    updateReportStatus,
    deleteLesson
};