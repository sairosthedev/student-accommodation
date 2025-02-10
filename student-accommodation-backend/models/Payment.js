const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue'],
    default: 'pending'
  },
  paymentType: {
    type: String,
    enum: ['rent', 'deposit', 'maintenance', 'other'],
    required: true
  },
  description: String,
  paidAt: Date,
  transactionId: String
});

module.exports = mongoose.model('Payment', paymentSchema);
 