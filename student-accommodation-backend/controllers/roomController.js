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
      isAvailable,
      location,
      nearbyUniversities,
      distanceToUniversity,
      floor,
      size,
      description,
      facilities,
      propertyAmenities,
      building,
      checkInTime,
      leaseStart,
      securityDeposit,
      rules
    } = req.body;
    
    console.log('Received room data:', req.body);

    // Basic validation
    if (!roomNumber || !type || !price || !capacity || !floorLevel || !location || !distanceToUniversity || !nearbyUniversities) {
      console.log('Missing required fields:', { roomNumber, type, price, capacity, floorLevel, location, distanceToUniversity, nearbyUniversities });
      return res.status(400).json({ 
        error: 'Required fields missing: roomNumber, type, price, capacity, floorLevel, location, distanceToUniversity, and nearbyUniversities are required' 
      });
    }

    // Validate room type
    const validTypes = ['single', 'double', 'suite', 'apartment'];
    if (!validTypes.includes(type)) {
      console.log('Invalid room type:', type);
      return res.status(400).json({ 
        error: `Invalid room type. Must be one of: ${validTypes.join(', ')}` 
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

    // Validate location
    const validLocations = [
      'Mount Pleasant',
      'Avondale',
      'Hatfield',
      'Belvedere',
      'Msasa',
      'Eastlea',
      'Milton Park',
      'Marlborough',
      'Greendale'
    ];
    if (!validLocations.includes(location)) {
      console.log('Invalid location:', location);
      return res.status(400).json({ 
        error: `Invalid location. Must be one of: ${validLocations.join(', ')}` 
      });
    }

    // Validate nearbyUniversities
    const validUniversities = [
      'University of Zimbabwe',
      'Harare Institute of Technology',
      'Women\'s University in Africa',
      'Catholic University in Zimbabwe',
      'Zimbabwe Open University',
      'Africa University'
    ];
    
    if (!Array.isArray(nearbyUniversities) || nearbyUniversities.length === 0) {
      console.log('Invalid nearbyUniversities:', nearbyUniversities);
      return res.status(400).json({ 
        error: 'nearbyUniversities must be a non-empty array' 
      });
    }

    for (const university of nearbyUniversities) {
      if (!validUniversities.includes(university)) {
        console.log('Invalid university:', university);
        return res.status(400).json({ 
          error: `Invalid university in nearbyUniversities. Must be one of: ${validUniversities.join(', ')}` 
        });
      }
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
      location,
      nearbyUniversities,
      distanceToUniversity,
      floorLevel,
      floor,
      size,
      description,
      facilities: Array.isArray(facilities) ? facilities : [],
      amenities: Array.isArray(amenities) ? amenities : [],
      propertyAmenities: Array.isArray(propertyAmenities) ? propertyAmenities : [],
      features: {
        quietStudyArea: features?.quietStudyArea || false,
        preferredGender: features?.preferredGender || 'any'
      },
      building,
      checkInTime,
      leaseStart,
      securityDeposit,
      rules: Array.isArray(rules) ? rules : [],
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
    const {
      type,
      location,
      university,
      minPrice,
      maxPrice,
      isAvailable,
      features
    } = req.query;

    const query = {};

    // Add filters based on query parameters
    if (type) query.type = type;
    if (location) query.location = location;
    if (university) query.nearbyUniversities = university;
    if (isAvailable) query.isAvailable = isAvailable === 'true';
    if (features?.quietStudyArea) query['features.quietStudyArea'] = features.quietStudyArea === 'true';
    if (features?.preferredGender) query['features.preferredGender'] = features.preferredGender;
    
    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const rooms = await Room.find(query)
      .populate('occupants', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching rooms',
      error: error.message
    });
  }
};

// Get available rooms
exports.getAvailableRooms = async (req, res) => {
  try {
    console.log('Fetching available rooms...');
    const rooms = await Room.find({ isAvailable: true })
      .select('roomNumber type price capacity floorLevel amenities features image isAvailable occupants createdAt updatedAt')
      .populate('occupants', 'name email phone paymentStatus');
    
    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    console.error('Error in getAvailableRooms:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching available rooms',
      error: error.message
    });
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
    console.log('\nRemoving student from room:');
    console.log('Room ID:', roomId, 'Type:', typeof roomId);
    console.log('Student ID:', studentId, 'Type:', typeof studentId);

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      console.log('Invalid room ID format:', roomId);
      return res.status(400).json({ error: 'Invalid room ID format' });
    }
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      console.log('Invalid student ID format:', studentId);
      return res.status(400).json({ error: 'Invalid student ID format' });
    }

    // Find room and student
    const room = await Room.findById(roomId);
    const student = await Student.findById(studentId);

    console.log('Found room:', room);
    console.log('Found student:', student);

    if (!room) {
      console.log('Room not found:', roomId);
      return res.status(404).json({ error: 'Room not found' });
    }
    if (!student) {
      console.log('Student not found:', studentId);
      return res.status(404).json({ error: 'Student not found' });
    }

    // Check if student is actually in this room
    const isStudentInRoom = room.occupants.some(id => id.toString() === studentId);
    console.log('Room occupants:', room.occupants.map(id => id.toString()));
    console.log('Student ID to remove:', studentId);
    console.log('Is student in room:', isStudentInRoom);
    
    if (!isStudentInRoom) {
      // Check if student's assignedRoom matches this room
      const studentRoomId = student.assignedRoom?.toString();
      console.log('Student assigned room:', studentRoomId);
      console.log('Current room:', roomId);
      
      if (studentRoomId !== roomId) {
        console.log('Student is not assigned to this room');
        return res.status(400).json({ error: 'Student is not assigned to this room' });
      }
    }

    // Remove student from room occupants
    room.occupants = room.occupants.filter(id => id.toString() !== studentId);
    
    // Update room availability based on occupancy
    room.isAvailable = room.occupants.length < room.capacity;

    console.log('Saving updates...');
    console.log('Updated room occupants:', room.occupants);

    // Save the room first
    await room.save();

    // Update student's room assignment using findByIdAndUpdate to avoid validation
    await Student.findByIdAndUpdate(
      studentId,
      { $set: { assignedRoom: null } },
      { new: true, runValidators: false }
    );
    
    // Return populated room data
    const updatedRoom = await Room.findById(roomId)
      .populate('occupants', 'name email phone paymentStatus');
    
    console.log('Successfully removed student. Updated room:', updatedRoom);
    res.json(updatedRoom);
  } catch (error) {
    console.error('Error in removeStudentFromRoom:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
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

exports.createRoom = async (req, res) => {
  try {
    const {
      roomNumber,
      type,
      price,
      capacity,
      location,
      nearbyUniversities,
      distanceToUniversity,
      floorLevel,
      floor,
      size,
      description,
      facilities,
      amenities,
      propertyAmenities,
      features,
      building,
      checkInTime,
      leaseStart,
      securityDeposit,
      rules
    } = req.body;

    // Validate required fields
    if (!roomNumber || !type || !price || !capacity || !location || !distanceToUniversity || !floorLevel) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate nearbyUniversities array
    if (!nearbyUniversities || !Array.isArray(nearbyUniversities) || nearbyUniversities.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one nearby university'
      });
    }

    // Create new room
    const room = new Room({
      roomNumber,
      type,
      price,
      capacity,
      location,
      nearbyUniversities,
      distanceToUniversity,
      floorLevel,
      floor,
      size,
      description,
      facilities,
      amenities,
      propertyAmenities,
      features,
      building,
      checkInTime,
      leaseStart,
      securityDeposit,
      rules
    });

    await room.save();

    res.status(201).json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating room',
      error: error.message
    });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const {
      roomNumber,
      type,
      price,
      capacity,
      location,
      nearbyUniversities,
      distanceToUniversity,
      floorLevel,
      floor,
      size,
      description,
      facilities,
      amenities,
      propertyAmenities,
      features,
      building,
      checkInTime,
      leaseStart,
      securityDeposit,
      rules
    } = req.body;

    // Validate required fields if they are being updated
    if (roomNumber || type || price || capacity || location || distanceToUniversity || floorLevel) {
      if (!roomNumber || !type || !price || !capacity || !location || !distanceToUniversity || !floorLevel) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields when updating core room details'
        });
      }
    }

    // Validate nearbyUniversities array if it's being updated
    if (nearbyUniversities) {
      if (!Array.isArray(nearbyUniversities) || nearbyUniversities.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Please provide at least one nearby university'
        });
      }
    }

    const room = await Room.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          roomNumber,
          type,
          price,
          capacity,
          location,
          nearbyUniversities,
          distanceToUniversity,
          floorLevel,
          floor,
          size,
          description,
          facilities,
          amenities,
          propertyAmenities,
          features,
          building,
          checkInTime,
          leaseStart,
          securityDeposit,
          rules
        }
      },
      { new: true, runValidators: true }
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating room',
      error: error.message
    });
  }
};