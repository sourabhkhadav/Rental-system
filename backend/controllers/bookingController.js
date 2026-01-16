const Booking = require('../models/Booking');
const Car = require('../models/Car');
const User = require('../models/User');

const ACTIVE_BOOKING_STATUSES = ['pending', 'accepted', 'confirmed'];
const CANCELLABLE_STATUSES = ['completed', 'cancelled'];

const calculateTotalDays = (startDate, endDate) => {
  return Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24));
};

const calculateBookingAmount = (totalDays, pricePerDay) => {
  const totalAmount = totalDays * pricePerDay;
  const platformFee = Math.round(totalAmount * 0.05);
  return { totalAmount, platformFee, finalAmount: totalAmount + platformFee };
};

const hasDateConflict = (blockedDates, startDate, endDate) => {
  return blockedDates.some(blocked => startDate <= blocked.to && endDate >= blocked.from);
};

exports.createBooking = async (req, res) => {
  try {
    const { carId, startDate, endDate, specialRequests, pickupTime, dropoffTime } = req.body;

    const car = await Car.findById(carId).populate('owner');
    if (!car || car.status !== 'approved') {
      return res.status(404).json({ message: 'Car not available' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (hasDateConflict(car.blockedDates, start, end)) {
      return res.status(400).json({ message: 'Car not available for selected dates' });
    }

    const totalDays = calculateTotalDays(start, end);
    const { totalAmount, platformFee, finalAmount } = calculateBookingAmount(totalDays, car.pricePerDay);

    const booking = await Booking.create({
      user: req.user.id,
      owner: car.owner._id,
      car: carId,
      startDate: start,
      endDate: end,
      totalDays,
      pricePerDay: car.pricePerDay,
      totalAmount,
      platformFee,
      finalAmount,
      specialRequests,
      pickupTime: pickupTime || '10:00',
      dropoffTime: dropoffTime || '10:00'
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

exports.handleBookingRequest = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { action, rejectionReason } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const car = await Car.findById(booking.car);
    if (car.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (action === 'accept') {
      booking.status = 'accepted';
      car.blockedDates.push({
        from: booking.startDate,
        to: booking.endDate,
        bookingId: booking._id
      });
      await car.save();
    } else if (action === 'reject') {
      booking.status = 'rejected';
      if (rejectionReason) booking.cancellationReason = rejectionReason;
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

exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user.id && booking.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (CANCELLABLE_STATUSES.includes(booking.status)) {
      return res.status(400).json({ message: 'Cannot cancel this booking' });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = reason;
    booking.cancelledBy = req.user.role;
    booking.cancellationDate = new Date();

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

const updateRating = async (Model, id, newRating) => {
  const entity = await Model.findById(id);
  const newTotal = entity.totalRatings + 1;
  entity.rating = ((entity.rating * entity.totalRatings) + newRating) / newTotal;
  entity.totalRatings = newTotal;
  await entity.save();
};

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
      booking.userReview = { rating, comment, date: new Date() };
      await updateRating(Car, booking.car, rating);
    } else if (booking.owner.toString() === req.user.id) {
      booking.ownerReview = { rating, comment, date: new Date() };
      await updateRating(User, booking.user, rating);
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