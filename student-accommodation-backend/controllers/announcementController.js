const Announcement = require('../models/Announcement');

// Create a new announcement (admin only)
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content, priority, category, targetAudience, validUntil, attachments } = req.body;
    
    const announcement = new Announcement({
      title,
      content,
      author: req.user._id,
      priority,
      category,
      targetAudience,
      validUntil,
      attachments
    });

    await announcement.save();
    
    const populatedAnnouncement = await Announcement.findById(announcement._id)
      .populate('author', 'name email role');

    res.status(201).json(populatedAnnouncement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all announcements with filtering
exports.getAnnouncements = async (req, res) => {
  try {
    const { 
      status = 'published',
      category,
      priority,
      audience,
      page = 1,
      limit = 10
    } = req.query;

    const query = { status };
    
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (audience) query.targetAudience = audience;

    // Only show valid announcements
    query.$or = [
      { validUntil: { $gt: new Date() } },
      { validUntil: null }
    ];

    const announcements = await Announcement.find(query)
      .populate('author', 'name email role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Return announcements directly
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single announcement
exports.getAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('author', 'name email role');
    
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    res.json(announcement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an announcement (admin only)
exports.updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    ).populate('author', 'name email role');

    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    res.json(announcement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an announcement (admin only)
exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Archive an announcement (admin only)
exports.archiveAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { status: 'archived' },
      { new: true }
    ).populate('author', 'name email role');

    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    res.json(announcement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 