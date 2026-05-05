// controllers/postController.js
const Post = require('../models').Post;
const User = require('../models').User;
const roleMiddleware = require('../middlewares/roleMiddleware');

// Create post
exports.createPost = async (req, res) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      userId: req.user.id,
      status: 'pending'
    });
    
    // Include user data in response
    const newPost = await Post.findByPk(post.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['name']
      }]
    });
    
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
};

// Get pending posts (for admin)
exports.getPendingPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { status: 'pending' },
      include: [{
        model: User,
        as: 'user',
        attributes: ['name']
      }]
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

// Get approved posts (for community)
exports.getApprovedPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { status: 'approved' },
      include: [{
        model: User,
        as: 'user',
        attributes: ['name']
      }],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

// Update post status
exports.updatePostStatus = [
  roleMiddleware('admin'), 
  async (req, res) => {
    try {
      const post = await Post.findByPk(req.params.id);
      if (!post) return res.status(404).json({ error: 'Post not found' });

      post.status = req.body.status;
      await post.save();
      
      // Return updated post with user info
      const updatedPost = await Post.findByPk(post.id, {
        include: [{
          model: User,
          as: 'user',
          attributes: ['name']
        }]
      });
      
      res.status(200).json(updatedPost);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update post' });
    }
  }
];