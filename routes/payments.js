const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const Razorpay = require('razorpay');

// Initialize Razorpay with the test keys
const razorpay = new Razorpay({
  key_id: 'rzp_test_qr86rR2VWnKDmy',
  key_secret: 'NEzR5jGuEXvJxnuHxQ15yFo4'
});

// POST /api/payments/create-order - Create a Razorpay order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { bookingId, amount } = req.body;
    
    if (!bookingId || !amount) {
      return res.status(400).json({ message: 'Booking ID and amount are required' });
    }
    
    // Get the booking to verify it belongs to the user
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (booking.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to pay for this booking' });
    }
    
    // Create Razorpay order
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `booking_${bookingId}`,
      notes: {
        bookingId: bookingId,
        userId: req.userId
      }
    };
    
    const order = await razorpay.orders.create(options);
    
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: razorpay.key_id
    });
  } catch (err) {
    console.error("Payment Order Creation Error:", err);
    res.status(500).json({ message: 'Server error while creating payment order' });
  }
});

// POST /api/payments/verify - Verify payment and update booking status
router.post('/verify', auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;
    
    // In a production environment, you would verify the signature here
    // For the test environment, we'll just update the booking status
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Update booking payment status
    booking.paymentStatus = 'Paid';
    booking.paymentId = razorpay_payment_id;
    booking.status = 'Active';
    await booking.save();
    
    res.json({ 
      success: true,
      message: 'Payment successful',
      booking
    });
  } catch (err) {
    console.error("Payment Verification Error:", err);
    res.status(500).json({ message: 'Server error while verifying payment' });
  }
});

module.exports = router; 