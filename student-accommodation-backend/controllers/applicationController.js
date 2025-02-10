const Application = require('../models/Application');
const Room = require('../models/Room');
const Student = require('../models/Student');
const nodemailer = require('nodemailer');
const { generateApplicationId } = require('../utils/idGenerator');
const User = require('../models/User');

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // upgrade later with STARTTLS
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  },
  logger: true,
  debug: true // include SMTP traffic in the logs
});

// Verify transporter connection
transporter.verify(function(error, success) {
  if (error) {
    console.error('Email configuration error:', error);
    console.error('Error details:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
      stack: error.stack
    });
    console.log('Current email configuration:', {
      user: process.env.EMAIL_USER,
      passLength: process.env.EMAIL_APP_PASSWORD ? process.env.EMAIL_APP_PASSWORD.length : 0,
      host: 'smtp.gmail.com',
      port: 587
    });
  } else {
    console.log('Email server is ready to send messages');
  }
});

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

    // Generate unique application ID
    const applicationId = generateApplicationId();

    const application = new Application({
      ...applicationData,
      applicationId,
      roomId,
      preferences: preferences || {}
    });
    await application.save();

    // Send confirmation email
    const emailContent = `
      Dear ${applicationData.firstName} ${applicationData.lastName},

      Thank you for submitting your accommodation application. Your application has been received and is being processed.

      Application Details:
      - Application ID: ${applicationId}
      - Room Number: ${room.number}
      - Room Type: ${room.type}
      - Status: Pending

      Please save your Application ID for future reference. You will need this ID to:
      1. Track your application status
      2. Complete your registration once approved
      3. Communicate with the administration

      We will notify you of any updates to your application status.

      Best regards,
      Student Accommodation Team
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: applicationData.email,
      subject: 'Student Accommodation Application Confirmation',
      text: emailContent
    });

    res.status(201).json({
      ...application.toObject(),
      message: 'Application submitted successfully. Please check your email for the application ID.'
    });
  } catch (error) {
    console.error('Error in submitApplication:', error);
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

    const application = await Application.findById(id).populate('roomId');
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
            phone: application.phone,
            program: application.program,
            assignedRoom: room._id
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

        // Send approval email
        const approvalEmailContent = `
          Dear ${application.firstName} ${application.lastName},

          Congratulations! Your accommodation application has been approved.

          Application Details:
          - Application ID: ${application.applicationId}
          - Room Number: ${room.roomNumber}
          - Room Type: ${room.type}
          - Status: Approved

          Important Next Steps:
          1. Use your Application ID (${application.applicationId}) to create your student account
          2. Complete your registration within 48 hours
          3. Review the accommodation rules and guidelines
          4. Contact the administration if you have any questions

          Welcome to our student accommodation!

          Best regards,
          Student Accommodation Team
        `;

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: application.email,
          subject: 'Student Accommodation Application Approved',
          text: approvalEmailContent
        });

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

    // If rejecting or other status update
    application.status = status;
    application.processedAt = new Date();
    await application.save();

    // Send rejection email if status is rejected
    if (status === 'rejected') {
      const rejectionEmailContent = `
        Dear ${application.firstName} ${application.lastName},

        We regret to inform you that your accommodation application has been reviewed and could not be approved at this time.

        Application Details:
        - Application ID: ${application.applicationId}
        - Status: Rejected
        - Date: ${new Date().toLocaleDateString()}

        If you would like to:
        1. Appeal this decision
        2. Apply for a different room
        3. Get more information about the decision

        Please contact our administration office.

        Best regards,
        Student Accommodation Team
      `;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: application.email,
        subject: 'Student Accommodation Application Status Update',
        text: rejectionEmailContent
      });
    }

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

// Verify application code
exports.verifyApplicationCode = async (req, res) => {
  try {
    const { applicationCode, email } = req.body;
    console.log('Verifying application code:', { applicationCode, email });

    if (!applicationCode || !email) {
      console.log('Missing required fields');
      return res.status(400).json({ 
        error: 'Application code and email are required' 
      });
    }

    // Find the application with the given code and email
    const application = await Application.findOne({
      applicationId: applicationCode,
      email: email.toLowerCase()
    });

    console.log('Found application:', application);

    if (!application) {
      console.log('No application found with provided code and email');
      return res.status(404).json({ 
        error: 'Invalid application code or email' 
      });
    }

    // Check if a user already exists with this application code
    const existingUser = await User.findOne({ applicationCode });
    console.log('Existing user check:', { exists: !!existingUser });

    if (existingUser) {
      return res.status(400).json({ 
        error: 'This application code has already been used for registration' 
      });
    }

    console.log('Verification successful');
    res.json({ 
      valid: true,
      message: 'Application code verified successfully',
      application: {
        id: application._id,
        status: application.status,
        firstName: application.firstName,
        lastName: application.lastName,
        email: application.email,
        program: application.program,
        studentId: application.studentId,
        phone: application.phone
      }
    });
  } catch (error) {
    console.error('Error verifying application code:', error);
    res.status(500).json({ error: error.message });
  }
}; 