const Booking = require('../models/Booking');
const Car = require('../models/Car');
const User = require('../models/User');

// Create Booking Request
exports.createBooking = async (req, res) => {
  try {
    const { carId, startDate, endDate, specialRequests } = req.body;

    // Check if car exists and is available
    const car = await Car.findById(carId).populate('owner');
    if (!car || car.status !== 'approved') {
      return res.status(404).json({ message: 'Car not available' });
    }

    // Check date availability
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const conflictingBooking = car.blockedDates.find(blocked => {
      return (start <= blocked.to && end >= blocked.from);
    });

    if (conflictingBooking) {
      return res.status(400).json({ message: 'Car not available for selected dates' });
    }

    // Calculate pricing
    const diffTime = Math.abs(end - start);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const platformFee = Math.round(car.pricePerDay * totalDays * 0.05); // 5% platform fee

    const booking = await Booking.create({
      user: req.user.id,
      owner: car.owner._id,
      car: carId,
      startDate: start,
      endDate: end,
      totalDays,
      pricePerDay: car.pricePerDay,
      totalAmount: totalDays * car.pricePerDay,
      platformFee,
      finalAmount: (totalDays * car.pricePerDay) + platformFee,
      specialRequests
    });

    await booking.populate([
      { path: 'user', select: 'name email phone' },
      { path: 'car', select: 'name brand numberPlate images' },
      { path: 'owner', select: 'name email phone' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Booking request sent to owner',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Owner: Accept/Reject Booking
exports.handleBookingRequest = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { action, rejectionReason } = req.body; // action: 'accept' or 'reject'

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if owner owns the car
    const car = await Car.findById(booking.car);
    if (car.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (action === 'accept') {
      booking.status = 'accepted';
      
      // Block dates in car
      car.blockedDates.push({
        from: booking.startDate,
        to: booking.endDate,
        bookingId: booking._id
      });
      await car.save();
      
    } else if (action === 'reject') {
      booking.status = 'rejected';
      if (rejectionReason) {
        booking.cancellationReason = rejectionReason;
      }
    }

    await booking.save();
    await booking.populate([
      { path: 'user', select: 'name email phone' },
      { path: 'car', select: 'name brand numberPlate' }
    ]);

    res.json({
      success: true,
      message: `Booking ${action}ed successfully`,
      booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User's Bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('car', 'name brand numberPlate images pickupLocation')
      .populate('owner', 'name phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Owner's Bookings
exports.getOwnerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user.id })
      .populate('car', 'name brand numberPlate')
      .populate('user', 'name phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel Booking
exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (booking.user.toString() !== req.user.id && booking.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if booking can be cancelled
    if (['completed', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({ message: 'Cannot cancel this booking' });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = reason;
    booking.cancelledBy = req.user.role;
    booking.cancellationDate = new Date();

    // Remove blocked dates from car
    const car = await Car.findById(booking.car);
    car.blockedDates = car.blockedDates.filter(
      blocked => blocked.bookingId.toString() !== bookingId
    );
    await car.save();

    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Review
exports.addReview = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed bookings' });
    }

    if (booking.user.toString() === req.user.id) {
      // User reviewing car/owner
      booking.userReview = { rating, comment, date: new Date() };
      
      // Update car rating
      const car = await Car.findById(booking.car);
      const newTotal = car.totalRatings + 1;
      car.rating = ((car.rating * car.totalRatings) + rating) / newTotal;
      car.totalRatings = newTotal;
      await car.save();
      
    } else if (booking.owner.toString() === req.user.id) {
      // Owner reviewing user
      booking.ownerReview = { rating, comment, date: new Date() };
      
      // Update user rating
      const user = await User.findById(booking.user);
      const newTotal = user.totalRatings + 1;
      user.rating = ((user.rating * user.totalRatings) + rating) / newTotal;
      user.totalRatings = newTotal;
      await user.save();
    } else {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await booking.save();

    res.json({
      success: true,
      message: 'Review added successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};