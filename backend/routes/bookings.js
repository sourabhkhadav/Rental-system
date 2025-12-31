const express = require('express');
const {
  createBooking,
  handleBookingRequest,
  getUserBookings,
  getOwnerBookings,
  cancelBooking,
  addReview
} = require('../controllers/bookingController');
const { userOnly, ownerOnly, authenticate } = require('../middleware/auth');

const router = express.Router();

// User routes
router.post('/', userOnly, createBooking);
router.get('/my-bookings', userOnly, getUserBookings);

// Owner routes
router.put('/:bookingId/handle', ownerOnly, handleBookingRequest);
router.get('/owner/bookings', ownerOnly, getOwnerBookings);

// Common routes (user or owner)
router.put('/:bookingId/cancel', authenticate, cancelBooking);
router.post('/:bookingId/review', authenticate, addReview);

module.exports = router;