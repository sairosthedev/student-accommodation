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
    console.log('\nGetting student details:');
    console.log('  ID:', req.params.id);
    
    // First try to find by studentId
    let student = await Student.findOne({ studentId: req.params.id })
      .populate('assignedRoom', 'roomNumber capacity isAvailable');
    
    // If not found, try to find by MongoDB _id
    if (!student) {
      console.log('  No student found by studentId, trying _id');
      student = await Student.findById(req.params.id)
        .populate('assignedRoom', 'roomNumber capacity isAvailable');
    }

    if (!student) {
      console.log('  No student found with either ID');
      return res.status(404).json({ error: 'Student not found' });
    }

    console.log('  Found student:', student);
    res.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
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

// Get student room details
exports.getStudentRoomDetails = async (req, res) => {
  try {
    console.log('\nGetting room details:');
    console.log('  Student ID:', req.params.id);
    
    // First try to find by studentId
    let student = await Student.findOne({ studentId: req.params.id });
    
    // If not found, try to find by MongoDB _id
    if (!student) {
      console.log('  No student found by studentId, trying _id');
      student = await Student.findById(req.params.id);
    }

    console.log('  Found student:', student);

    if (!student) {
      console.log('  No student found with either ID');
      return res.status(404).json({ error: 'Student not found' });
    }

    if (!student.assignedRoom) {
      console.log('  Student has no assigned room:', student);
      return res.status(404).json({ error: 'No room assigned to this student' });
    }

    // Populate the room details
    const populatedStudent = await Student.findById(student._id)
      .populate({
        path: 'assignedRoom',
        select: 'roomNumber type price isAvailable facilities description floorLevel floor size checkInTime leaseStart securityDeposit rules building amenities features',
      });

    console.log('  Populated student:', populatedStudent);
    console.log('  Assigned room:', populatedStudent.assignedRoom);

    if (!populatedStudent.assignedRoom) {
      console.log('  Failed to populate room details');
      return res.status(404).json({ error: 'Failed to load room details' });
    }

    // Format the room details to match the frontend expectations
    const roomDetails = {
      ...populatedStudent.assignedRoom.toObject(),
      facilities: populatedStudent.assignedRoom.facilities || [],
      amenities: populatedStudent.assignedRoom.amenities || [],
      rules: populatedStudent.assignedRoom.rules || [
        'Quiet hours: 10 PM - 6 AM',
        'No smoking inside the building',
        'Visitors allowed: 8 AM - 8 PM',
        'Keep common areas clean'
      ]
    };

    console.log('  Sending room details:', roomDetails);
    res.json(roomDetails);
  } catch (error) {
    console.error('Error fetching student room details:', error);
    res.status(500).json({ error: error.message });
  }
};