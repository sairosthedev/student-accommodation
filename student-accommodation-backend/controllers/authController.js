const User = require('../models/User');
const Student = require('../models/Student');
const jwt = require('jsonwebtoken');

// Function to generate student ID
const generateStudentId = () => {
  // Generate a random number between 1000 and 9999
  const randomNum = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  // Current year
  const year = new Date().getFullYear().toString().substr(-2);
  // Combine to create something like "23R1234"
  return `${year}R${randomNum}`;
};

// Register new user
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role, applicationCode, program, studentId } = req.body;

    console.log('Registration request received:', {
      firstName,
      lastName,
      email,
      phone,
      role,
      applicationCode,
      program,
      studentId
    });

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ 
        error: 'An account with this email already exists. Please log in instead.' 
      });
    }

    // Validate role
    if (!role || !['student', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    // For student registration
    if (role === 'student') {
      // Validate required fields for student registration
      if (!applicationCode) {
        return res.status(400).json({ error: 'Application code is required for student registration' });
      }
      if (!program) {
        return res.status(400).json({ error: 'Program is required for student registration' });
      }
      if (!studentId) {
        return res.status(400).json({ error: 'Student ID is required for student registration' });
      }

      // Check if student ID already exists
      const existingStudent = await Student.findOne({ studentId });
      if (existingStudent) {
        console.log('Student ID already exists:', studentId);
        // Check if there's a user account for this student
        const studentUser = await User.findOne({ studentId });
        if (studentUser) {
          return res.status(400).json({ 
            error: 'An account with this student ID already exists. Please log in instead.' 
          });
        }
        // If student exists but no user account, allow registration
        console.log('Student record exists but no user account found. Proceeding with registration.');
      } else {
        // Create new student record
        const student = new Student({
          name: `${firstName} ${lastName}`,
          email: email.toLowerCase(),
          phone,
          program,
          studentId
        });
        await student.save();
        console.log('Created new student record:', studentId);
      }
    }

    // Create user object based on role
    const userData = {
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      phone,
      role,
      studentId: role === 'student' ? studentId : undefined
    };

    // Only add applicationCode for students
    if (role === 'student') {
      userData.applicationCode = applicationCode;
    }

    // Create user
    const user = new User(userData);
    await user.save();
    console.log('Created new user account:', email);

    // Generate token
    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role,
        studentId: user.studentId 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Get student details if this is a student registration
    let studentDetails = null;
    if (role === 'student') {
      studentDetails = await Student.findOne({ studentId });
    }

    res.status(201).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        studentDetails
      }
    });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', { email });

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // If user is a student, get their student details
    let studentDetails = null;
    if (user.role === 'student' && user.studentId) {
      studentDetails = await Student.findOne({ studentId: user.studentId });
      console.log('Found student details:', studentDetails);
    }

    // Generate token
    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role,
        studentId: user.studentId 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    console.log('Login successful for:', email);

    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        studentDetails: studentDetails
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 