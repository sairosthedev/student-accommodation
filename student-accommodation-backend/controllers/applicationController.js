const Application = require('../models/Application');
const Room = require('../models/Room');
const Student = require('../models/Student');

// Submit a new application
exports.submitApplication = async (req, res) => {
  try {
    const { roomId, ...applicationData } = req.body;

    // Check if room exists and is available
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    if (!room.isAvailable) {
      return res.status(400).json({ error: 'Room is not available' });
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
      roomId
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
      if (!room || !room.isAvailable) {
        return res.status(400).json({ error: 'Room is no longer available' });
      }

      // Create or update student record
      let student = await Student.findOne({ studentId: application.studentId });
      if (!student) {
        student = new Student({
          studentId: application.studentId,
          name: `${application.firstName} ${application.lastName}`,
          email: application.email,
          phone: application.phone,
          program: application.program,
          yearOfStudy: application.yearOfStudy
        });
      }
      student.assignedRoom = application.roomId;
      await student.save();

      // Update room occupancy
      room.occupants.push(student._id);
      if (room.occupants.length >= room.capacity) {
        room.isAvailable = false;
      }
      await room.save();
    }

    application.status = status;
    application.processedAt = new Date();
    // Remove the dependency on req.user._id
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
    const { studentId } = req.body; // Assuming middleware validates student

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