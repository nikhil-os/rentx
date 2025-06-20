// routes/otp.js
const express = require('express');
const router = express.Router();
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;

const client = twilio(accountSid, authToken);

// Test endpoint to check if the OTP route is accessible
router.get('/test', (req, res) => {
  res.json({ 
    message: 'OTP route is working!',
    twilioConfigured: Boolean(accountSid && authToken && verifySid)
  });
});

router.post('/send-otp', async (req, res) => {
  const { phone } = req.body;
  try {
    console.log(`Attempting to send OTP to +91${phone}`);
    await client.verify.v2.services(verifySid)
      .verifications
      .create({ to: `+91${phone}`, channel: 'sms' });
    console.log(`OTP sent successfully to +91${phone}`);
    res.json({ success: true });
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/verify-otp', async (req, res) => {
  const { phone, code } = req.body;
  try {
    const verification_check = await client.verify.v2.services(verifySid)
      .verificationChecks
      .create({ to: `+91${phone}`, code });
    if (verification_check.status === 'approved') {
      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Invalid OTP' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
