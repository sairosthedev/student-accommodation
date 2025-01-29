const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

const {
  addRoom,
  getRooms,
  getRoom,
  getAvailableRooms,
  updateRoomAvailability,
  assignStudentToRoom,
  removeStudentFromRoom,
} = require('../controllers/roomController');

// Debug middleware for this router
router.use((req, res, next) => {
  console.log('\nRoom Router Debug:');
  console.log('  Path:', req.path);
  console.log('  Method:', req.method);
  console.log('  Params:', req.params);
  next();
});

// Test routes
router.get('/test', (req, res) => {
  res.json({ message: 'Room routes are working' });
});

router.get('/test-db', async (req, res) => {
  try {
    const rooms = await Room.find().limit(1);
    res.json({ 
      message: 'Database connection working',
      dbStatus: 'connected',
      roomCount: rooms.length,
      sampleRoom: rooms[0] || null
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Database connection error',
      dbStatus: 'error',
      error: error.message 
    });
  }
});

// Basic CRUD routes
router.get('/', getRooms);
router.post('/', addRoom);

// Special routes - must come before parameterized routes
router.get('/available', getAvailableRooms);

// Student assignment routes
router.post('/:roomId/assign/:studentId', (req, res, next) => {
  console.log('Assignment route hit with params:', req.params);
  req.roomId = req.params.roomId;
  req.studentId = req.params.studentId;
  next();
}, assignStudentToRoom);

router.post('/:roomId/unassign/:studentId', (req, res, next) => {
  console.log('Unassignment route hit with params:', req.params);
  req.roomId = req.params.roomId;
  req.studentId = req.params.studentId;
  next();
}, removeStudentFromRoom);

// Room management routes
router.put('/:roomId/availability', updateRoomAvailability);

// Get single room - most generic route should be last
router.get('/:id', getRoom);

module.exports = router;