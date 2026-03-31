const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

//db
router.get('/dashboard-stats', adminController.getDashboardData);

//user
router.get('/instructors', adminController.getAllInstructors);
router.post('/invite', adminController.sendInstructorInvite);
router.get('/students', adminController.getStudents);
router.put('/update-role', adminController.changeUserRole);
router.delete('/delete-user/:id', adminController.removeUser);

//class
router.get('/classes', adminController.getAllClasses);
router.put('/update-class-status/:id', adminController.updateClassStatus);
router.delete('/delete-class/:id', adminController.deleteClass);

//lesson
router.get('/lesson-reports', adminController.getLessonReports);
router.put('/lesson-reports/:id/status', adminController.updateReportStatus);
router.delete('/delete-lesson/:id', adminController.deleteLesson);

//category
router.get('/categories', adminController.getCategories);
router.post('/categories', adminController.createCategory);
router.put('/categories/:id', adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);

module.exports = router;