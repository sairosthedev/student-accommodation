const express = require('express');
const {
  addRoom,
  getRooms,
  getRoom,
  updateRoomAvailability,
  assignStudentToRoom,
  removeStudentFromRoom,
} = require('../controllers/roomController');

const router = express.Router();

// Add a new room
router.post('/', addRoom);

// Get all rooms
router.get('/', getRooms);

// Get a single room
router.get('/:id', getRoom);

// Update room availability
router.put('/:roomId/availability', updateRoomAvailability);

// Assign a student to a room
router.put('/:roomId/assign/:studentId', assignStudentToRoom);

// Remove a student from a room
router.put('/:roomId/remove/:studentId', removeStudentFromRoom);

module.exports = router;