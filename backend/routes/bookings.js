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

router.post('/', userOnly, createBooking);
router.get('/user-bookings', userOnly, getUserBookings);
router.put('/:bookingId/handle', ownerOnly, handleBookingRequest);
router.get('/owner-bookings', ownerOnly, getOwnerBookings);
router.put('/:bookingId/cancel', authenticate, cancelBooking);
router.post('/:bookingId/review', authenticate, addReview);

module.exports = router;