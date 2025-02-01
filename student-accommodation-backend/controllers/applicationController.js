const Application = require('../models/Application');
const Room = require('../models/Room');
const Student = require('../models/Student');

// Validate preferences
const validatePreferences = (preferences) => {
  if (!preferences) return null;

  const validFloorLevels = ['ground', 'low', 'mid', 'high'];
  const validRoommateGenders = ['same', 'any'];
  const validRoomTypes = ['single', 'double', 'suite'];
  const validStudyHabits = ['early', 'night', 'mixed'];
  const validSleepSchedules = ['early', 'medium', 'late'];

  const errors = [];

  if (preferences.floorLevel && !validFloorLevels.includes(preferences.floorLevel)) {
    errors.push('Invalid floor level preference');
  }
  if (preferences.roommateGender && !validRoommateGenders.includes(preferences.roommateGender)) {
    errors.push('Invalid roommate gender preference');
  }
  if (preferences.roomType && !validRoomTypes.includes(preferences.roomType)) {
    errors.push('Invalid room type preference');
  }
  if (preferences.studyHabits && !validStudyHabits.includes(preferences.studyHabits)) {
    errors.push('Invalid study habits preference');
  }
  if (preferences.sleepSchedule && !validSleepSchedules.includes(preferences.sleepSchedule)) {
    errors.push('Invalid sleep schedule preference');
  }
  if (preferences.quietStudyArea !== undefined && typeof preferences.quietStudyArea !== 'boolean') {
    errors.push('Invalid quiet study area preference');
  }

  return errors.length > 0 ? errors : null;
};

// Submit a new application
exports.submitApplication = async (req, res) => {
  try {
    const { roomId, preferences, ...applicationData } = req.body;

    // Check if room exists and is available
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    if (!room.isAvailable) {
      return res.status(400).json({ error: 'Room is not available' });
    }

    // Validate preferences if provided
    if (preferences) {
      const preferenceErrors = validatePreferences(preferences);
      if (preferenceErrors) {
        return res.status(400).json({ 
          error: 'Invalid preferences', 
          details: preferenceErrors 
        });
      }

      // Override room type preference with selected room type
      preferences.roomType = room.type;
    }

    // Check if student already has a pending application
    const existingApplication = await Application.findOne({
      studentId: applicationData.studentId,
      status: 'pending'
    });
    if (existingApplication) {
      return res.status(400).json({ error: 'You already have a pending application' });
    }

    const application = new Application({
      ...applicationData,
      roomId,
      preferences: preferences || {}
    });
    await application.save();

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all applications (admin only)
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('roomId')
      .sort({ submittedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get applications by student ID
exports.getStudentApplications = async (req, res) => {
  try {
    const { studentId } = req.params;
    const applications = await Application.find({ studentId })
      .populate('roomId')
      .sort({ submittedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update application status (admin only)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // If approving, check if room is still available
    if (status === 'approved') {
      const room = await Room.findById(application.roomId);
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
      if (!room.isAvailable) {
        return res.status(400).json({ error: 'Room is no longer available' });
      }

      try {
        // Find student by studentId or email
        let student = await Student.findOne({
          $or: [
            { studentId: application.studentId },
            { email: application.email }
          ]
        });
        
        if (student) {
          // If student exists, check if they already have a room
          if (student.assignedRoom) {
            return res.status(400).json({ error: 'Student already has an assigned room' });
          }
          
          // Update existing student's information
          student.name = `${application.firstName} ${application.lastName}`;
          student.phone = application.phone;
          if (student.studentId !== application.studentId) {
            student.studentId = application.studentId;
          }
          if (student.email !== application.email) {
            student.email = application.email;
          }
        } else {
          // Create new student
          student = new Student({
            studentId: application.studentId,
            name: `${application.firstName} ${application.lastName}`,
            email: application.email,
            phone: application.phone
          });
        }

        // Update student's room assignment
        student.assignedRoom = application.roomId;
        await student.save();

        // Update room occupancy
        if (!room.occupants) {
          room.occupants = [];
        }
        
        if (!room.occupants.includes(student._id)) {
          room.occupants.push(student._id);
        }

        // Update room availability based on capacity
        if (room.occupants.length >= room.capacity) {
          room.isAvailable = false;
        }
        
        await room.save();

        // Update application status
        application.status = status;
        application.processedAt = new Date();
        await application.save();

        return res.json(application);
      } catch (error) {
        console.error('Error in student/room update:', error);
        if (error.code === 11000) {
          return res.status(400).json({ 
            error: 'Student with this email or student ID already exists',
            details: error.message
          });
        }
        throw error;
      }
    }

    // If not approving, just update the status
    application.status = status;
    application.processedAt = new Date();
    await application.save();

    res.json(application);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: error.message });
  }
};

// Cancel application (student only)
exports.cancelApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId } = req.body;

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.studentId !== studentId) {
      return res.status(403).json({ error: 'Not authorized to cancel this application' });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ error: 'Can only cancel pending applications' });
    }

    application.status = 'cancelled';
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 