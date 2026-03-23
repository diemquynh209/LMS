const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/instructorController');

router.get('/classes', instructorController.getMyClasses);
router.post('/classes', instructorController.createClass);
router.put('/classes/:id', instructorController.updateClassInfo);
router.put('/classes/:id/status', instructorController.updateClassStatus);
router.get('/categories', instructorController.getCategories);

router.get('/classes/:classId/curriculum', instructorController.getCurriculum);

router.put('/chapters/reorder', instructorController.reorderChapters);
router.put('/lessons/reorder', instructorController.reorderLessons);

router.post('/chapters', instructorController.createChapter);
router.put('/chapters/:id', instructorController.updateChapter);
router.delete('/chapters/:id', instructorController.deleteChapter);

router.post('/lessons', instructorController.createLesson);
router.put('/lessons/:id', instructorController.updateLesson);
router.delete('/lessons/:id', instructorController.deleteLesson);

module.exports = router;