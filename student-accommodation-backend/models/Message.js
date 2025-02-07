const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  chatRoom: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'archived'],
    default: 'active'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  category: {
    type: String,
    enum: ['support', 'maintenance', 'general'],
    default: 'general'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  metadata: {
    fileName: String,
    fileSize: Number,
    mimeType: String
  }
}, {
  timestamps: true
});

// Indexes for faster queries
messageSchema.index({ chatRoom: 1, createdAt: -1 });
messageSchema.index({ sender: 1, receiver: 1 });
messageSchema.index({ status: 1 });
messageSchema.index({ priority: 1 });
messageSchema.index({ category: 1 });
messageSchema.index({ assignedTo: 1 });

module.exports = mongoose.model('Message', messageSchema); 