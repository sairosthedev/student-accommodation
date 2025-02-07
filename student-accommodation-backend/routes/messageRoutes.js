const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { isAdmin } = require('../middleware/auth');
const {
  sendMessage,
  getChatMessages,
  markAsRead,
  getUnreadCount,
  getUserChats,
  resolveChat,
  assignChat,
  getAssignedChats,
  getResolvedChats,
  createChatRoom,
  getAvailableUsers
} = require('../controllers/messageController');

// Debug middleware
router.use((req, res, next) => {
  console.log('\nMessage Route Debug:');
  console.log('  Method:', req.method);
  console.log('  URL:', req.url);
  console.log('  Path:', req.path);
  console.log('  Params:', req.params);
  next();
});

// Protected routes - require authentication
router.use(authenticateUser);

// Routes available to all authenticated users
router.post('/', sendMessage);
router.get('/chat/:chatRoom', getChatMessages);
router.put('/read/:chatRoom', markAsRead);
router.get('/unread', getUnreadCount);
router.get('/chats', getUserChats);
router.post('/create-room', createChatRoom);
router.get('/available-users', getAvailableUsers);

// Admin only routes
router.put('/resolve/:chatRoom', isAdmin, resolveChat);
router.put('/assign/:chatRoom', isAdmin, assignChat);
router.get('/assigned', isAdmin, getAssignedChats);
router.get('/resolved', isAdmin, getResolvedChats);

module.exports = router; 