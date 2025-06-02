const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

// POST /api/bookings - Create a booking
router.post('/', auth, async (req, res) => {
  try {
    console.log('Booking request body:', req.body);
    console.log('User ID from token:', req.userId);

    const { rental, startDate, endDate } = req.body;

    const booking = new Booking({
      user: req.userId, // Use req.userId instead of req.user.id
      rental,
      startDate,
      endDate
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    console.error('Booking creation error:', err);
    res.status(500).json({ message: 'Server error while creating booking' });
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
