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
  amenities: [{ 
    type: String 
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
  }]
}, {
  timestamps: true
});

// Add index for faster queries on floor level and room type
roomSchema.index({ floorLevel: 1, type: 1 });
roomSchema.index({ 'features.quietStudyArea': 1 });

module.exports = mongoose.model('Room', roomSchema);