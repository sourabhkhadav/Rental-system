const User = require('../models/User');
const Car = require('../models/Car');
const Booking = require('../models/Booking');

const ACTIVE_BOOKING_STATUSES = ['pending', 'accepted', 'confirmed'];

const createUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  status: user.status
});

exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalOwners,
      totalCars,
      totalBookings,
      pendingUsers,
      pendingCars,
      completedBookings
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'owner' }),
      Car.countDocuments(),
      Booking.countDocuments(),
      User.countDocuments({ status: 'pending' }),
      Car.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'completed' })
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalOwners,
        totalCars,
        totalBookings,
        pendingApprovals: { users: pendingUsers, cars: pendingCars },
        completedBookings,
        totalEarnings: 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ status: 'pending' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.handleUserApproval = async (req, res) => {
  try {
    const { userId } = req.params;
    const { action } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = action === 'approve' ? 'approved' : 'rejected';
    await user.save();

    res.json({
      success: true,
      message: `User ${action}d successfully`,
      user: createUserResponse(user)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPendingCars = async (req, res) => {
  try {
    const cars = await Car.find({ status: 'pending' })
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, cars });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.handleCarApproval = async (req, res) => {
  try {
    const { carId } = req.params;
    const { action } = req.body;

    const car = await Car.findById(carId).populate('owner', 'name email');
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    car.status = action === 'approve' ? 'approved' : 'rejected';
    await car.save();

    res.json({
      success: true,
      message: `Car ${action}d successfully`,
      car
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { action } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = action === 'block' ? 'blocked' : 'approved';
    await user.save();

    res.json({
      success: true,
      message: `User ${action}ed successfully`,
      user: createUserResponse(user)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find({})
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ success: true, cars });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name email phone')
      .populate('owner', 'name email phone')
      .populate('car', 'name brand numberPlate')
      .sort({ createdAt: -1 })
      .limit(100);

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

    booking.status = 'cancelled';
    booking.cancellationReason = reason;
    booking.cancelledBy = 'admin';
    booking.cancellationDate = new Date();

    const car = await Car.findById(booking.car);
    car.blockedDates = car.blockedDates.filter(
      blocked => blocked.bookingId.toString() !== bookingId
    );
    await car.save();
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled by admin',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};