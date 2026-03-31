const pool = require('../config/db');

const QuestionModel = {
    getQuestionsByLesson: async (lessonId) => {
        const [rows] = await pool.query(
            'SELECT * FROM Questions WHERE lesson_id = ? ORDER BY created_at ASC',
            [lessonId]
        );
        return rows;
    },

    createQuestion: async (lessonId, questionText, questionType, options, correctAnswer) => {
        const [result] = await pool.query(
            'INSERT INTO Questions (lesson_id, question_text, question_type, options, correct_answer) VALUES (?, ?, ?, ?, ?)',
            [lessonId, questionText, questionType, JSON.stringify(options), correctAnswer]
        );
        return result;
    },

    updateQuestion: async (questionId, questionText, questionType, options, correctAnswer) => {
        const [result] = await pool.query(
            'UPDATE Questions SET question_text = ?, question_type = ?, options = ?, correct_answer = ? WHERE question_id = ?',
            [questionText, questionType, JSON.stringify(options), correctAnswer, questionId]
        );
        return result;
    },

    deleteQuestion: async (questionId) => {
        const [result] = await pool.query('DELETE FROM Questions WHERE question_id = ?', [questionId]);
        return result;
    }
};

module.exports = QuestionModel;