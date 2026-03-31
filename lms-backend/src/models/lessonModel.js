const pool = require('../config/db');

const LessonModel = {
    createLesson: async (chapterId, lessonName, orderIndex) => {
        const [result] = await pool.query(
            'INSERT INTO Lessons (chapter_id, lesson_name, order_index) VALUES (?, ?, ?)',
            [chapterId, lessonName, orderIndex || 0]
        );
        return result;
    },

    updateLessonInfo: async (lessonId, lessonName, content, videoUrl, documentUrl) => {
        const [result] = await pool.query(
            'UPDATE Lessons SET lesson_name = ?, content = ?, video_url = ?, document_url = ? WHERE lesson_id = ?',
            [lessonName, content, videoUrl, documentUrl, lessonId]
        );
        return result;
    },

    deleteLesson: async (lessonId) => {
        const [result] = await pool.query('DELETE FROM Lessons WHERE lesson_id = ?', [lessonId]);
        return result;
    },

    reorderLessons: async (lessonsData) => {
        const queries = lessonsData.map(l => 
            pool.query('UPDATE Lessons SET chapter_id = ?, order_index = ? WHERE lesson_id = ?', [l.chapter_id, l.order_index, l.lesson_id])
        );
        await Promise.all(queries);
    }
};

module.exports = LessonModel;