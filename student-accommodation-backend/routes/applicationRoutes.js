const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authenticateUser, isAdmin } = require('../middleware/auth');

// Public routes
router.post('/', applicationController.submitApplication);
router.get('/student/:studentId', applicationController.getStudentApplications);
router.post('/:id/cancel', applicationController.cancelApplication);

// Admin only routes
router.get('/', authenticateUser, isAdmin, applicationController.getAllApplications);
router.put('/:id/status', authenticateUser, isAdmin, applicationController.updateApplicationStatus);

module.exports = router; 