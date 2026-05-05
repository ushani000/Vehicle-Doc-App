// controllers/authController.js
const User = require('../models').User;
const LoginHistory = require('../models').LoginHistory;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ✅ Register controller
// controllers/authController.js
exports.register = async (req, res) => {
  const { name, phone, email, password } = req.body;
  try {
    console.log('Raw registration data:', {name, phone, email});

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Improved phone normalization
    const cleanPhone = phone.replace(/\D/g, ''); // Remove ALL non-digit characters
    
    // Debug logs
    console.log('Cleaned phone:', cleanPhone);
    
    let role = 'user';
    
    // Case-insensitive name check
    const normalizedName = name.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();
    
    // ADMIN CHECK (more robust)
    if (
      normalizedName === 'admin' &&
      normalizedEmail === 'admin@gmail.com' &&
      cleanPhone === '0112223338'
    ) {
      role = 'admin';
      console.log('✅ Assigning ADMIN role');
    } 
    // OFFICER CHECK
    else if (
      normalizedName.includes('motor traffic') &&
      normalizedEmail === 'motortraffic@gmail.com' &&
      cleanPhone === '0110333666'
    ) {
      role = 'officer';
      console.log('✅ Assigning OFFICER role');
    } else {
      console.log('⚠️ Assigning USER role');
    }

    const user = await User.create({
      name,
      phone,
      email,
      password: hashedPassword,
      role,
    });

    console.log('Created user with role:', user.role);
    
    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

    //
    //res.status(201).json({ message: 'User registered successfully', user });
  //} catch (err) {
    //console.error('Register error:', err);
    //res.status(500).json({ message: 'Registration failed', error: err });
  //}
//};

// ✅ Login controller
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

    const token = jwt.sign({ id: user.id, role: user.role }, 'secret-key', { expiresIn: '1h' });

    // Save login to LoginHistory
    await LoginHistory.create({
      userId: user.id,
      loginTime: new Date(),
    });

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login error', error: err });
  }
};
