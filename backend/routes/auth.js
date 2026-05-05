const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.post('/signup', register);
router.post('/signin', login); // ✅ add this

//router.post('/api/auth/signup', register);
//router.post('/api/auth/signin', login);  // Changed to match frontend


module.exports = router;
