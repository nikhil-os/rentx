const express = require('express');
const router = express.Router();
const { auth } = require('../config/firebase');
const { signInWithPopup, GoogleAuthProvider } = require('firebase/auth');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Mock Google auth endpoint
router.post('/login', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'User logged in with Google successfully',
    token: 'mock-google-jwt-token',
    user: {
      id: 'google-123456',
      name: 'Google User',
      email: req.body.email || 'google-user@example.com',
      picture: 'https://via.placeholder.com/150'
    }
  });
});

router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    
    // Verify the ID token
    const credential = GoogleAuthProvider.credential(idToken);
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    const { user } = result;
    
    // Check if user exists in our database
    let dbUser = await User.findOne({ email: user.email });
    
    if (!dbUser) {
      // Create new user if doesn't exist
      dbUser = await User.create({
        name: user.displayName,
        email: user.email,
        profilePicture: user.photoURL,
        googleId: user.uid,
        isEmailVerified: user.emailVerified
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: dbUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: dbUser._id,
        name: dbUser.name,
        email: dbUser.email,
        profilePicture: dbUser.profilePicture,
        isEmailVerified: dbUser.isEmailVerified
      }
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

module.exports = router; 