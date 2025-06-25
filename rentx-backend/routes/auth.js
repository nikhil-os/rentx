require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

console.log('[auth.js] JWT_SECRET =', process.env.JWT_SECRET || 'rentx_secret_key_for_authentication');

// Mock auth endpoints
router.post('/register', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'User registered successfully',
    user: {
      id: '123456',
      name: req.body.name || 'Test User',
      email: req.body.email || 'test@example.com'
    }
  });
});

router.post('/login', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'User logged in successfully',
    token: 'mock-jwt-token',
    user: {
      id: '123456',
      name: 'Test User',
      email: req.body.email || 'test@example.com'
    }
  });
});

router.get('/me', (req, res) => {
  res.status(200).json({ 
    success: true,
    user: {
      id: '123456',
      name: 'Test User',
      email: 'test@example.com'
    }
  });
});

router.post('/signup', async (req, res) => {
  console.log('POST /api/auth/signup hit', req.body);
  console.log('BODY RECEIVED:', req.body);
  const { name, email, password, phone } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email already in use' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.put('/profile', auth, async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    const updatedUser = await User.findById(req.userId).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post('/check-user', async (req, res) => {
  console.log('POST /api/auth/check-user hit', req.body);
  const { email } = req.body;
  
  if (!email) {
    console.log('Email is required');
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    console.log('Finding user with email:', email);
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('User not found with email:', email);
      return res.status(404).json({ message: 'User not found with this email' });
    }

    console.log('User found:', user._id);
    const phone = user.phone || '';
    const maskedPhone = phone.length > 4 
      ? `${phone.slice(0, -4).replace(/\d/g, '*')}${phone.slice(-4)}` 
      : phone;

    res.status(200).json({ 
      message: 'User found',
      phone: user.phone || ''
    });
  } catch (err) {
    console.error('Check user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/reset-password', async (req, res) => {
  console.log('POST /api/auth/reset-password hit', req.body);
  const { email, phone, password } = req.body;
  
  if (!email || !phone || !password) {
    return res.status(400).json({ message: 'Email, phone and password are required' });
  }

  try {
    const user = await User.findOne({ email, phone });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email and phone combination' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/check-email-exists', async (req, res) => {
  console.log('POST /api/auth/check-email-exists hit', req.body);
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });
    
    res.status(200).json({ 
      exists: !!user
    });
  } catch (err) {
    console.error('Check email error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
