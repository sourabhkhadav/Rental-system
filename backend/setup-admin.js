const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function testAdminLogin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car-rental');
    console.log('Connected to MongoDB');

    // Create/update admin user
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
      console.log('Admin user created');
    } else {
      adminUser.password = 'admin123';
      adminUser.status = 'approved';
      await adminUser.save();
      console.log('Admin user updated');
    }

    // Create/update test user
    let testUser = await User.findOne({ email: 'bhavishya09@gmail.com' });
    if (!testUser) {
      testUser = await User.create({
        name: 'Bhavishya',
        email: 'bhavishya09@gmail.com',
        password: 'bhavishya123',
        phone: '9876543210',
        role: 'user',
        status: 'approved'
      });
      console.log('Test user created');
    } else {
      testUser.password = 'bhavishya123';
      testUser.status = 'approved';
      await testUser.save();
      console.log('Test user updated');
    }
    
    console.log('Setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testAdminLogin();