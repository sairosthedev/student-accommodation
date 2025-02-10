const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const Notification = require('../models/Notification');

// Get unread notifications count
router.get('/unread/count', authenticateUser, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user.studentId,
      read: false
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 