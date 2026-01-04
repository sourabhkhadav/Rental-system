const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dhue3xnpx',
  api_key: '212913295232361',
  api_secret: 'FklRkFnZZzTVSEZAyx348LbRb1c'
});

// Test connection
cloudinary.api.ping()
  .then(() => console.log('✅ Cloudinary connected successfully'))
  .catch(err => console.error('❌ Cloudinary error:', err));