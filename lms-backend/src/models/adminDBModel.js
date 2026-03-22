const pool = require('../config/db');
const getDashboardStats = async () => {
    const [
        [students],
        [instructors],
        [classes],
        [enrollments],
        [reports],
        [classStats]
    ] = await Promise.all([
        pool.query("SELECT COUNT(*) as total FROM Users WHERE role = 'Student'"),
        pool.query("SELECT COUNT(*) as total FROM Users WHERE role = 'Instructor'"),
        pool.query("SELECT COUNT(*) as total FROM Classes"),
        pool.query("SELECT COUNT(*) as total FROM Enrollments"),
        pool.query("SELECT COUNT(*) as total FROM Lesson_Reports WHERE status = 'Pending'"),
        pool.query("SELECT status, COUNT(*) as count FROM Classes GROUP BY status")
    ]);
    return {
        totalStudents: students[0].total,
        totalInstructors: instructors[0].total,
        totalClasses: classes[0].total,
        totalEnrollments: enrollments[0].total,
        pendingReports: reports[0].total,
        pieChartData: classStats 
    };
};

module.exports = {
    getDashboardStats
};