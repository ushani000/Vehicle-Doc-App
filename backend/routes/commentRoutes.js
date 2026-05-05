// routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

// Get comments for a post
router.get('/:postId/comments', commentController.getComments);

// Add comment to a post
router.post('/:postId/comments', commentController.addComment);

module.exports = router;