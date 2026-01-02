const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createOwner() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car-rental');
    
    // Delete existing owner
    await User.deleteOne({ email: 'owner@gmail.com' });
    
    // Create new owner
    const owner = await User.create({
      name: 'Car Owner',
      email: 'owner@gmail.com',
      password: 'owner123',
      phone: '8888888888',
      role: 'owner',
      status: 'approved'
    });
    
    console.log('Owner created successfully:', owner.email);
    console.log('Login with: owner@gmail.com / owner123');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createOwner();