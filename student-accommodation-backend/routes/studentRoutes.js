const express = require('express');
const router = express.Router();
const { 
  addStudent, 
  getStudents, 
  getStudent,
  updateStudent,
  deleteStudent 
} = require('../controllers/studentController');

// Log middleware for debugging
router.use((req, res, next) => {
  console.log(`Student Route: ${req.method} ${req.url}`);
  next();
});

// Routes
router.post('/', addStudent);
router.get('/', getStudents);
router.get('/:id', getStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

module.exports = router;