// routes/upload.js
const express = require('express');
const router = express.Router();

// Mock file upload endpoint
router.post('/', (req, res) => {
  const timestamp = Date.now();
  const mockFilename = `${timestamp}.png`;
  
  res.status(200).json({
    success: true,
    filename: mockFilename,
    url: `/uploads/${mockFilename}`
  });
});

module.exports = router;
