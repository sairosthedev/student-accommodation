const Maintenance = require('../models/Maintenance');

// Create maintenance request
exports.createMaintenanceRequest = async (req, res) => {
  try {
    const { title, description, priority, location, room } = req.body;

    // Validate required fields
    if (!title || !description || !priority || !location) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, description, priority, and location are required' 
      });
    }

    // Validate priority
    if (!['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ 
        error: 'Invalid priority. Must be one of: low, medium, high' 
      });
    }

    // Create the request
    const request = new Maintenance({
      title,
      description,
      priority,
      location,
      room,
      requestedBy: req.user.userId, // Use userId from the JWT token
      status: 'pending'
    });

    // Save the request
    const savedRequest = await request.save();
    
    // Populate room details before sending response
    const populatedRequest = await Maintenance.findById(savedRequest._id)
      .populate('room', 'roomNumber')
      .populate('requestedBy', 'name email');

    res.status(201).json(populatedRequest);
  } catch (error) {
    console.error('Error creating maintenance request:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to create maintenance request',
      details: error.errors // Include mongoose validation errors if any
    });
  }
};

// Get all maintenance requests (admin only)
exports.getAllMaintenanceRequests = async (req, res) => {
  try {
    const requests = await Maintenance.find()
      .populate('requestedBy', 'name email')
      .populate('room', 'roomNumber');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user's maintenance requests
exports.getUserRequests = async (req, res) => {
  try {
    const requests = await Maintenance.find({ requestedBy: req.user.userId })
      .populate('room', 'roomNumber');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update maintenance request
exports.updateMaintenanceRequest = async (req, res) => {
  try {
    const request = await Maintenance.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body,
        completedAt: req.body.status === 'completed' ? new Date() : undefined
      },
      { new: true }
    );
    if (!request) {
      return res.status(404).json({ error: 'Maintenance request not found' });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete maintenance request
exports.deleteMaintenanceRequest = async (req, res) => {
  try {
    const request = await Maintenance.findByIdAndDelete(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Maintenance request not found' });
    }
    res.json({ message: 'Maintenance request deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get maintenance stats
exports.getMaintenanceStats = async (req, res) => {
  try {
    const [pending, inProgress, completed, highPriority] = await Promise.all([
      Maintenance.countDocuments({ status: 'pending' }),
      Maintenance.countDocuments({ status: 'in-progress' }),
      Maintenance.countDocuments({ status: 'completed' }),
      Maintenance.countDocuments({ priority: 'high' })
    ]);

    res.json({
      pending,
      inProgress,
      completed,
      highPriority
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user stats
exports.getUserStats = async (req, res) => {
  try {
    const [pending, inProgress, completed] = await Promise.all([
      Maintenance.countDocuments({ requestedBy: req.user.userId, status: 'pending' }),
      Maintenance.countDocuments({ requestedBy: req.user.userId, status: 'in-progress' }),
      Maintenance.countDocuments({ requestedBy: req.user.userId, status: 'completed' })
    ]);

    // Calculate average resolution time
    const completedRequests = await Maintenance.find({
      requestedBy: req.user.userId,
      status: 'completed',
      completedAt: { $exists: true }
    });

    let avgResolution = '0 Days';
    if (completedRequests.length > 0) {
      const totalDays = completedRequests.reduce((acc, req) => {
        const days = Math.ceil((req.completedAt - req.createdAt) / (1000 * 60 * 60 * 24));
        return acc + days;
      }, 0);
      avgResolution = `${Math.ceil(totalDays / completedRequests.length)} Days`;
    }

    res.json({
      pending,
      inProgress,
      completed,
      avgResolution
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upload images
exports.uploadImages = async (req, res) => {
  try {
    // Implement image upload logic here
    // You'll need to use a file upload middleware like multer
    res.json({ message: 'Image upload not implemented yet' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};