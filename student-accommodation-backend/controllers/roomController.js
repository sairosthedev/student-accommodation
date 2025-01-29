const Room = require('../models/Room');
const Student = require('../models/Student');
const mongoose = require('mongoose');

// Add a new room
exports.addRoom = async (req, res) => {
  try {
    const { 
      roomNumber, 
      type, 
      price, 
      capacity, 
      floorLevel,
      amenities, 
      features,
      image, 
      isAvailable 
    } = req.body;
    
    console.log('Received room data:', req.body);

    // Basic validation
    if (!roomNumber || !type || !price || !capacity || !floorLevel) {
      console.log('Missing required fields:', { roomNumber, type, price, capacity, floorLevel });
      return res.status(400).json({ 
        error: 'Required fields missing: roomNumber, type, price, capacity, and floorLevel are required' 
      });
    }

    // Validate room type
    const validTypes = ['single', 'double', 'suite'];
    if (!validTypes.includes(type)) {
      console.log('Invalid room type:', type);
      return res.status(400).json({ 
        error: 'Invalid room type. Must be one of: single, double, suite' 
      });
    }

    // Validate floor level
    const validFloorLevels = ['ground', 'low', 'mid', 'high'];
    if (!validFloorLevels.includes(floorLevel)) {
      console.log('Invalid floor level:', floorLevel);
      return res.status(400).json({ 
        error: 'Invalid floor level. Must be one of: ground, low, mid, high' 
      });
    }

    // Validate features if provided
    if (features) {
      if (features.preferredGender && !['male', 'female', 'any'].includes(features.preferredGender)) {
        return res.status(400).json({ 
          error: 'Invalid preferred gender. Must be one of: male, female, any' 
        });
      }
      if (features.quietStudyArea !== undefined && typeof features.quietStudyArea !== 'boolean') {
        return res.status(400).json({ 
          error: 'Invalid quiet study area value. Must be true or false' 
        });
      }
    }

    // Validate price and capacity
    if (price < 0) {
      console.log('Negative price:', price);
      return res.status(400).json({ error: 'Price cannot be negative' });
    }
    if (capacity < 1) {
      console.log('Invalid capacity:', capacity);
      return res.status(400).json({ error: 'Capacity must be at least 1' });
    }

    // Check if room number already exists
    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      console.log('Room number already exists:', roomNumber);
      return res.status(400).json({ error: 'Room number already exists' });
    }

    // Create and save the room
    const roomData = {
      roomNumber,
      type,
      price: parseFloat(price),
      capacity: parseInt(capacity),
      floorLevel,
      amenities: Array.isArray(amenities) ? amenities : [],
      features: {
        quietStudyArea: features?.quietStudyArea || false,
        preferredGender: features?.preferredGender || 'any'
      },
      image: image || '',
      isAvailable: isAvailable !== undefined ? isAvailable : true
    };

    console.log('Creating room with data:', roomData);
    const room = new Room(roomData);
    const savedRoom = await room.save();
    console.log('Room saved successfully:', savedRoom);

    res.status(201).json(savedRoom);
  } catch (error) {
    console.error('Error in addRoom:', error);
    res.status(500).json({ 
      error: 'Failed to add room',
      details: error.message 
    });
  }
};

