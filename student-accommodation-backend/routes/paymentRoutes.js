const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const Payment = require('../models/Payment');

// Get next payment due
router.get('/next', authenticateUser, async (req, res) => {
  try {
    const nextPayment = await Payment.findOne({
      studentId: req.user.studentId,
      status: 'pending',
      dueDate: { $gte: new Date() }
    }).sort({ dueDate: 1 });

    res.json({
      nextPaymentDate: nextPayment ? nextPayment.dueDate.toLocaleDateString() : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 