const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Get all notifications for a user
router.get('/user/:userId', notificationController.getUserNotifications);

// Mark a notification as read
router.patch('/:notificationId/read', notificationController.markAsRead);

module.exports = router;
