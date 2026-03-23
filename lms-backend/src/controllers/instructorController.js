const instructorModel = require('../models/instructorModel');
const categoryModel = require('../models/categoryModel');
//Class
const getMyClasses = async (req, res) => {
    try {
        const instructorId = req.query.instructorId; 
        const searchTerm = req.query.search || '';
        if (!instructorId) {
            return res.status(400).json({ message: "Thiếu ID Giảng viên!" });
        }
        const classes = await instructorModel.getMyClasses(instructorId, searchTerm);
        res.status(200).json(classes);
    } catch (error) {
        console.error(" LỖI LẤY LỚP HỌC GIẢNG VIÊN:", error);
        res.status(500).json({ message: "Lỗi server khi lấy dữ liệu lớp học." });
    }
};
const createClass = async (req, res) => {
    try {
        const { instructorId, class_name, description, category_id } = req.body;      
        if (!instructorId || !class_name) {
            return res.status(400).json({ message: "Vui lòng nhập đủ Tên lớp và ID Giảng viên!" });
        }

        await instructorModel.createClass(instructorId, class_name, description, category_id);
        res.status(201).json({ message: "Tạo lớp học mới thành công!" });
    } catch (error) {
        console.error("🚨 LỖI TẠO LỚP HỌC:", error);
        res.status(500).json({ message: "Lỗi server khi tạo lớp học." });
    }
};
const updateClassInfo = async (req, res) => {
    try {
        const classId = req.params.id;
        const { instructorId, class_name, description, category_id } = req.body;
        const result = await instructorModel.updateClassInfo(classId, instructorId, class_name, description, category_id);        
        if (result.affectedRows === 0) {
            return res.status(403).json({ message: "Bạn không có quyền sửa lớp này hoặc lớp không tồn tại!" });
        }

        res.status(200).json({ message: "Cập nhật thông tin lớp học thành công!" });
    } catch (error) {
        console.error("🚨 LỖI SỬA LỚP HỌC:", error);
        res.status(500).json({ message: "Lỗi server khi cập nhật lớp học." });
    }
};
const updateClassStatus = async (req, res) => {
    try {
        const classId = req.params.id;
        const { instructorId, status } = req.body;
        if (!['Draft', 'Published', 'Closed'].includes(status)) {
            return res.status(400).json({ message: "Trạng thái không hợp lệ." });
        }
        const result = await instructorModel.updateClassStatus(classId, instructorId, status);        
        if (result.affectedRows === 0) {
            return res.status(403).json({ message: "Bạn không có quyền đổi trạng thái lớp này!" });
        }
        res.status(200).json({ message: "Cập nhật trạng thái thành công!" });
    } catch (error) {
        console.error("LỖI ĐỔI TRẠNG THÁI LỚP HỌC:", error);
        res.status(500).json({ message: "Lỗi server khi đổi trạng thái." });
    }
};
const getCategories = async (req, res) => {
    try {
        const categories = await categoryModel.getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        console.error("LỖI LẤY DANH MỤC CHO GIẢNG VIÊN:", error);
        res.status(500).json({ message: "Lỗi server khi lấy danh mục." });
    }
};

//Chương & bài học
const getCurriculum = async (req, res) => {
    try {
        const classId = req.params.classId;
        const curriculum = await instructorModel.getCurriculum(classId);
        res.status(200).json(curriculum);
    } catch (error) {
        console.error("🚨 LỖI LẤY CẤU TRÚC KHÓA HỌC:", error);
        res.status(500).json({ message: "Lỗi server khi tải khung chương trình." });
    }
};
const createChapter = async (req, res) => {
    try {
        const { class_id, chapter_name, order_index } = req.body;
        await instructorModel.createChapter(class_id, chapter_name, order_index);
        res.status(201).json({ message: "Tạo chương thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi tạo chương." });
    }
};
const updateChapter = async (req, res) => {
    try {
        await instructorModel.updateChapter(req.params.id, req.body.chapter_name);
        res.status(200).json({ message: "Đổi tên chương thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi sửa chương." });
    }
};
const deleteChapter = async (req, res) => {
    try {
        await instructorModel.deleteChapter(req.params.id);
        res.status(200).json({ message: "Xóa chương thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi xóa chương." });
    }
};
const createLesson = async (req, res) => {
    try {
        const { chapter_id, lesson_name, order_index } = req.body;
        await instructorModel.createLesson(chapter_id, lesson_name, order_index);
        res.status(201).json({ message: "Tạo bài học thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi tạo bài học." });
    }
};
const updateLesson = async (req, res) => {
    try {
        const { lesson_name, content, video_url, document_url } = req.body;
        await instructorModel.updateLessonInfo(req.params.id, lesson_name, content, video_url, document_url);
        res.status(200).json({ message: "Cập nhật bài học thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi cập nhật bài học." });
    }
};
const deleteLesson = async (req, res) => {
    try {
        await instructorModel.deleteLesson(req.params.id);
        res.status(200).json({ message: "Xóa bài học thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi xóa bài học." });
    }
};
const reorderChapters = async (req, res) => {
    try {
        const { chapters } = req.body; 
        await instructorModel.reorderChapters(chapters);
        res.status(200).json({ message: "Cập nhật thứ tự chương thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi sắp xếp chương." });
    }
};
const reorderLessons = async (req, res) => {
    try {
        const { lessons } = req.body;
        await instructorModel.reorderLessons(lessons);
        res.status(200).json({ message: "Cập nhật thứ tự bài học thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi sắp xếp bài học." });
    }
};
module.exports = {
    getMyClasses,
    createClass,
    updateClassInfo,
    updateClassStatus,
    getCategories,
    getCurriculum,
    createChapter,
    updateChapter,
    deleteChapter,
    createLesson,
    updateLesson,
    deleteLesson,
    reorderChapters,
    reorderLessons
};