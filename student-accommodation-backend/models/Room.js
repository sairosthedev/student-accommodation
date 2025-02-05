const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true }, // Unique room number
  type: { 
    type: String, 
    required: true,
    enum: ['single', 'double', 'suite']
  },
  price: { 
    type: Number, 
    required: true,
    min: 0 
  },
  capacity: { 
    type: Number, 
    required: true,
    min: 1 
  },
  floorLevel: {
    type: String,
    required: true,
    enum: ['ground', 'low', 'mid', 'high']
  },
  floor: { type: String },
  size: { type: String },
  description: { type: String },
  facilities: [{ type: String }],
  amenities: [{ type: String }],
  features: {
    quietStudyArea: {
      type: Boolean,
      default: false
    },
    preferredGender: {
      type: String,
      enum: ['male', 'female', 'any'],
      default: 'any'
    }
  },
  image: { 
    type: String,
    default: '' 
  },
  isAvailable: { 
    type: Boolean, 
    default: true 
  },
  occupants: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student' 
  }],
  building: {
    name: { type: String },
    location: { type: String },
    wardenName: { type: String },
    emergencyContact: { type: String },
    facilities: [{ type: String }]
  },
  checkInTime: { type: String },
  leaseStart: { type: String },
  securityDeposit: { type: Number },
  rules: [{ type: String }]
}, {
  timestamps: true
});

// Add index for faster queries on floor level and room type
roomSchema.index({ floorLevel: 1, type: 1 });
roomSchema.index({ 'features.quietStudyArea': 1 });

module.exports = mongoose.model('Room', roomSchema);