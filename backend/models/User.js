const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['user', 'owner', 'admin'], default: 'user' },
  
  // Profile Info
  profilePhoto: { type: String },
  address: { type: String },
  city: { type: String },
  
  // KYC Documents
  drivingLicense: {
    number: String,
    image: String,
    expiryDate: Date
  },
  aadhar: {
    number: String,
    image: String
  },
  
  // Bank Details (for owners)
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String
  },
  
  // Status Management
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'blocked'], 
    default: 'pending' 
  },
  
  // Ratings
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  
  // Login tracking
  lastLogin: Date,
  loginAttempts: { type: Number, default: 0 },
  
  // Google Auth
  googleId: String,
  
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);