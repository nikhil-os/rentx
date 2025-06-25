// Load environment variables at the very beginning
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
  // Allow requests from both local and deployed frontend
  origin: ['http://localhost:3000', 'https://rentx-nikhil-os.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// MongoDB Connection (only connect if not in Vercel serverless environment)
if (process.env.NODE_ENV !== 'production') {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/rentx';
  console.log('MongoDB URI:', mongoURI);
  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
      console.error('❌ MongoDB connection error:', err.message);
      // Don't exit in production to allow serverless function to continue
      if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
      }
    });
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/google', require('./routes/google-auth'));

app.get('/', (req, res) => {
  res.send('RentX API Running 🚀');
});

// Health check endpoint for Vercel
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'RentX API is healthy' });
});

// Mock rentals endpoint for testing
app.get('/api/rentals', (req, res) => {
  // Return mock data for testing
  const mockRentals = [
    {
      _id: '1',
      title: 'Modern Apartment',
      description: 'A beautiful modern apartment in the city center',
      price: 1500,
      image: '/uploads/1749194838830.png',
      category: 'furniture',
      location: 'New York',
      user: { name: 'John Doe' }
    },
    {
      _id: '2',
      title: 'Vintage Camera',
      description: 'Professional vintage camera for rent',
      price: 200,
      image: '/uploads/1749194935554.png',
      category: 'electronics',
      location: 'Los Angeles',
      user: { name: 'Jane Smith' }
    },
    {
      _id: '3',
      title: 'Mountain Bike',
      description: 'High-performance mountain bike for adventures',
      price: 100,
      image: '/uploads/1749195039883.png',
      category: 'sports',
      location: 'Denver',
      user: { name: 'Mike Johnson' }
    }
  ];
  
  res.status(200).json(mockRentals);
});

const bookingRoutes = require('./routes/bookings');
// Register booking routes after app is initialized
app.use('/api/bookings', bookingRoutes);

app.use('/api/rentals', require('./routes/rentals'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/payments', require('./routes/payments'));

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export the Express API for Vercel
module.exports = app;

