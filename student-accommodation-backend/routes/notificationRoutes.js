const express = require('express');
const router = express.Router();
const { authenticateUser, isAdmin } = require('../middleware/auth');
const {
  createNotification,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require('../controllers/notificationController');

// Get all notifications for the authenticated user
router.get('/', authenticateUser, getUserNotifications);

// Get unread notifications count
router.get('/unread/count', authenticateUser, getUnreadCount);

// Create a new notification (admin only)
router.post('/', authenticateUser, isAdmin, createNotification);

// Mark a notification as read
router.patch('/:id/read', authenticateUser, markAsRead);

// Mark all notifications as read
router.patch('/read/all', authenticateUser, markAllAsRead);

// Delete a notification
router.delete('/:id', authenticateUser, deleteNotification);

module.exports = router; 