const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

// POST /api/bookings - Create a booking
router.post('/', auth, async (req, res) => {
  try {
    const { name, phone, pickupDate, returnDate, rentalId } = req.body;

    if (!name || !phone || !pickupDate || !returnDate || !rentalId) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const booking = new Booking({
      name,
      phone,
      pickupDate,
      returnDate,
      rental: rentalId,
      user: req.userId
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    console.error("Booking Save Error:", err);
    res.status(500).json({ message: 'Server error while saving booking' });
  }
});


// GET /api/bookings - Get user's bookings
router.get('/', auth, async (req, res) => {
  try {
    console.log('User ID from token:', req.userId);
    const bookings = await Booking.find({ user: req.userId }).populate('rental');
    res.json(bookings);
  } catch (err) {
    console.error('Booking fetch error:', err);
    res.status(500).json({ message: 'Server error while fetching bookings' });
  }
});

// GET /api/bookings/my - Get bookings for the logged-in user
router.get('/my', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId }).populate('rental');
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all bookings (Admin only)
router.get('/all', auth, async (req, res) => {
  try {
    // Optional: restrict this route to admin-only users
    // if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const bookings = await Booking.find().populate('user', 'name email').populate('rental');
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a booking (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Optional: only allow admin users
    // if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await booking.deleteOne();

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
