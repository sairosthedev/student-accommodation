const express = require('express');
const router = express.Router();
const { 
  addStudent, 
  getStudents, 
  getStudent,
  updateStudent,
  deleteStudent,
  getStudentRoomDetails 
} = require('../controllers/studentController');
const Student = require('../models/Student');

// Log middleware for debugging
router.use((req, res, next) => {
  console.log('\nStudent Route Debug:');
  console.log('  Method:', req.method);
  console.log('  URL:', req.url);
  console.log('  Path:', req.path);
  console.log('  Params:', req.params);
  next();
});

// Routes in order of specificity
router.post('/', addStudent);
router.get('/', getStudents);

// Debug routes (more specific than general routes)
router.get('/debug/all', async (req, res) => {
  try {
    console.log('Listing all students');
    const students = await Student.find()
      .populate('assignedRoom')
      .select('studentId email name assignedRoom');
    console.log('Found students:', students);
    res.json(students);
  } catch (error) {
    console.error('Error listing students:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/debug/:studentId', async (req, res) => {
  try {
    console.log('Checking student existence for ID:', req.params.studentId);
    const student = await Student.findOne({ studentId: req.params.studentId })
      .populate('assignedRoom');
    console.log('Found student:', student);
    res.json({ exists: !!student, student });
  } catch (error) {
    console.error('Error checking student:', error);
    res.status(500).json({ error: error.message });
  }
});

// Room details route (must come before /:id to avoid conflict)
router.get('/:id/room', getStudentRoomDetails);

// General ID-based routes
router.get('/:id', getStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

module.exports = router;