const express = require('express');
const router = express.Router();
//const chatController = require('../controllers/chatController');
const chatController = require('../controllers/chatController');
const upload = require('../middlewares/upload');

console.log('✅ chatRoutes loaded'); // ← Add this line here

// ✅ Send message with optional file upload
router.post('/send', upload.single('file'), chatController.sendMessage);

// ✅ Fetch messages between two users
//router.get('/chat/messages', chatController.getMessagesBetweenUsers);
router.get('/messages', chatController.getMessagesBetweenUsers);


// ✅ Fetch latest message and unread count per user
//router.get('/chat/conversations', chatController.getMessagesWithUsers);
router.get('/conversations', chatController.getMessagesWithUsers);


// ✅ Fallback for undefined routes
//router.use((req, res) => {
  //res.status(404).json({ message: 'Route not found' });
//});

module.exports = router;
