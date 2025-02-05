
const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const { authenticateUser, isAdmin } = require('../middleware/auth');

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

module.exports = router;