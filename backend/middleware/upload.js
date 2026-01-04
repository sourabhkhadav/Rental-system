const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dhue3xnpx',
  api_key: '212913295232361',
  api_secret: 'FklRkFnZZzTVSEZAyx348LbRb1c',
  secure: true
});

// Memory storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (JPEG, JPG, PNG) and PDF files are allowed'));
  }
};

// Multer config
const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024,
    files: 10
  },
  fileFilter: fileFilter,
  timeout: 300000 // 5 minutes
});

// Upload functions
exports.uploadProfile = upload.single('profilePhoto');
exports.uploadCarFiles = upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'rcDocument', maxCount: 1 },
  { name: 'insurance', maxCount: 1 },
  { name: 'pollutionCert', maxCount: 1 }
]);
exports.uploadKYC = upload.fields([
  { name: 'drivingLicense', maxCount: 1 },
  { name: 'aadhar', maxCount: 1 }
]);

// Cloudinary upload
const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: `car-rental/${folder}`,
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });
};

// Handle uploads
exports.handleUploadError = async (req, res, next) => {
  try {
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'profiles');
      req.file.path = result.secure_url;
    }
    
    if (req.files) {
      for (const fieldname in req.files) {
        const files = req.files[fieldname];
        for (let i = 0; i < files.length; i++) {
          const result = await uploadToCloudinary(files[i].buffer, fieldname);
          files[i].path = result.secure_url;
        }
      }
    }
    next();
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
};