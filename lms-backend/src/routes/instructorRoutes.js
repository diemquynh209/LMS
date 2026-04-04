const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/instructorController');
const uploadCloud = require('../middlewares/uploadCloud');

router.get('/classes', instructorController.getMyClasses);
router.post('/classes', uploadCloud.single('image'), instructorController.createClass);
router.put('/classes/:id', uploadCloud.single('image'), instructorController.updateClassInfo);
router.delete('/classes/:id', instructorController.deleteClass);
router.patch('/classes/:id/status', instructorController.updateClassStatus);
router.delete('/classes/:classId/students/:studentId', instructorController.kickStudent);
router.get('/students', instructorController.getStudentsInClass);
router.get('/categories', instructorController.getCategories);

router.get('/classes/:classId/curriculum', instructorController.getCurriculum);

router.post('/chapters', instructorController.createChapter);
router.put('/chapters/:id', instructorController.updateChapter);
router.delete('/chapters/:id', instructorController.deleteChapter);
router.put('/chapters/reorder', instructorController.reorderChapters);

router.post('/lessons', instructorController.createLesson);
router.put('/lessons/:id', instructorController.updateLesson);
router.delete('/lessons/:id', instructorController.deleteLesson);
router.get('/lessons/:id', instructorController.getLesson);
router.put('/lessons/reorder', instructorController.reorderLessons);
router.post('/lessons/:id/upload-document', uploadCloud.single('document'), instructorController.uploadLessonDocument);
router.put('/lesson/:id/approve-summary', instructorController.approveAISummary);

router.get('/lessons/:lessonId/questions', instructorController.getQuestions);
router.post('/questions', instructorController.createQuestion);
router.put('/questions/:id', instructorController.updateQuestion);
router.delete('/questions/:id', instructorController.deleteQuestion);

module.exports = router;