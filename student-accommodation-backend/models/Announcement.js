const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['maintenance', 'event', 'academic', 'general'],
    default: 'general'
  },
  targetAudience: {
    type: [String],
    enum: ['all', 'students', 'staff'],
    default: ['all']
  },
  validUntil: {
    type: Date
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  }
}, {
  timestamps: true
});

// Indexes for faster queries
announcementSchema.index({ createdAt: -1 });
announcementSchema.index({ status: 1, priority: 1 });
announcementSchema.index({ category: 1 });
announcementSchema.index({ targetAudience: 1 });

module.exports = mongoose.model('Announcement', announcementSchema); 