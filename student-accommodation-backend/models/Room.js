const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true }, // Unique room number
  capacity: { type: Number, required: true }, // Maximum number of occupants
  occupants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }], // List of students in the room
  isAvailable: { type: Boolean, default: true }, // Room availability status
});

module.exports = mongoose.model('Room', roomSchema);