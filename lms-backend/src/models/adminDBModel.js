const pool = require('../config/db');

const AdminDBModel = {
    getDashboardStats: async () => {
        const [
            [students],
            [instructors],
            [classes],
            [enrollments],
            [reports],
            [classStats],
            [topClasses] 
        ] = await Promise.all([
            pool.query("SELECT COUNT(*) as total FROM Users WHERE role = 'Student'"),
            pool.query("SELECT COUNT(*) as total FROM Users WHERE role = 'Instructor'"),
            pool.query("SELECT COUNT(*) as total FROM Classes"),
            pool.query("SELECT COUNT(*) as total FROM Enrollments"),
            pool.query("SELECT COUNT(*) as total FROM Lesson_Reports WHERE status = 'Pending'"),
            pool.query("SELECT status, COUNT(*) as count FROM Classes GROUP BY status"),
            
            pool.query(`
                SELECT c.class_name, COUNT(e.student_id) as student_count 
                FROM Classes c 
                LEFT JOIN Enrollments e ON c.class_id = e.class_id AND e.status = 'Approved'
                GROUP BY c.class_id 
                ORDER BY student_count DESC 
                LIMIT 5
            `)
        ]);   
        return {
            totalStudents: students[0].total,
            totalInstructors: instructors[0].total,
            totalClasses: classes[0].total,
            totalEnrollments: enrollments[0].total,
            pendingReports: reports[0].total,
            pieChartData: classStats,
            topClasses: topClasses
        };
    }
};

module.exports = AdminDBModel;