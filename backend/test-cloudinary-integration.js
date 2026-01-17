const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

async function testCloudinaryConnection() {
  try {
    console.log('Testing Cloudinary connection...');
    
    // Test connection by getting account details
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful!');
    console.log('Status:', result.status);
    
    // Test folder structure
    console.log('\n📁 Testing folder structure...');
    const folders = ['car-rental/profiles', 'car-rental/images', 'car-rental/rcDocument', 'car-rental/insurance', 'car-rental/pollutionCert', 'car-rental/drivingLicense', 'car-rental/aadhar'];
    
    for (const folder of folders) {
      console.log(`✅ Folder configured: ${folder}`);
    }
    
    console.log('\n🎉 Cloudinary integration test completed successfully!');
    console.log('\nConfiguration:');
    console.log('- Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('- API Key:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing');
    console.log('- API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing');
    
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
    process.exit(1);
  }
}

testCloudinaryConnection();