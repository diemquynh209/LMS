const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
router.post('/invite', adminController.sendInstructorInvite);
router.get('/instructors',adminController.getAllInstructors);
module.exports = router;