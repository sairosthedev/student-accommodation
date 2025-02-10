const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const { authenticateUser, isAdmin } = require('../middleware/auth');
const MaintenanceRequest = require('../models/MaintenanceRequest');

// Public routes
router.get('/stats', maintenanceController.getMaintenanceStats);

// Protected routes
router.use(authenticateUser);

// Student routes
router.post('/', maintenanceController.createMaintenanceRequest);
router.get('/user', maintenanceController.getUserRequests);
router.get('/user/stats', maintenanceController.getUserStats);

// Admin routes
router.get('/', isAdmin, maintenanceController.getAllMaintenanceRequests);
router.put('/:id', isAdmin, maintenanceController.updateMaintenanceRequest);
router.delete('/:id', isAdmin, maintenanceController.deleteMaintenanceRequest);
router.post('/upload', maintenanceController.uploadImages);

// Get maintenance request count for a user
router.get('/user/count', async (req, res) => {
  try {
    const count = await MaintenanceRequest.countDocuments({
      studentId: req.user.studentId,
      status: { $in: ['pending', 'in_progress'] }
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;