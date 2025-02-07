const Message = require('../models/Message');
const User = require('../models/User');

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { content, chatRoom, receiverId } = req.body;
    const senderId = req.user._id;

    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      chatRoom,
      content,
      type: 'text'
    });

    await message.save();

    // Populate sender and receiver details
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'email role')
      .populate('receiver', 'email role');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get messages for a chat room
exports.getChatMessages = async (req, res) => {
  try {
    const { chatRoom } = req.params;
    const messages = await Message.find({ chatRoom })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('sender', 'email role')
      .populate('receiver', 'email role');

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const { chatRoom } = req.params;
    const userId = req.user._id;

    await Message.updateMany(
      {
        chatRoom,
        receiver: userId,
        isRead: false
      },
      {
        $set: { isRead: true }
      }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get unread message count
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;
    const unreadCount = await Message.countDocuments({
      receiver: userId,
      isRead: false
    });

    res.json({ unreadCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user's chat rooms
exports.getUserChats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all messages where user is either sender or receiver
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
    .sort({ createdAt: -1 })
    .populate('sender', 'email role')
    .populate('receiver', 'email role');

    // Extract unique chat rooms
    const chatRooms = [...new Set(messages.map(msg => msg.chatRoom))];

    // Get latest message and unread count for each chat room
    const chats = await Promise.all(chatRooms.map(async (room) => {
      const latestMessage = await Message.findOne({ chatRoom: room })
        .sort({ createdAt: -1 })
        .populate('sender', 'email role')
        .populate('receiver', 'email role');

      const unreadCount = await Message.countDocuments({
        chatRoom: room,
        receiver: userId,
        isRead: false
      });

      return {
        chatRoom: room,
        latestMessage,
        unreadCount
      };
    }));

    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark chat as resolved (admin only)
exports.resolveChat = async (req, res) => {
  try {
    const { chatRoom } = req.params;
    
    await Message.updateMany(
      { chatRoom },
      { $set: { status: 'resolved' } }
    );

    res.json({ message: 'Chat marked as resolved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Assign chat to staff member (admin only)
exports.assignChat = async (req, res) => {
  try {
    const { chatRoom } = req.params;
    const { staffId } = req.body;

    await Message.updateMany(
      { chatRoom },
      { $set: { assignedTo: staffId } }
    );

    res.json({ message: 'Chat assigned successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get assigned chats (admin only)
exports.getAssignedChats = async (req, res) => {
  try {
    const userId = req.user._id;
    const messages = await Message.find({ assignedTo: userId })
      .sort({ createdAt: -1 })
      .populate('sender', 'email role')
      .populate('receiver', 'email role');

    const chatRooms = [...new Set(messages.map(msg => msg.chatRoom))];
    const chats = await Promise.all(chatRooms.map(async (room) => {
      const latestMessage = await Message.findOne({ chatRoom: room })
        .sort({ createdAt: -1 })
        .populate('sender', 'email role')
        .populate('receiver', 'email role');

      const unreadCount = await Message.countDocuments({
        chatRoom: room,
        receiver: userId,
        isRead: false
      });

      return {
        chatRoom: room,
        latestMessage,
        unreadCount
      };
    }));

    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get resolved chats (admin only)
exports.getResolvedChats = async (req, res) => {
  try {
    const messages = await Message.find({ status: 'resolved' })
      .sort({ createdAt: -1 })
      .populate('sender', 'email role')
      .populate('receiver', 'email role');

    const chatRooms = [...new Set(messages.map(msg => msg.chatRoom))];
    const chats = await Promise.all(chatRooms.map(async (room) => {
      const latestMessage = await Message.findOne({ chatRoom: room })
        .sort({ createdAt: -1 })
        .populate('sender', 'email role')
        .populate('receiver', 'email role');

      return {
        chatRoom: room,
        latestMessage,
        resolvedAt: messages.find(msg => msg.chatRoom === room).updatedAt
      };
    }));

    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new chat room
exports.createChatRoom = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user._id;

    // Generate a unique chat room ID
    const chatRoom = `chat_${Math.random().toString(36).substr(2, 9)}`;

    // Create initial message
    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      chatRoom,
      content: 'Started a conversation',
      type: 'system'
    });

    await message.save();

    // Return the chat room details
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'email role')
      .populate('receiver', 'email role');

    res.status(201).json({
      chatRoom,
      latestMessage: populatedMessage,
      unreadCount: 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get available users for chat
exports.getAvailableUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    
    // Get users excluding current user
    const users = await User.find({
      _id: { $ne: currentUserId },
      role: { $in: ['admin', 'student', 'staff'] }
    })
    .select('name email role')
    .sort('role name');

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 