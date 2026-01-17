const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const fixCarOwnership = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car-rental', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
    
    const User = require(path.join(__dirname, 'models', 'User'));
    const Car = require(path.join(__dirname, 'models', 'Car'));
    
    // Get all users and cars
    const users = await User.find();
    const cars = await Car.find();
    
    console.log('Users:');
    users.forEach(user => {
      console.log(`  ${user.name} (${user.email}) - Role: ${user.role} - ID: ${user._id}`);
    });
    
    console.log('\nCars:');
    cars.forEach(car => {
      console.log(`  ${car.name} - Owner ID: ${car.owner} - Status: ${car.status}`);
    });
    
    // Find owners
    const owners = users.filter(user => user.role === 'owner');
    
    if (owners.length > 0 && cars.length > 0) {
      console.log('\nAssigning cars to first owner...');
      const firstOwner = owners[0];
      
      // Update all cars to belong to the first owner
      await Car.updateMany({}, { 
        owner: firstOwner._id,
        status: 'approved' // Make sure they're approved so they show in stats
      });
      
      console.log(`✅ Updated ${cars.length} cars to belong to ${firstOwner.name}`);
      
      // Verify the update
      const updatedCars = await Car.find({ owner: firstOwner._id });
      console.log(`✅ Verification: ${updatedCars.length} cars now belong to ${firstOwner.name}`);
    }
    
    await mongoose.disconnect();
    console.log('✅ Fix completed!');
  } catch (error) {
    console.error('❌ Error:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
};

fixCarOwnership();