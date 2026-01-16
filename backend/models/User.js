const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 12;

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['user', 'owner', 'admin'], default: 'user' },
  
  profilePhoto: { type: String },
  address: { type: String },
  city: { type: String },
  
  drivingLicense: {
    number: String,
    image: String,
    expiryDate: Date
  },
  aadhar: {
    number: String,
    image: String
  },
  
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String
  },
  
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'blocked'], 
    default: 'approved' 
  },
  
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  
  lastLogin: Date,
  loginAttempts: { type: Number, default: 0 },
  googleId: String
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);