const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middleware/auth');

// Get current user notifications
router.get('/', authenticate, notificationController.getUserNotifications);

// Mark all user notifications as read
router.patch('/read-all', authenticate, notificationController.markAllAsRead);

// Clear all notifications for user
router.delete('/', authenticate, notificationController.clearNotifications);

// Mark single notification as read
router.patch('/:id/read', authenticate, notificationController.markAsRead);

module.exports = router;
