const pool = require('../config/db');
const ClassModel = require('../models/classModel');
const ChapterModel = require('../models/chapterModel');
const LessonModel = require('../models/lessonModel');
const QuestionModel = require('../models/questionModel');
const AssignmentModel = require('../models/assignmentModel');
const SubmissionModel = require('../models/submissionModel');
const CategoryModel = require('../models/categoryModel');
const AIService = require('../services/AIService');

const instructorController = {
    //class
    getMyClasses: async (req, res) => {
        try {
            const instructorId = req.query.instructorId; 
            const searchTerm = req.query.search || '';
            if (!instructorId) {
                return res.status(400).json({ message: "Thiếu ID Giảng viên!" });
            }
            const classes = await ClassModel.getMyClasses(instructorId, searchTerm);
            res.status(200).json(classes);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi lấy dữ liệu lớp học." });
        }
    },

    createClass: async (req, res) => {
        try {
            const { instructorId, class_name, description, category_id } = req.body;      
            const imageUrl = req.file ? req.file.path : null; 

            if (!instructorId || !class_name) {
                return res.status(400).json({ message: "Vui lòng nhập đủ Tên lớp và ID Giảng viên!" });
            }
            await ClassModel.createClass(instructorId, class_name, description, category_id, imageUrl);
            res.status(201).json({ message: "Tạo lớp học mới thành công!" });
        } catch (error) {
            console.error("Lỗi tạo lớp:", error);
            res.status(500).json({ message: "Lỗi server khi tạo lớp học." });
        }
    },

    updateClassInfo: async (req, res) => {
        try {
            const classId = req.params.id;
            const { instructorId, class_name, description, category_id } = req.body;
            
            const imageUrl = req.file ? req.file.path : null; 

            //xóa ảnh cũ trên cloudinary khi cập nhật ảnh mới
            if (imageUrl) {
                const [rows] = await pool.query('SELECT image_url FROM Classes WHERE class_id = ? AND instructor_id = ?', [classId, instructorId]);
                
                if (rows.length > 0 && rows[0].image_url && rows[0].image_url.includes('cloudinary')) {
                    try {
                        const cloudinary = require('cloudinary').v2;
                        const oldUrl = rows[0].image_url;
                        
                        // Cắt chuỗi để lấy public_id của ảnh cũ
                        const parts = oldUrl.split('/upload/');
                        if (parts.length > 1) {
                            const pathString = parts[1].split('/').slice(1).join('/'); 
                            const publicId = pathString.substring(0, pathString.lastIndexOf('.'));
                            
                            // Gọi lệnh xóa của Cloudinary
                            await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
                            console.log("Đã dọn dẹp ảnh bìa cũ trên mây:", publicId);
                        }
                    } catch (err) {
                        console.error("Lỗi khi xóa ảnh bìa cũ (Bỏ qua để không chết server):", err);
                    }
                }
            }

            // Tiến hành lưu dữ liệu và link ảnh mới vào Database
            const result = await ClassModel.updateClassInfo(classId, instructorId, class_name, description, category_id, imageUrl);        
            
            if (result.affectedRows === 0) {
                return res.status(403).json({ message: "Bạn không có quyền sửa lớp này hoặc lớp không tồn tại!" });
            }
            res.status(200).json({ message: "Cập nhật thông tin lớp học thành công!" });
        } catch (error) {
            console.error("Lỗi cập nhật lớp:", error);
            res.status(500).json({ message: "Lỗi server khi cập nhật lớp học." });
        }
    },

    updateClassStatus: async (req, res) => {
        try {
            const classId = req.params.id;
            const { instructorId, status } = req.body;
            if (!['Draft', 'Published', 'Closed'].includes(status)) {
                return res.status(400).json({ message: "Trạng thái không hợp lệ." });
            }
            const result = await ClassModel.updateClassStatus(classId, status, instructorId);        
            if (result.affectedRows === 0) {
                return res.status(403).json({ message: "Bạn không có quyền đổi trạng thái lớp này!" });
            }
            res.status(200).json({ message: "Cập nhật trạng thái thành công!" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi đổi trạng thái." });
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

    deleteClass: async (req, res) => {
        try {
            const classId = req.params.id;
            const [rows] = await pool.query(`
                SELECT c.status, COUNT(e.student_id) AS student_count
                FROM Classes c 
                LEFT JOIN Enrollments e ON c.class_id = e.class_id AND e.status = 'Approved'
                WHERE c.class_id = ?
                GROUP BY c.class_id
            `, [classId]);

            if (rows.length === 0) {
                return res.status(404).json({ message: "Không tìm thấy lớp học!" });
            }
            const classData = rows[0];

            if (classData.status !== 'Draft' || classData.student_count > 0) {
                return res.status(403).json({ 
                    message: "Không thể xóa! Chỉ được phép xóa vĩnh viễn các lớp ở trạng thái Bản nháp và chưa có học viên." 
                });
            }

            await ClassModel.deleteClass(classId);
            res.status(200).json({ message: "Đã xóa lớp học vĩnh viễn!" });
        } catch (error) {
            console.error("Lỗi xóa lớp:", error);
            res.status(500).json({ message: "Lỗi server khi xóa lớp học." });
        }
    },

    getStudentsInClass: async (req, res) => {
        try {
            const classId = req.query.classId; 
            const instructorId = req.query.instructorId;

            if (!instructorId) {
                return res.status(400).json({ message: "Thiếu thông tin giảng viên!" });
            }

            const ClassModel = require('../models/classModel');
            let students = [];

            if (classId) {
                //click từ 1 lớp cụ thể
                students = await ClassModel.getStudentsByClass(classId, instructorId);
            } else {
                //click từ menu Sidebar tổng
                students = await ClassModel.getAllStudentsByInstructor(instructorId);
            }
            
            res.status(200).json(students);
        } catch (error) {
            console.error("Lỗi lấy danh sách học sinh:", error);
            res.status(500).json({ message: "Lỗi server." });
        }
    },

    // --- CHAPTER + LESSON MANAGEMENT ---
    getCurriculum: async (req, res) => {
        try {
            const classId = req.params.classId;
            const curriculum = await ChapterModel.getCurriculum(classId);
            res.status(200).json(curriculum);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi tải khung chương trình." });
        }
    },

    createChapter: async (req, res) => {
        try {
            const { class_id, chapter_name, order_index } = req.body;
            await ChapterModel.createChapter(class_id, chapter_name, order_index);
            res.status(201).json({ message: "Tạo chương thành công!" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi tạo chương." });
        }
    },

    updateChapter: async (req, res) => {
        try {
            await ChapterModel.updateChapter(req.params.id, req.body.chapter_name);
            res.status(200).json({ message: "Đổi tên chương thành công!" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi sửa chương." });
        }
    },

    deleteChapter: async (req, res) => {
        try {
            await ChapterModel.deleteChapter(req.params.id);
            res.status(200).json({ message: "Xóa chương thành công!" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi xóa chương." });
        }
    },

    createLesson: async (req, res) => {
        try {
            const { chapter_id, lesson_name, order_index } = req.body;
            await LessonModel.createLesson(chapter_id, lesson_name, order_index);
            res.status(201).json({ message: "Tạo bài học thành công!" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi tạo bài học." });
        }
    },

    updateLesson: async (req, res) => {
        try {
            const { lesson_name, content, video_url, document_url } = req.body;
            await LessonModel.updateLessonInfo(req.params.id, lesson_name, content, video_url, document_url);
            res.status(200).json({ message: "Cập nhật bài học thành công!" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi cập nhật bài học." });
        }
    },

    deleteLesson: async (req, res) => {
        try {
            await LessonModel.deleteLesson(req.params.id);
            res.status(200).json({ message: "Xóa bài học thành công!" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi xóa bài học." });
        }
    },

    reorderChapters: async (req, res) => {
        try {
            const { chapters } = req.body; 
            await ChapterModel.reorderChapters(chapters);
            res.status(200).json({ message: "Cập nhật thứ tự chương thành công!" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi sắp xếp chương." });
        }
    },

    reorderLessons: async (req, res) => {
        try {
            const { lessons } = req.body;
            await LessonModel.reorderLessons(lessons);
            res.status(200).json({ message: "Cập nhật thứ tự bài học thành công!" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi sắp xếp bài học." });
        }
    },

    uploadLessonDocument: async (req, res) => {
        try {
            const lessonId = req.params.id;
            if (!req.file || !req.file.path) {
                return res.status(400).json({ message: "Không tìm thấy file tải lên!" });
            }

            const newDocumentUrl = req.file.path; 
            const [rows] = await pool.query('SELECT * FROM Lessons WHERE lesson_id = ?', [lessonId]);
            if (rows.length === 0) {
                return res.status(404).json({ message: "Không tìm thấy bài học!" });
            }
            const currentLesson = rows[0];

            if (currentLesson.document_url && currentLesson.document_url.includes('cloudinary')) {
                try {
                    const cloudinary = require('cloudinary').v2;
                    const parts = currentLesson.document_url.split('/upload/');
                    if (parts.length > 1) {
                        const pathString = parts[1].split('/').slice(1).join('/'); 
                        let publicId = pathString;
                        let resType = 'raw';
                        if (currentLesson.document_url.includes('/image/upload/')) {
                            publicId = pathString.substring(0, pathString.lastIndexOf('.'));
                            resType = 'image';
                        }
                        await cloudinary.uploader.destroy(publicId, { resource_type: resType });
                    }
                } catch (err) {
                    console.error("Lỗi khi xóa file cũ (Bỏ qua):", err); 
                }
            }
            
            await LessonModel.updateLessonInfo(
                lessonId, 
                currentLesson.lesson_name, 
                currentLesson.content, 
                currentLesson.video_url, 
                newDocumentUrl 
            ); 

            await LessonModel.updateAIStatus(lessonId, null, 'processing');
            AIService.generateSummary(lessonId, newDocumentUrl);
            res.status(200).json({ 
                message: "Tải lên tài liệu thành công! Hệ thống AI đang tự động đọc và tóm tắt.", 
                document_url: newDocumentUrl 
            });

        } catch (error) {
            console.error("Lỗi upload Cloudinary:", error);
            res.status(500).json({ message: "Lỗi server khi upload file." });
        }
    },

    getLesson: async (req, res) => {
        try {
            const lesson = await LessonModel.getLessonById(req.params.id);
            if (!lesson) return res.status(404).json({ message: "Không tìm thấy bài học" });
            res.status(200).json(lesson);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi lấy bài học" });
        }
    },

    approveAISummary: async (req, res) => {
        try {
            const lessonId = req.params.id;
            const { finalSummary } = req.body;
            await LessonModel.updateAIStatus(lessonId, finalSummary, 'published');
            res.status(200).json({ message: "Đã duyệt tóm tắt thành công!" });
        } catch (error) {
            console.error("Lỗi duyệt bài:", error);
            res.status(500).json({ message: "Lỗi server khi duyệt bài." });
        }
    },

    //question
    getQuestions: async (req, res) => {
        try {
            const lessonId = req.params.lessonId;
            const questions = await QuestionModel.getQuestionsByLesson(lessonId);
            const formattedQuestions = questions.map(q => ({
                ...q,
                options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
            }));
            res.status(200).json(formattedQuestions);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi lấy danh sách câu hỏi." });
        }
    },

    createQuestion: async (req, res) => {
        try {
            const { lesson_id, question_text, question_type, options, correct_answer } = req.body;
            if (!lesson_id || !question_text || !correct_answer) {
                return res.status(400).json({ message: "Vui lòng điền đủ thông tin câu hỏi và đáp án đúng!" });
            }
            await QuestionModel.createQuestion(lesson_id, question_text, question_type, options, correct_answer);
            res.status(201).json({ message: "Thêm câu hỏi thành công!" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi tạo câu hỏi." });
        }
    },

    updateQuestion: async (req, res) => {
        try {
            const questionId = req.params.id;
            const { question_text, question_type, options, correct_answer } = req.body;
            await QuestionModel.updateQuestion(questionId, question_text, question_type, options, correct_answer);
            res.status(200).json({ message: "Cập nhật câu hỏi thành công!" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi sửa câu hỏi." });
        }
    },

    deleteQuestion: async (req, res) => {
        try {
            const questionId = req.params.id;
            await QuestionModel.deleteQuestion(questionId);
            res.status(200).json({ message: "Đã xóa câu hỏi!" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi xóa câu hỏi." });
        }
    },

    // --- ASSIGNMENT MANAGEMENT ---
    getAssignments: async (req, res) => {
        try {
            const lessonId = req.params.lessonId;
            const assignments = await AssignmentModel.getAssignmentsByLesson(lessonId);
            res.status(200).json(assignments);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi lấy danh sách bài tập." });
        }
    },

    createAssignment: async (req, res) => {
        try {
            const lessonId = req.params.lessonId;
            const { title, description, due_date } = req.body;    
            if (!title || !due_date) {
                return res.status(400).json({ message: "Vui lòng nhập Tiêu đề và Hạn nộp (Deadline)!" });
            }
            await AssignmentModel.createAssignment(lessonId, title, description, due_date);
            res.status(201).json({ message: "Tạo bài tập tự luận thành công!" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi tạo bài tập." });
        }
    },

    deleteAssignment: async (req, res) => {
        try {
            const assignmentId = req.params.id;
            await AssignmentModel.deleteAssignment(assignmentId);
            res.status(200).json({ message: "Đã xóa bài tập!" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi xóa bài tập." });
        }
    },

    getSubmissions: async (req, res) => {
        try {
            const assignmentId = req.params.id;
            const submissions = await SubmissionModel.getSubmissionsForAssignment(assignmentId);
            res.status(200).json(submissions);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi lấy bài nộp." });
        }
    },

    gradeSubmission: async (req, res) => {
        try {
            const submissionId = req.params.id;
            const { grade, feedback } = req.body; 
            if (grade === undefined || grade === null) {
                return res.status(400).json({ message: "Vui lòng nhập điểm số trước khi lưu!" });
            }
            await SubmissionModel.gradeSubmission(submissionId, grade, feedback);
            res.status(200).json({ message: "Đã chấm điểm & gửi nhận xét thành công!" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi chấm điểm." });
        }
    },

    kickStudent: async (req, res) => {
        try {
            const { classId, studentId } = req.params;     
            if (!classId || !studentId) {
                return res.status(400).json({ message: "Thiếu thông tin lớp học hoặc học viên!" });
            }
            const result = await ClassModel.removeStudentFromClass(classId, studentId);        
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Học viên không tồn tại trong lớp này." });
            }
            res.status(200).json({ message: "Đã xóa học viên khỏi lớp thành công!" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi xóa học viên khỏi lớp." });
        }
    }
};

module.exports = instructorController;