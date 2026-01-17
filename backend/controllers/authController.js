const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const createUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status
});

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'user',
      status: 'pending'
    });

    const token = generateToken(user._id);
    const message = 'Registration successful. Please wait for admin approval.';

    res.status(201).json({
      success: true,
      message,
      token,
      user: createUserResponse(user)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.status === 'pending') {
      return res.status(403).json({ message: 'Account pending admin approval' });
    }

    if (user.status === 'rejected' || user.status === 'blocked') {
      return res.status(403).json({ message: 'Account access denied' });
    }

    user.lastLogin = new Date();
    user.loginAttempts = 0;
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: createUserResponse(user)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password;
    delete updates.role;
    delete updates.status;
    
    // Handle profile photo upload
    if (req.file && req.file.path) {
      updates.profilePhoto = req.file.path;
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, user, message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadKYC = async (req, res) => {
  try {
    const updates = {};
    
    if (req.files.drivingLicense) {
      updates['drivingLicense.image'] = req.files.drivingLicense[0].path;
    }
    
    if (req.files.aadhar) {
      updates['aadhar.image'] = req.files.aadhar[0].path;
    }
    
    // Update other KYC fields from body
    if (req.body.drivingLicenseNumber) {
      updates['drivingLicense.number'] = req.body.drivingLicenseNumber;
    }
    if (req.body.drivingLicenseExpiry) {
      updates['drivingLicense.expiryDate'] = req.body.drivingLicenseExpiry;
    }
    if (req.body.aadharNumber) {
      updates['aadhar.number'] = req.body.aadharNumber;
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, user, message: 'KYC documents uploaded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const Booking = require('../models/Booking');
    const Car = require('../models/Car');
    
    const activeBookings = await Booking.find({
      $or: [
        { user: req.user.id, status: { $in: ['pending', 'accepted', 'confirmed'] } },
        { owner: req.user.id, status: { $in: ['pending', 'accepted', 'confirmed'] } }
      ]
    });

    if (activeBookings.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete account with active bookings. Please complete or cancel all bookings first.' 
      });
    }

    const userCars = await Car.find({ owner: req.user.id });
    if (userCars.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete account with registered cars. Please remove all cars first.' 
      });
    }

    await User.findByIdAndDelete(req.user.id);
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};