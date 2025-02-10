const mongoose = require('mongoose');

const maintenanceRequestSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  category: {
    type: String,
    enum: ['plumbing', 'electrical', 'furniture', 'appliance', 'structural', 'cleaning', 'other'],
    required: true
  },
  images: [{
    type: String // URLs to uploaded images
  }],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  comments: [{
    author: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  estimatedCompletionDate: Date
});

// Update the updatedAt timestamp before saving
maintenanceRequestSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('MaintenanceRequest', maintenanceRequestSchema); 