const pool = require('../config/db');

const ChapterModel = {
    getCurriculum: async (classId) => {
        const [chapters] = await pool.query('SELECT * FROM Chapters WHERE class_id = ? ORDER BY order_index ASC', [classId]);
        const [lessons] = await pool.query(`
            SELECT l.* FROM Lessons l
            JOIN Chapters c ON l.chapter_id = c.chapter_id
            WHERE c.class_id = ? ORDER BY l.order_index ASC
        `, [classId]);
        return chapters.map(chap => ({
            ...chap,
            lessons: lessons.filter(l => l.chapter_id === chap.chapter_id)
        }));
    },

    createChapter: async (classId, chapterName, orderIndex) => {
        const [result] = await pool.query(
            'INSERT INTO Chapters (class_id, chapter_name, order_index) VALUES (?, ?, ?)',
            [classId, chapterName, orderIndex || 0]
        );
        return result;
    },

    updateChapter: async (chapterId, chapterName) => {
        const [result] = await pool.query('UPDATE Chapters SET chapter_name = ? WHERE chapter_id = ?', [chapterName, chapterId]);
        return result;
    },

    deleteChapter: async (chapterId) => {
        const [result] = await pool.query('DELETE FROM Chapters WHERE chapter_id = ?', [chapterId]);
        return result;
    },

    reorderChapters: async (chaptersData) => {
        const queries = chaptersData.map(c => 
            pool.query('UPDATE Chapters SET order_index = ? WHERE chapter_id = ?', [c.order_index, c.chapter_id])
        );
        await Promise.all(queries);
    }
};

module.exports = ChapterModel;