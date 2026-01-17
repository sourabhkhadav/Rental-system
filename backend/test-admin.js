const mongoose = require('mongoose');
const User = require('./models/User');
const Car = require('./models/Car');
const Booking = require('./models/Booking');
require('dotenv').config();

async function testAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car-rental');
    console.log('Connected to MongoDB');
    
    // Test admin user
    const admin = await User.findOne({ email: 'admin@gmail.com' });
    console.log('Admin user:', admin ? 'Found' : 'Not found');
    
    // Test counts
    const userCount = await User.countDocuments();
    const carCount = await Car.countDocuments();
    const bookingCount = await Booking.countDocuments();
    
    console.log('Stats:');
    console.log('- Users:', userCount);
    console.log('- Cars:', carCount);
    console.log('- Bookings:', bookingCount);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testAdmin();