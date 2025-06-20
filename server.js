require('dotenv').config();

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'], // or your frontend port
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/otp', (req, res, next) => {
  console.log('OTP route hit:', req.method, req.originalUrl, req.body);
  next();
}, require('./routes/otp'));

app.get('/', (req, res) => {
  res.send('RentX API Running 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const bookingRoutes = require('./routes/booking');
// Register booking routes after app is initialized
app.use('/api/bookings', bookingRoutes);

app.use('/api/rentals', require('./routes/rentals'));
app.use('/api/upload', require('./routes/upload'));

