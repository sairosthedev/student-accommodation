const Student = require('../models/Student');
const Room = require('../models/Room');

// Add a new student
exports.addStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all students
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('assignedRoom', 'roomNumber capacity isAvailable');
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single student
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('assignedRoom', 'roomNumber capacity isAvailable');
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a student
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('assignedRoom', 'roomNumber capacity isAvailable');
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
  try {
    console.log('Attempting to delete student with ID:', req.params.id);
    
    const student = await Student.findById(req.params.id);
    console.log('Found student:', student);
    
    if (!student) {
      console.log('Student not found with ID:', req.params.id);
      return res.status(404).json({ error: 'Student not found' });
    }

    // If student is assigned to a room, remove them from the room's occupants
    if (student.assignedRoom) {
      console.log('Removing student from room:', student.assignedRoom);
      await Room.findByIdAndUpdate(
        student.assignedRoom,
        { $pull: { occupants: student._id } }
      );
    }

    const result = await Student.findByIdAndDelete(req.params.id);
    console.log('Delete result:', result);
    
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: error.message });
  }
};