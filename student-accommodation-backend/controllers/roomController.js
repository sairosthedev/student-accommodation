const Room = require('../models/Room');
const Student = require('../models/Student');

// Add a new room
exports.addRoom = async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all rooms
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate('occupants', 'name email phone paymentStatus');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single room
exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('occupants', 'name email phone paymentStatus');
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update room availability
exports.updateRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { isAvailable } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Only allow changing availability if room has no occupants
    if (!isAvailable && room.occupants.length > 0) {
      return res.status(400).json({ error: 'Cannot mark room as unavailable while it has occupants' });
    }

    room.isAvailable = isAvailable;
    await room.save();

    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Assign a student to a room
exports.assignStudentToRoom = async (req, res) => {
  try {
    const { roomId, studentId } = req.params;

    // Find room and student
    const room = await Room.findById(roomId);
    const student = await Student.findById(studentId);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Check if student is already assigned to a room
    if (student.assignedRoom) {
      return res.status(400).json({ error: 'Student is already assigned to a room' });
    }

    // Check if the room is available and has capacity
    if (!room.isAvailable) {
      return res.status(400).json({ error: 'Room is not available' });
    }
    if (room.occupants.length >= room.capacity) {
      return res.status(400).json({ error: 'Room is full' });
    }

    // Add student to room and update student's assigned room
    room.occupants.push(studentId);
    student.assignedRoom = roomId;

    // If room becomes full, mark it as unavailable
    if (room.occupants.length >= room.capacity) {
      room.isAvailable = false;
    }

    // Save both documents
    await Promise.all([room.save(), student.save()]);

    // Return populated room data
    const updatedRoom = await Room.findById(roomId)
      .populate('occupants', 'name email phone paymentStatus');
    
    res.json(updatedRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove a student from a room
exports.removeStudentFromRoom = async (req, res) => {
  try {
    const { roomId, studentId } = req.params;

    // Find room and student
    const room = await Room.findById(roomId);
    const student = await Student.findById(studentId);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Check if student is actually in this room
    if (!room.occupants.includes(studentId)) {
      return res.status(400).json({ error: 'Student is not assigned to this room' });
    }

    // Remove student from room and clear student's room assignment
    room.occupants = room.occupants.filter(id => id.toString() !== studentId);
    student.assignedRoom = null;

    // If room was full and now has space, mark it as available
    if (!room.isAvailable && room.occupants.length < room.capacity) {
      room.isAvailable = true;
    }

    // Save both documents
    await Promise.all([room.save(), student.save()]);

    // Return populated room data
    const updatedRoom = await Room.findById(roomId)
      .populate('occupants', 'name email phone paymentStatus');
    
    res.json(updatedRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};