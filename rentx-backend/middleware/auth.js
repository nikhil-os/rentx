const jwt = require('jsonwebtoken');

// Simple mock auth middleware for testing
module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // For mock purposes, we'll just set a userId
    req.userId = '123456';
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
