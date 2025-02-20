const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true }, // Unique room number
  type: { 
    type: String, 
    required: true,
    enum: ['single', 'double', 'suite', 'apartment']
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
  location: {
    type: String,
    required: true,
    enum: [
      'Mount Pleasant',
      'Avondale',
      'Hatfield',
      'Belvedere',
      'Msasa',
      'Eastlea',
      'Milton Park',
      'Marlborough',
      'Greendale'
    ]
  },
  nearbyUniversities: [{
    type: String,
    enum: [
      'University of Zimbabwe',
      'Harare Institute of Technology',
      'Women\'s University in Africa',
      'Catholic University in Zimbabwe',
      'Zimbabwe Open University',
      'Africa University'
    ]
  }],
  distanceToUniversity: {
    type: String,
    required: true
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
  propertyAmenities: [{
    type: String,
    enum: [
      'High-speed WiFi',
      'Study Areas',
      'Security System',
      'Laundry Facilities',
      'Bike Storage',
      'Common Room',
      'Parking',
      'Garden',
      'CCTV',
      'Generator Backup'
    ]
  }],
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

// Add indexes for faster queries
roomSchema.index({ floorLevel: 1, type: 1 });
roomSchema.index({ location: 1 });
roomSchema.index({ nearbyUniversities: 1 });
roomSchema.index({ price: 1 });
roomSchema.index({ 'features.quietStudyArea': 1 });

module.exports = mongoose.model('Room', roomSchema);