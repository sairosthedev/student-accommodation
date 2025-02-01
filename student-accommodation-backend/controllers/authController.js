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
    const { email, password, role, name, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    let studentId;
    if (role === 'student') {
      // Generate a unique student ID
      let isUnique = false;
      let generatedStudentId;
      
      while (!isUnique) {
        generatedStudentId = generateStudentId();
        const existingStudent = await Student.findOne({ studentId: generatedStudentId });
        if (!existingStudent) {
          isUnique = true;
        }
      }

      // Create student record with generated ID
      const student = new Student({
        studentId: generatedStudentId,
        name,
        email,
        phone
      });
      const savedStudent = await student.save();
      studentId = savedStudent._id;
    }

    // Create user
    const user = new User({
      email,
      password,
      role,
      studentId
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        studentId: user.studentId
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        studentId: user.studentId
      }
    });
  } catch (error) {
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