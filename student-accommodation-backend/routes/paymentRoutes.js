const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const Payment = require('../models/Payment');
const paymentController = require('../controllers/paymentController');
const multer = require('multer');
const path = require('path');
const { join } = require('path');
const { existsSync } = require('fs');

// Add error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('Multer error:', err);
    return res.status(400).json({
      message: 'File upload error',
      error: err.message
    });
  } else if (err) {
    console.error('Unknown error during file upload:', err);
    return res.status(500).json({
      message: 'Unknown error occurred during file upload',
      error: err.message
    });
  }
  next();
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Use absolute path for uploads
    const uploadPath = path.join(__dirname, '..', 'uploads/proofs');
    console.log('Upload destination (absolute):', uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const safeFilename = `${uniqueSuffix}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    console.log('Generated filename:', safeFilename);
    cb(null, safeFilename);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    console.log('File type:', file.mimetype);
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG and PDF files are allowed.'));
    }
  }
});

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

// Create a new payment
router.post('/', authenticateUser, paymentController.createPayment);

// Update payment status
router.put('/:id/status', authenticateUser, paymentController.updatePaymentStatus);

// Get payments
router.get('/', authenticateUser, paymentController.getPayments);

// Update the upload route to include error handling
router.post(
  '/:id/upload-proof', 
  authenticateUser, 
  (req, res, next) => {
    console.log('Processing file upload for payment:', req.params.id);
    next();
  },
  upload.single('proofOfPayment'),
  handleMulterError,
  paymentController.uploadProof
);

router.get('/view-receipt', authenticateUser, async (req, res) => {
  try {
    const { path } = req.query;
    if (!path) {
      return res.status(400).json({ message: 'Receipt path is required' });
    }

    // Remove any leading slash and construct the full path
    const filePath = path.startsWith('/') ? path.substring(1) : path;
    const fullPath = join(__dirname, '..', filePath);

    // Check if file exists
    if (!existsSync(fullPath)) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    // Send the file
    res.sendFile(fullPath);
  } catch (error) {
    console.error('Error serving receipt:', error);
    res.status(500).json({ message: 'Error serving receipt file' });
  }
});

module.exports = router; 