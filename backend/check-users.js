const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car-rental');
    console.log('Connected to MongoDB');

    const users = await User.find({});
    console.log('All users in database:');
    users.forEach(user => {
      console.log(`Email: ${user.email}, Role: ${user.role}, Status: ${user.status}`);
    });

    // Check specific user
    const testUser = await User.findOne({ email: 'bhavishyajani09@gmail.com' });
    if (testUser) {
      console.log('\nTest user found:');
      console.log('Name:', testUser.name);
      console.log('Email:', testUser.email);
      console.log('Role:', testUser.role);
      console.log('Status:', testUser.status);
      
      const isPasswordValid = await testUser.comparePassword('bhavishya123');
      console.log('Password valid:', isPasswordValid);
    } else {
      console.log('\nTest user NOT found, creating...');
      await User.create({
        name: 'Bhavishya',
        email: 'bhavishyajani09@gmail.com',
        password: 'bhavishya123',
        phone: '9876543210',
        role: 'user',
        status: 'approved'
      });
      console.log('Test user created');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUsers();