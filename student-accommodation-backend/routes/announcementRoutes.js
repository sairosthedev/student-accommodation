const express = require('express');
const router = express.Router();
const { authenticateUser, isAdmin } = require('../middleware/auth');
const {
  createAnnouncement,
  getAnnouncements,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  archiveAnnouncement
} = require('../controllers/announcementController');

// Public routes (still requires authentication)
router.get('/', authenticateUser, getAnnouncements);
router.get('/:id', authenticateUser, getAnnouncement);

// Admin only routes
router.post('/', authenticateUser, isAdmin, createAnnouncement);
router.put('/:id', authenticateUser, isAdmin, updateAnnouncement);
router.delete('/:id', authenticateUser, isAdmin, deleteAnnouncement);
router.put('/:id/archive', authenticateUser, isAdmin, archiveAnnouncement);

module.exports = router; 