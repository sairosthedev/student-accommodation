const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  invoiceId: {
    type: String,
    unique: true,
    required: true,
    default: function() {
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `INV${year}${month}${day}-${random}`;
    }
  },
  studentId: {
    type: String,
    required: function() { 
      return this.paymentType === 'rent';
    }
  },
  studentName: {
    type: String,
    required: function() {
      return this.paymentType === 'rent';
    }
  },
  studentEmail: {
    type: String,
    required: function() {
      return this.paymentType === 'rent';
    }
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
    enum: ['rent', 'deposit', 'utilities', 'maintenance', 'other'],
    required: true
  },
  description: String,
  paidAt: Date,
  transactionId: String,
  proofOfPayment: {
    type: String,
    default: null
  }
}, {
  timestamps: true // This adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Payment', paymentSchema);
 