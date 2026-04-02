const LessonModel = require('../models/lessonModel');

const AIService = {
    async generateSummary(lessonId, fileUrl) {
        console.log(`[AI-Log] Bắt đầu xử lý file: ${fileUrl}`);

        await new Promise(resolve => setTimeout(resolve, 5000));

        const mockSummary = "Đây là bản tóm tắt mẫu được tạo bởi AI giả lập. Nội dung tóm tắt sẽ giúp giảng viên và học sinh nắm bắt ý chính của tài liệu nhanh chóng.";

        await LessonModel.updateAIStatus(lessonId, mockSummary, 'pending_review');
        
        console.log(`[AI-Log] Hoàn thành tóm tắt cho bài học ${lessonId}`);
    }
};

module.exports = AIService;