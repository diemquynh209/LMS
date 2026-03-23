const pool = require('../config/db');

//Các hàm qly class
const getMyClasses = async (instructorId, searchTerm = '') => {
    let query = `
        SELECT c.*, cat.category_name, COUNT(e.student_id) AS student_count
        FROM Classes c 
        LEFT JOIN Categories cat ON c.category_id = cat.category_id
        LEFT JOIN Enrollments e ON c.class_id = e.class_id AND e.status = 'Approved'
        WHERE c.instructor_id = ?
    `;
    let params = [instructorId];    
    if (searchTerm) {
        query += " AND c.class_name LIKE ?";
        params.push(`%${searchTerm}%`);
    }   
    query += " GROUP BY c.class_id ORDER BY c.created_at DESC";
    const [rows] = await pool.query(query, params);
    return rows;
};
const createClass = async (instructorId, className, description, categoryId) => {
    const [result] = await pool.query(
        'INSERT INTO Classes (instructor_id, class_name, description, category_id, status) VALUES (?, ?, ?, ?, "Draft")',
        [instructorId, className, description, categoryId || null]
    );
    return result;
};
const updateClassInfo = async (classId, instructorId, className, description, categoryId) => {
    const [result] = await pool.query(
        'UPDATE Classes SET class_name = ?, description = ?, category_id = ? WHERE class_id = ? AND instructor_id = ?',
        [className, description, categoryId || null, classId, instructorId]
    );
    return result;
};
const updateClassStatus = async (classId, instructorId, status) => {
    const [result] = await pool.query(
        'UPDATE Classes SET status = ? WHERE class_id = ? AND instructor_id = ?',
        [status, classId, instructorId]
    );
    return result;
};

//các hàm qly chương & bài học
const getCurriculum = async (classId) => {
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
};
const createChapter = async (classId, chapterName, orderIndex) => {
    const [result] = await pool.query(
        'INSERT INTO Chapters (class_id, chapter_name, order_index) VALUES (?, ?, ?)',
        [classId, chapterName, orderIndex || 0]
    );
    return result;
};
const updateChapter = async (chapterId, chapterName) => {
    const [result] = await pool.query('UPDATE Chapters SET chapter_name = ? WHERE chapter_id = ?', [chapterName, chapterId]);
    return result;
};
const deleteChapter = async (chapterId) => {
    const [result] = await pool.query('DELETE FROM Chapters WHERE chapter_id = ?', [chapterId]);
    return result;
};
const createLesson = async (chapterId, lessonName, orderIndex) => {
    const [result] = await pool.query(
        'INSERT INTO Lessons (chapter_id, lesson_name, order_index) VALUES (?, ?, ?)',
        [chapterId, lessonName, orderIndex || 0]
    );
    return result;
};
const updateLessonInfo = async (lessonId, lessonName, content, videoUrl, documentUrl) => {
    const [result] = await pool.query(
        'UPDATE Lessons SET lesson_name = ?, content = ?, video_url = ?, document_url = ? WHERE lesson_id = ?',
        [lessonName, content, videoUrl, documentUrl, lessonId]
    );
    return result;
};
const deleteLesson = async (lessonId) => {
    const [result] = await pool.query('DELETE FROM Lessons WHERE lesson_id = ?', [lessonId]);
    return result;
};
const reorderChapters = async (chaptersData) => {
    const queries = chaptersData.map(c => 
        pool.query('UPDATE Chapters SET order_index = ? WHERE chapter_id = ?', [c.order_index, c.chapter_id])
    );
    await Promise.all(queries);
};
const reorderLessons = async (lessonsData) => {
    const queries = lessonsData.map(l => 
        pool.query('UPDATE Lessons SET chapter_id = ?, order_index = ? WHERE lesson_id = ?', [l.chapter_id, l.order_index, l.lesson_id])
    );
    await Promise.all(queries);
};

module.exports = {
    getMyClasses,
    createClass,
    updateClassInfo,
    updateClassStatus,
    getCurriculum,
    createChapter,
    updateChapter,
    deleteChapter,
    createLesson,
    updateLessonInfo,
    deleteLesson,
    reorderChapters,
    reorderLessons
};