const express = require('express');
const {
  createBooking,
  handleBookingRequest,
  getUserBookings,
  getOwnerBookings,
  cancelBooking,
  addReview
} = require('../controllers/bookingController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// User routes
router.post('/', authenticate, authorize(['user']), createBooking);
router.get('/my-bookings', authenticate, authorize(['user']), getUserBookings);

// Owner routes
router.put('/:bookingId/accept', authenticate, authorize(['owner']), (req, res) => {
  req.body.action = 'accept';
  handleBookingRequest(req, res);
});
router.put('/:bookingId/reject', authenticate, authorize(['owner']), (req, res) => {
  req.body.action = 'reject';
  handleBookingRequest(req, res);
});
router.get('/owner-bookings', authenticate, authorize(['owner']), getOwnerBookings);

// Common routes (user or owner)
router.put('/:bookingId/cancel', authenticate, cancelBooking);
router.post('/:bookingId/review', authenticate, addReview);

module.exports = router;