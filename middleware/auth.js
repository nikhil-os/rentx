const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1]; // Bearer token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Set userId directly from token
    next();
  } catch (err) {
    console.error(err); // Log the actual error for debugging
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
