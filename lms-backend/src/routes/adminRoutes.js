const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
router.post('/invite', adminController.sendInstructorInvite);
router.get('/instructors',adminController.getAllInstructors);
router.put('/update-role', adminController.changeUserRole);
router.get('/students', adminController.getStudents);
module.exports = router;