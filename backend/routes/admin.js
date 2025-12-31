const express = require('express');
const {
  getDashboardStats,
  getPendingUsers,
  handleUserApproval,
  getPendingCars,
  handleCarApproval,
  blockUser,
  getAllUsers,
  getAllCars,
  getAllBookings,
  cancelBooking
} = require('../controllers/adminController');
const { adminOnly } = require('../middleware/auth');

const router = express.Router();

// Dashboard
router.get('/dashboard', adminOnly, getDashboardStats);

// User Management
router.get('/users/pending', adminOnly, getPendingUsers);
router.get('/users', adminOnly, getAllUsers);
router.put('/users/:userId/approve', adminOnly, handleUserApproval);
router.put('/users/:userId/block', adminOnly, blockUser);

// Car Management
router.get('/cars/pending', adminOnly, getPendingCars);
router.get('/cars', adminOnly, getAllCars);
router.put('/cars/:carId/approve', adminOnly, handleCarApproval);

// Booking Management
router.get('/bookings', adminOnly, getAllBookings);
router.put('/bookings/:bookingId/cancel', adminOnly, cancelBooking);

module.exports = router;