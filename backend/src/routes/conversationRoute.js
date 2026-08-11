const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const { authenticate } = require('../middleware/auth');

// Get all conversations for authenticated user
router.get('/', authenticate, conversationController.getConversations);

// Start or get existing conversation with recipient user ID
router.post('/', authenticate, conversationController.startConversation);

// Get messages for a specific conversation
router.get('/:id/messages', authenticate, conversationController.getMessages);

// Send message in a conversation
router.post('/:id/messages', authenticate, conversationController.sendMessage);

// Mark conversation messages as read
router.patch('/:id/read', authenticate, conversationController.markAsRead);

module.exports = router;
