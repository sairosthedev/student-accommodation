const Payment = require('../models/Payment');
const path = require('path');

// Create a new payment
exports.createPayment = async (req, res) => {
  try {
    const { studentId, amount, dueDate, paymentType, description } = req.body;
    console.log('Request Body:', req.body);
    const newPayment = new Payment({
      studentId,
      amount,
      dueDate,
      paymentType,
      description,
      status: 'pending'
    });
    const savedPayment = await newPayment.save();
    res.status(201).json(savedPayment);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedPayment = await Payment.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedPayment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(updatedPayment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get payments
exports.getPayments = async (req, res) => {
  try {
    const { studentId, status } = req.query;
    const query = {};
    if (studentId) query.studentId = studentId;
    if (status) query.status = status;
    const payments = await Payment.find(query);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add this method to your payment controller
exports.uploadProof = async (req, res) => {
  try {
    console.log('Upload proof request received:', {
      fileInfo: req.file,
      paymentId: req.params.id,
      body: req.body
    });

    if (!req.file) {
      console.log('No file received in request');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      console.log('Payment not found:', req.params.id);
      return res.status(404).json({ message: 'Payment not found' });
    }

    try {
      // Store just the filename in the database
      const filePath = `/uploads/proofs/${req.file.filename}`;
      console.log('File saved at:', req.file.path);
      console.log('Database file path:', filePath);

      // Update payment with proof file path
      payment.proofOfPayment = filePath;
      const updatedPayment = await payment.save();
      console.log('Payment updated successfully:', updatedPayment);

      // Test file accessibility
      const absolutePath = path.join(__dirname, '..', 'uploads/proofs', req.file.filename);
      console.log('Absolute file path:', absolutePath);
      console.log('File exists:', require('fs').existsSync(absolutePath));

      // Construct the full URL for the frontend
      const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
      const fileUrl = `${baseUrl}${filePath}`;

      res.json({ 
        success: true, 
        message: 'Proof of payment uploaded successfully',
        proofUrl: fileUrl,
        payment: updatedPayment
      });
    } catch (saveError) {
      console.error('Error saving to database:', saveError);
      throw saveError;
    }
  } catch (error) {
    console.error('Error in uploadProof:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      message: 'Error uploading proof of payment',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}; 