const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

// POST /api/bookings - Create a booking
router.post('/', auth, async (req, res) => {
  try {
    const { name, phone, email, altPhone, address, deliveryMethod, preferredTime, specialRequests, pickupDate, returnDate, rentalId } = req.body;

    if (!name || !phone || !pickupDate || !returnDate || !rentalId || !email || !address) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const booking = new Booking({
      name,
      phone,
      email,
      altPhone,
      address,
      deliveryMethod,
      preferredTime,
      specialRequests,
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

// GET /api/bookings/:id - Get a booking by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('rental');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if the booking belongs to the authenticated user
    if (booking.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to access this booking' });
    }
    
    res.json(booking);
  } catch (err) {
    console.error("Booking Fetch Error:", err);
    res.status(500).json({ message: 'Server error while fetching booking' });
  }
});

// PUT /api/bookings/:id - Update a booking
router.put('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if the booking belongs to the authenticated user
    if (booking.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }
    
    // Fields that can be updated
    const updatableFields = [
      'name', 'phone', 'email', 'altPhone', 'address', 
      'deliveryMethod', 'preferredTime', 'specialRequests', 
      'pickupDate', 'returnDate', 'status', 'paymentStatus'
    ];
    
    // Update only the fields that are provided in the request
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        booking[field] = req.body[field];
      }
    });
    
    // Handle special case for endDate (for booking extensions)
    if (req.body.endDate) {
      booking.returnDate = req.body.endDate;
    }
    
    await booking.save();
    
    res.json(booking);
  } catch (err) {
    console.error("Booking Update Error:", err);
    res.status(500).json({ message: 'Server error while updating booking' });
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

// Mock bookings endpoints
router.get('/', (req, res) => {
  res.status(200).json([
    {
      _id: 'booking1',
      rental: {
        _id: '1',
        title: 'Modern Apartment',
        image: '/uploads/1749194838830.png',
        price: 1500
      },
      user: 'user1',
      pickupDate: '2025-07-01',
      returnDate: '2025-07-05',
      totalAmount: 6000,
      status: 'confirmed'
    },
    {
      _id: 'booking2',
      rental: {
        _id: '2',
        title: 'Vintage Camera',
        image: '/uploads/1749194935554.png',
        price: 200
      },
      user: 'user1',
      pickupDate: '2025-07-10',
      returnDate: '2025-07-15',
      totalAmount: 1000,
      status: 'pending'
    }
  ]);
});

router.get('/:id', (req, res) => {
  res.status(200).json({
    _id: req.params.id,
    rental: {
      _id: '1',
      title: 'Modern Apartment',
      image: '/uploads/1749194838830.png',
      price: 1500,
      description: 'A beautiful modern apartment in the city center',
      location: 'New York'
    },
    user: 'user1',
    pickupDate: '2025-07-01',
    returnDate: '2025-07-05',
    totalAmount: 6000,
    status: 'confirmed'
  });
});

router.post('/', (req, res) => {
  res.status(201).json({
    _id: 'new-booking-id',
    rental: req.body.rentalId || '1',
    user: 'user1',
    pickupDate: req.body.pickupDate || '2025-07-01',
    returnDate: req.body.returnDate || '2025-07-05',
    totalAmount: req.body.totalAmount || 6000,
    status: 'confirmed'
  });
});

module.exports = router;
