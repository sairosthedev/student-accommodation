const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  studentId: {
    type: String,
    required: true
  },
  program: {
    type: String,
    required: true
  },
  yearOfStudy: {
    type: String,
    required: true
  },
  specialRequirements: {
    type: String
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  // Room preferences fields
  preferences: {
    floorLevel: {
      type: String,
      enum: ['ground', 'low', 'mid', 'high']
    },
    roommateGender: {
      type: String,
      enum: ['same', 'any']
    },
    quietStudyArea: {
      type: Boolean,
      default: false
    },
    roomType: {
      type: String,
      enum: ['single', 'double', 'suite']
    },
    studyHabits: {
      type: String,
      enum: ['early', 'night', 'mixed']
    },
    sleepSchedule: {
      type: String,
      enum: ['early', 'medium', 'late']
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  processedAt: {
    type: Date
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
});

// Index for faster queries
applicationSchema.index({ studentId: 1, status: 1 });
applicationSchema.index({ roomId: 1, status: 1 });

module.exports = mongoose.model('Application', applicationSchema); 