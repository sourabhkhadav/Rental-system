const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cars', require('./routes/cars'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Car Rental API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car-rental')
  .then(() => {
    console.log('Connected to MongoDB');
    createAdminUser();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Create default admin user and test user
async function createAdminUser() {
  try {
    const User = require('./models/User');
    
    // Create admin user
    let adminUser = await User.findOne({ email: 'admin@gmail.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin',
        email: 'admin@gmail.com',
        password: 'admin123',
        phone: '9999999999',
        role: 'admin',
        status: 'approved'
      });
      console.log('Admin user created:', adminUser.email);
    }
    
    // Create/update test user
    let testUser = await User.findOne({ email: 'bhavishyajani09@gmail.com' });
    if (!testUser) {
      testUser = await User.create({
        name: 'Bhavishya',
        email: 'bhavishyajani09@gmail.com',
        password: 'bhavishya123',
        phone: '9876543210',
        role: 'user',
        status: 'approved'
      });
      console.log('Test user created:', testUser.email);
    } else {
      testUser.password = 'bhavishya123';
      testUser.status = 'approved';
      await testUser.save();
      console.log('Test user updated:', testUser.email);
    }
  } catch (error) {
    console.error('Error creating users:', error);
  }
}

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});