// Get all rooms
exports.getRooms = async (req, res) => {
  try {
    console.log('Fetching all rooms...');
    const rooms = await Room.find()
      .select('roomNumber type price capacity floorLevel amenities features image isAvailable occupants createdAt updatedAt')
      .populate('occupants', 'name email phone paymentStatus');
    
    // Debug log to check if features are present
    console.log('Rooms with features:', rooms.map(room => ({
      roomNumber: room.roomNumber,
      features: room.features
    })));
    
    res.json(rooms);
  } catch (error) {
    console.error('Error in getRooms:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get available rooms
exports.getAvailableRooms = async (req, res) => {
  try {
    console.log('Fetching available rooms...');
    const rooms = await Room.find({ isAvailable: true })
      .select('roomNumber type price capacity floorLevel amenities features image isAvailable occupants createdAt updatedAt')
      .populate('occupants', 'name email phone paymentStatus');
    
    // Debug log to check if features are present
    console.log('Available rooms with features:', rooms.map(room => ({
      roomNumber: room.roomNumber,
      features: room.features
    })));
    
    res.json(rooms);
  } catch (error) {
    console.error('Error in getAvailableRooms:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get a single room
exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .select('roomNumber type price capacity floorLevel amenities features image isAvailable occupants createdAt updatedAt')
      .populate('occupants', 'name email phone paymentStatus');
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    console.error('Error in getRoom:', error);
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
    console.log('\nAssigning student to room:');
    console.log('Room ID:', roomId, 'Type:', typeof roomId);
    console.log('Student ID:', studentId, 'Type:', typeof studentId);

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      console.log('Invalid room ID format');
      return res.status(400).json({ error: 'Invalid room ID format' });
    }
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      console.log('Invalid student ID format');
      return res.status(400).json({ error: 'Invalid student ID format' });
    }

    // Find room and student
    const room = await Room.findById(roomId);
    const student = await Student.findById(studentId);

    console.log('Found room:', room);
    console.log('Found student:', student);

    if (!room) {
      console.log('Room not found');
      return res.status(404).json({ error: 'Room not found' });
    }
    if (!student) {
      console.log('Student not found');
      return res.status(404).json({ error: 'Student not found' });
    }

    // Check if student is already assigned to a room
    if (student.assignedRoom) {
      console.log('Student already assigned to room:', student.assignedRoom);
      return res.status(400).json({ error: 'Student is already assigned to a room' });
    }

    // Check if the room is available and has capacity
    if (!room.isAvailable) {
      console.log('Room is not available');
      return res.status(400).json({ error: 'Room is not available' });
    }
    if (room.occupants.length >= room.capacity) {
      console.log('Room is full. Capacity:', room.capacity, 'Occupants:', room.occupants.length);
      return res.status(400).json({ error: 'Room is full' });
    }

    console.log('Adding student to room occupants');
    // Add student to room and update student's assigned room
    room.occupants.push(studentId);
    student.assignedRoom = roomId;

    // Update room availability based on occupancy
    room.isAvailable = room.occupants.length < room.capacity;

    console.log('Saving room and student updates');
    // Save both documents
    await Promise.all([room.save(), student.save()]);

    // Return populated room data
    const updatedRoom = await Room.findById(roomId)
      .populate('occupants', 'name email phone paymentStatus');
    
    console.log('Successfully assigned student. Updated room:', updatedRoom);
    res.json(updatedRoom);
  } catch (error) {
    console.error('Error in assignStudentToRoom:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: error.message });
  }
};

// Remove a student from a room
exports.removeStudentFromRoom = async (req, res) => {
  try {
    const { roomId, studentId } = req.params;
    console.log('Removing student from room:');
    console.log('  Room ID:', roomId);
    console.log('  Student ID:', studentId);

    // Find room and student
    const room = await Room.findById(roomId);
    const student = await Student.findById(studentId);

    console.log('Found room:', room);
    console.log('Found student:', student);

    if (!room) {
      console.log('Room not found');
      return res.status(404).json({ error: 'Room not found' });
    }
    if (!student) {
      console.log('Student not found');
      return res.status(404).json({ error: 'Student not found' });
    }

    // Check if student is actually in this room
    const isStudentInRoom = room.occupants.some(id => id.toString() === studentId.toString());
    console.log('Is student in room:', isStudentInRoom);
    console.log('Room occupants:', room.occupants.map(id => id.toString()));
    console.log('Student ID to remove:', studentId.toString());
    
    if (!isStudentInRoom) {
      console.log('Student is not assigned to this room');
      return res.status(400).json({ error: 'Student is not assigned to this room' });
    }

    // Remove student from room occupants
    room.occupants = room.occupants.filter(id => id.toString() !== studentId.toString());
    student.assignedRoom = null;

    // Update room availability based on occupancy
    room.isAvailable = room.occupants.length < room.capacity;

    // Save the changes
    await Promise.all([room.save(), student.save()]);

    // Return populated room data
    const updatedRoom = await Room.findById(roomId)
      .populate('occupants', 'name email phone paymentStatus');
    
    console.log('Successfully removed student. Updated room:', updatedRoom);
    res.json(updatedRoom);
  } catch (error) {
    console.error('Error in removeStudentFromRoom:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete all rooms (Admin only)
exports.deleteAllRooms = async (req, res) => {
  try {
    await Room.deleteMany({});
    console.log('All rooms deleted successfully');
    res.json({ message: 'All rooms deleted successfully' });
  } catch (error) {
    console.error('Error deleting rooms:', error);
    res.status(500).json({ error: error.message });
  }
};