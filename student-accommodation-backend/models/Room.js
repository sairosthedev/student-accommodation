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
  amenities: [{ 
    type: String 
  }],
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

module.exports = mongoose.model('Room', roomSchema);