const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
router.post('/send', notificationController.sendNotification);
router.get('/my-notifications', notificationController.getMyNotifications);
router.post('/read/:id', notificationController.markNotificationAsRead);
module.exports = router;