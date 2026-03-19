const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
router.post('/invite', adminController.sendInstructorInvite);
module.exports = router;