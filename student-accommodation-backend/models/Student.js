const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  assignedRoom: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  paymentStatus: { type: Boolean, default: false },
});

module.exports = mongoose.model('Student', studentSchema);