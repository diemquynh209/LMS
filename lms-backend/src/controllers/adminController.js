const nodemailer = require('nodemailer');
const crypto = require('crypto');
const pool = require('../config/db');
const UserModel = require('../models/userModel');
const ClassModel = require('../models/classModel');
const LessonModel = require('../models/lessonModel');
const AdminDBModel = require('../models/adminDBModel');
const CategoryModel = require('../models/categoryModel');
const InviteModel = require('../models/inviteModel');
const ReportModel = require('../models/reportModel');

const adminController = {
    sendInstructorInvite: async (req, res) => {
        const { instructorEmail } = req.body;

        if (!instructorEmail) {
            return res.status(400).json({ message: "Vui lòng cung cấp email của giảng viên." });
        }
        try {
            const inviteCode = crypto.randomBytes(3).toString('hex').toUpperCase(); 
            await InviteModel.createInviteCode(instructorEmail, inviteCode); // Đã đổi

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: `"Hệ thống LMS" <${process.env.EMAIL_USER}>`,
                to: instructorEmail,
                subject: 'Thư mời tham gia giảng dạy Hệ thống LMS',
                html: `
                    <h3>Chào bạn,</h3>
                    <p>Bạn đã được Quản trị viên mời tham gia giảng dạy tại Hệ thống LMS.</p>
                    <p>Mã mời đăng ký tài khoản Giảng viên của bạn là: <b>${inviteCode}</b></p>
                    <p>Vui lòng truy cập trang web của chúng tôi, chọn mục Đăng ký và điền mã này vào ô "Mã mời".</p>
                    <p>Trân trọng,</p>
                    <p>Ban Quản Trị LMS</p>
                `
            };

            await transporter.sendMail(mailOptions);
            return res.status(200).json({ message: "Đã tạo mã và gửi email thành công!" });

        } catch (error) {
            console.error("Lỗi khi gửi email mời:", error);
            return res.status(500).json({ message: "Lỗi máy chủ khi tạo mã mời." });
        }
    },

    getAllInstructors: async (req, res) => {
        try {
            const searchTerm = req.query.search || '';
            const instructors = await UserModel.getInstructors(searchTerm);
            return res.status(200).json(instructors);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách giảng viên", error);
            return res.status(500).json({ message: "Lỗi máy chủ khi lấy dữ liệu" });
        }
    },

    changeUserRole: async (req, res) => {
        const { userId, newRole } = req.body;
        try {
            await UserModel.updateUserRole(userId, newRole);
            res.status(200).json({ message: "Cập nhật quyền thành công" });
        } catch (error) {
            console.log("LỖI ĐỔI QUYỀN :", error);
            res.status(500).json({ message: "Lỗi khi cập nhật quyền" });
        }
    },

    toggleUserStatus: async (req, res) => {
        try {
            const userId = req.params.id;
            const { status } = req.body; // Nhận 'Active' hoặc 'Locked' từ Frontend gửi lên
            
            if (!['Active', 'Locked'].includes(status)) {
                return res.status(400).json({ message: "Trạng thái không hợp lệ." });
            }

            await UserModel.updateUserStatus(userId, status);
            
            const message = status === 'Locked' 
                ? "Đã khóa tài khoản thành công!" 
                : "Đã mở khóa tài khoản thành công!";
                
            res.status(200).json({ message });
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái User:", error);
            res.status(500).json({ message: "Lỗi server khi cập nhật tài khoản." });
        }
    },

    getStudents: async (req, res) => {
        try {
            const searchTerm = req.query.search || '';
            const students = await UserModel.getStudents(searchTerm);
            res.status(200).json(students);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi lấy danh sách học viên." });
        }
    },

    getAllClasses: async (req, res) => {
        try {
            const searchTerm = req.query.search || '';
            const classes = await ClassModel.getClasses(searchTerm);
            res.status(200).json(classes);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi lấy danh sách lớp học." });
        }
    },

    deleteClass: async (req, res) => {
        try {
            const classId = req.params.id;
            // Kiểm tra trạng thái của lớp trước khi cho phép xóa
            const [rows] = await pool.query('SELECT status FROM Classes WHERE class_id = ?', [classId]);
            if (rows.length === 0) {
                return res.status(404).json({ message: "Không tìm thấy lớp học!" });
            }

            //Chỉ Admin mới được xóa, và chỉ xóa khi lớp đang 'Closed'
            if (rows[0].status !== 'Closed') {
                return res.status(403).json({ 
                    message: "Từ chối: Bạn chỉ được phép xóa các lớp học đang ở trạng thái 'Closed'!" 
                });
            }

            await ClassModel.deleteClass(classId); // Gọi xóa mềm
            res.status(200).json({ message: "Đã xóa lớp học thành công!" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi xóa lớp học." });
        }
    },

    getLessonReports: async (req, res) => {
        try {
            const statusFilter = req.query.status || '';
            const reports = await ReportModel.getAllReports(statusFilter); // Dùng ReportModel
            res.status(200).json(reports);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi lấy báo cáo." });
        }
    },

    updateReportStatus: async (req, res) => {
        try {
            const reportId = req.params.id;
            const { status } = req.body;
            await ReportModel.updateReportStatus(reportId, status); // Dùng ReportModel
            res.status(200).json({ message: "Đã cập nhật trạng thái báo cáo!" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi cập nhật báo cáo." });
        }
    },

    deleteLesson: async (req, res) => {
        try {
            const lessonId = req.params.id;
            await LessonModel.deleteLesson(lessonId);
            res.status(200).json({ message: "Đã xóa bài giảng thành công!" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi xóa bài giảng." });
        }
    },

    getDashboardData: async (req, res) => {
        try {
            const stats = await AdminDBModel.getDashboardStats();
            res.status(200).json(stats);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi lấy thống kê." });
        }
    },

    getCategories: async (req, res) => {
        try {
            const categories = await CategoryModel.getAllCategories();
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi lấy danh mục." });
        }
    },

    createCategory: async (req, res) => {
        try {
            const { category_name, description } = req.body;
            if (!category_name) return res.status(400).json({ message: "Tên danh mục không được để trống!" });
            
            await CategoryModel.addCategory(category_name, description);
            res.status(201).json({ message: "Đã tạo danh mục thành công!" });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: "Tên danh mục này đã tồn tại!" });
            }
            res.status(500).json({ message: "Lỗi server khi tạo danh mục." });
        }
    },

    updateCategory: async (req, res) => {
        try {
            const oldCategoryId = req.params.id;
            const { category_name, description } = req.body; 
            const existingCategory = await CategoryModel.getCategoryByName(category_name);
            if (existingCategory && existingCategory.category_id.toString() !== oldCategoryId.toString()) {
                const targetCategoryId = existingCategory.category_id;

                await CategoryModel.moveClassesToNewCategory(oldCategoryId, targetCategoryId);
                await CategoryModel.deleteCategory(oldCategoryId);

                return res.status(200).json({ 
                    message: `Đã gộp thành công các lớp học vào danh mục "${category_name}" và xóa danh mục cũ!` 
                });
            }

            await CategoryModel.updateCategory(oldCategoryId, category_name, description);
            res.status(200).json({ message: "Cập nhật danh mục thành công!" });

        } catch (error) {
            console.error("Lỗi khi cập nhật/gộp danh mục:", error);
            res.status(500).json({ message: "Lỗi server khi cập nhật danh mục." });
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const categoryId = req.params.id;
            await CategoryModel.deleteCategory(categoryId);
            res.status(200).json({ message: "Đã xóa danh mục!" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi xóa danh mục." });
        }
    },

updateClassStatus: async (req, res) => {
        try {
            const classId = req.params.id;
            const { status } = req.body;
            
            if (!['Draft', 'Published', 'Closed', 'Deleted'].includes(status)) {
                return res.status(400).json({ message: "Trạng thái không hợp lệ." });
            }
            
            await ClassModel.updateClassStatus(classId, status);
            res.status(200).json({ message: "Cập nhật trạng thái thành công!" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi cập nhật trạng thái." });
        }
    }
};

module.exports = adminController;