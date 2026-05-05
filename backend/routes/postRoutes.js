// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');

// Apply authMiddleware to all routes in this router
router.use(authMiddleware);

// Create new post
router.post('/', postController.createPost);

// Get pending posts (admin only)
router.get('/pending', postController.getPendingPosts);

// Get approved posts
router.get('/approved', postController.getApprovedPosts);


// Update post status (admin only)
router.put('/:id', postController.updatePostStatus);

module.exports = router;