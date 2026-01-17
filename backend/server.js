const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

const CORS_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:3000'];
const DEFAULT_PORT = 5005;

app.use(cors({ origin: CORS_ORIGINS, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/cars', require('./routes/cars'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/earnings', require('./routes/earnings'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/health', (req, res) => {
  res.json({ message: 'Car Rental API is running!' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car-rental');
    console.log('Connected to MongoDB');
    await createDefaultUsers();
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

const createDefaultUsers = async () => {
  try {
    const User = require('./models/User');
    const defaultUsers = [
      { name: 'Admin', email: 'admin@gmail.com', password: 'admin123', phone: '9999999999', role: 'admin' },
      { name: 'Bhavishya', email: 'bhavishyajani09@gmail.com', password: 'bhavishya123', phone: '9876543210', role: 'user' }
    ];

    for (const userData of defaultUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        await User.create({ ...userData, status: 'approved' });
      } else if (existingUser.status !== 'approved') {
        existingUser.status = 'approved';
        await existingUser.save();
      }
    }
  } catch (error) {
    console.error('Error creating users:', error);
  }
};

const PORT = process.env.PORT || DEFAULT_PORT;

connectDatabase();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});