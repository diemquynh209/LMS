const nodemailer = require('nodemailer');
const crypto = require('crypto');
const userModel = require('../models/userModel');
const classModel = require('../models/classModel');
const lessonModel = require('../models/lessonModel');
const dashboardModel = require('../models/adminDBModel')
const categoryModel = require('../models/categoryModel');

const sendInstructorInvite = async (req, res) => {
    const { instructorEmail } = req.body;

    if (!instructorEmail) {
        return res.status(400).json({ message: "Vui lòng cung cấp email của giảng viên." });
    }
    try {
        const inviteCode = crypto.randomBytes(3).toString('hex').toUpperCase(); //Sinh ma moi ngau nhien
        await userModel.createInviteCode(instructorEmail, inviteCode);

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
        return res.status(200).json({ 
            message: "Đã tạo mã và gửi email thành công!",
        });

    } catch (error) {
        console.error("Lỗi khi gửi email mời:", error);
        return res.status(500).json({ message: "Lỗi máy chủ khi tạo mã mời." });
    }
};

const getAllInstructors = async (req,res)=>{
    try{
        const searchTerm = req.query.search || '';
        const instructors =await userModel.getInstructors(searchTerm);
        return res.status(200).json(instructors);
    }catch(error){
        console.error("Lỗi khi lấy danh sách giảng viên",error);
        return res.status(500).json({message:"Lỗi máy chủ khi lấy dữ liệu"});
    }
};

const changeUserRole= async(req,res)=>{
    const{userId,newRole}=req.body;
    try{
        await userModel.updateUserRole(userId,newRole);
        res.status(200).json({message:"Cập nhật quyền thành công"});
    }catch(error){
        console.log("LỖI ĐỔI QUYỀN :", error);
        res.status(500).json({message:"Lỗi khi cập nhật quyền"});
    }
};

const removeUser = async (req, res) => {
    const { id } = req.params;
    try {
        await userModel.deleteUser(id);
        res.status(200).json({ message: "Đã xóa tài khoản thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa tài khoản." });
    }
};

const getStudents = async (req, res) => {
    try {
        const searchTerm = req.query.search || '';
        const students = await userModel.getStudents(searchTerm);
        res.status(200).json(students);
    } catch (error) {
        console.log("🚨 LỖI LẤY DANH SÁCH HỌC VIÊN:", error);
        res.status(500).json({ message: "Lỗi server khi lấy danh sách học viên." });
    }
};
const getAllClasses = async (req, res) => {
    try {
        const searchTerm = req.query.search || '';
        const classes = await classModel.getClasses(searchTerm);
        res.status(200).json(classes);
    } catch (error) {
        console.log("🚨 LỖI LẤY DANH SÁCH LỚP HỌC:", error);
        res.status(500).json({ message: "Lỗi server khi lấy danh sách lớp học." });
    }
};
const deleteClass = async (req, res) => {
    try {
        const classId = req.params.id;
        await classModel.deleteClass(classId);
        res.status(200).json({ message: "Đã xóa lớp học thành công!" });
    } catch (error) {
        console.log("🚨 LỖI XÓA LỚP HỌC:", error);
        res.status(500).json({ message: "Lỗi server khi xóa lớp học." });
    }
};

const getLessonReports = async (req, res) => {
    try {
        const statusFilter = req.query.status || '';
        const reports = await lessonModel.getAllReports(statusFilter);
        res.status(200).json(reports);
    } catch (error) {
        console.log("🚨 LỖI LẤY DANH SÁCH BÁO CÁO:", error);
        res.status(500).json({ message: "Lỗi server khi lấy báo cáo." });
    }
};

const updateReportStatus = async (req, res) => {
    try {
        const reportId = req.params.id;
        const { status } = req.body;
        await lessonModel.updateReportStatus(reportId, status);
        res.status(200).json({ message: "Đã cập nhật trạng thái báo cáo!" });
    } catch (error) {
        console.log("🚨 LỖI CẬP NHẬT TRẠNG THÁI BÁO CÁO:", error);
        res.status(500).json({ message: "Lỗi server khi cập nhật báo cáo." });
    }
};

const deleteLesson = async (req, res) => {
    try {
        const lessonId = req.params.id;
        await lessonModel.deleteLesson(lessonId);
        res.status(200).json({ message: "Đã xóa bài giảng thành công!" });
    } catch (error) {
        console.log("🚨 LỖI XÓA BÀI GIẢNG:", error);
        res.status(500).json({ message: "Lỗi server khi xóa bài giảng." });
    }
};
const getDashboardData = async (req, res) => {
    try {
        const stats = await dashboardModel.getDashboardStats();
        res.status(200).json(stats);
    } catch (error) {
        console.log("🚨 LỖI LẤY DỮ LIỆU DASHBOARD:", error);
        res.status(500).json({ message: "Lỗi server khi lấy thống kê." });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await categoryModel.getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        console.log("🚨 LỖI LẤY DANH MỤC:", error);
        res.status(500).json({ message: "Lỗi server khi lấy danh mục." });
    }
};

const createCategory = async (req, res) => {
    try {
        const { category_name, description } = req.body;
        if (!category_name) return res.status(400).json({ message: "Tên danh mục không được để trống!" });
        
        await categoryModel.addCategory(category_name, description);
        res.status(201).json({ message: "Đã tạo danh mục thành công!" });
    } catch (error) {
        console.log("🚨 LỖI TẠO DANH MỤC:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "Tên danh mục này đã tồn tại!" });
        }
        res.status(500).json({ message: "Lỗi server khi tạo danh mục." });
    }
};
const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { category_name, description } = req.body;
        await categoryModel.updateCategory(categoryId, category_name, description);
        res.status(200).json({ message: "Cập nhật danh mục thành công!" });
    } catch (error) {
        console.log("🚨 LỖI CẬP NHẬT DANH MỤC:", error);
        res.status(500).json({ message: "Lỗi server khi cập nhật danh mục." });
    }
};
const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        await categoryModel.deleteCategory(categoryId);
        res.status(200).json({ message: "Đã xóa danh mục!" });
    } catch (error) {
        console.log("🚨 LỖI XÓA DANH MỤC:", error);
        res.status(500).json({ message: "Lỗi server khi xóa danh mục." });
    }
};
const updateClassStatus = async (req, res) => {
    try {
        const classId = req.params.id;
        const { status } = req.body;
        
        // Kiểm tra dữ liệu đầu vào cho an toàn
        if (!['Draft', 'Published', 'Closed'].includes(status)) {
            return res.status(400).json({ message: "Trạng thái không hợp lệ." });
        }
        
        await classModel.updateClassStatus(classId, status);
        res.status(200).json({ message: "Cập nhật trạng thái thành công!" });
    } catch (error) {
        console.log("🚨 LỖI CẬP NHẬT TRẠNG THÁI LỚP HỌC:", error);
        res.status(500).json({ message: "Lỗi server khi cập nhật trạng thái." });
    }
};

module.exports = { 
    sendInstructorInvite,
    getAllInstructors,
    changeUserRole,
    removeUser,
    getStudents,
    getAllClasses,
    deleteClass,
    getLessonReports,
    updateReportStatus,
    deleteLesson,
    getDashboardData,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    updateClassStatus
    };