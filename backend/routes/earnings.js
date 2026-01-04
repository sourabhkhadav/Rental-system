const express = require('express');
const Booking = require('../models/Booking');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Get Owner Earnings
router.get('/owner', authenticate, authorize(['owner']), async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user.id })
      .populate('car', 'name')
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    const completedBookings = bookings.filter(b => b.status === 'completed');
    const pendingBookings = bookings.filter(b => ['accepted', 'confirmed'].includes(b.status));

    const totalEarnings = completedBookings.reduce((sum, b) => sum + b.finalAmount, 0);
    const pendingPayouts = pendingBookings.reduce((sum, b) => sum + b.finalAmount, 0);

    // This month earnings
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthBookings = completedBookings.filter(b => {
      const bookingDate = new Date(b.createdAt);
      return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
    });
    const thisMonth = thisMonthBookings.reduce((sum, b) => sum + b.finalAmount, 0);

    // Transaction history
    const transactions = bookings.map(booking => ({
      _id: booking._id,
      bookingId: `BK${booking._id.toString().slice(-6).toUpperCase()}`,
      carName: booking.car.name,
      customerName: booking.user.name,
      amount: booking.finalAmount,
      commission: Math.round(booking.finalAmount * 0.05), // 5% commission
      netAmount: Math.round(booking.finalAmount * 0.95),
      status: booking.status === 'completed' ? 'completed' : 'pending',
      date: booking.createdAt
    }));

    res.json({
      success: true,
      totalEarnings,
      thisMonth,
      pendingPayouts,
      transactions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;