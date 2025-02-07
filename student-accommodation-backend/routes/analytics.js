const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/analyticsController');
const { authenticateUser, isAdmin } = require('../middleware/auth');

// Get analytics data - protected route for admin only
router.get('/', authenticateUser, isAdmin, getAnalytics);

module.exports = router; 