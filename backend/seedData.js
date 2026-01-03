const mongoose = require('mongoose');
const Car = require('./models/Car');
const User = require('./models/User');
const Booking = require('./models/Booking');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Car.deleteMany({});
    await User.deleteMany({ role: { $ne: 'admin' } });
    await Booking.deleteMany({});

    // Create dummy owners
    const owners = await User.create([
      {
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        password: 'password123',
        phone: '+91 9876543210',
        role: 'owner',
        status: 'approved',
        city: 'Mumbai',
        address: 'Andheri West, Mumbai'
      },
      {
        name: 'Priya Sharma',
        email: 'priya@example.com',
        password: 'password123',
        phone: '+91 8765432109',
        role: 'owner',
        status: 'approved',
        city: 'Delhi',
        address: 'Connaught Place, Delhi'
      },
      {
        name: 'Amit Patel',
        email: 'amit@example.com',
        password: 'password123',
        phone: '+91 7654321098',
        role: 'owner',
        status: 'approved',
        city: 'Bangalore',
        address: 'Koramangala, Bangalore'
      }
    ]);

    // Create dummy users
    const users = await User.create([
      {
        name: 'Rahul Gupta',
        email: 'rahul@example.com',
        password: 'password123',
        phone: '+91 9123456789',
        role: 'user',
        status: 'approved',
        city: 'Mumbai'
      },
      {
        name: 'Sneha Singh',
        email: 'sneha@example.com',
        password: 'password123',
        phone: '+91 8123456789',
        role: 'user',
        status: 'approved',
        city: 'Delhi'
      }
    ]);

    console.log('Dummy data created successfully!');
    console.log(`Created ${owners.length} owners`);
    console.log(`Created ${users.length} users`);

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();