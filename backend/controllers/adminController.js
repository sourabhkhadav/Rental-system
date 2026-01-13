const User = require('../models/User');
const Car = require('../models/Car');
const Booking = require('../models/Booking');

// Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    console.log('Getting dashboard stats for admin:', req.user.email);
    
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

    const stats = {
      totalUsers,
      totalOwners,
      totalCars,
      totalBookings,
      pendingApprovals: {
        users: pendingUsers,
        cars: pendingCars
      },
      completedBookings,
      totalEarnings: 0
    };

    console.log('Dashboard stats:', stats);

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get Pending Users
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

// Approve/Reject User
exports.handleUserApproval = async (req, res) => {
  try {
    const { userId } = req.params;
    const { action, reason } = req.body; // action: 'approve' or 'reject'

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (action === 'approve') {
      user.status = 'approved';
    } else if (action === 'reject') {
      user.status = 'rejected';
    }

    await user.save();

    res.json({
      success: true,
      message: `User ${action}d successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Pending Cars
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

// Approve/Reject Car
exports.handleCarApproval = async (req, res) => {
  try {
    const { carId } = req.params;
    const { action, reason } = req.body;

    const car = await Car.findById(carId).populate('owner', 'name email');
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    if (action === 'approve') {
      car.status = 'approved';
    } else if (action === 'reject') {
      car.status = 'rejected';
    }

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

// Block/Unblock User
exports.blockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { action, reason } = req.body; // action: 'block' or 'unblock'

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (action === 'block') {
      user.status = 'blocked';
    } else if (action === 'unblock') {
      user.status = 'approved';
    }

    await user.save();

    res.json({
      success: true,
      message: `User ${action}ed successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    console.log('Getting all users for admin:', req.user.email);
    
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(100);

    console.log('Found users:', users.length);

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get All Cars
exports.getAllCars = async (req, res) => {
  try {
    console.log('Getting all cars for admin:', req.user.email);
    
    const cars = await Car.find({})
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(100);

    console.log('Found cars:', cars.length);

    res.json({
      success: true,
      cars
    });
  } catch (error) {
    console.error('Get cars error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get All Bookings
exports.getAllBookings = async (req, res) => {
  try {
    console.log('Getting all bookings for admin:', req.user.email);
    
    const bookings = await Booking.find({})
      .populate('user', 'name email phone')
      .populate('owner', 'name email phone')
      .populate('car', 'name brand numberPlate')
      .sort({ createdAt: -1 })
      .limit(100);

    console.log('Found bookings:', bookings.length);

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Cancel Booking (Admin)
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

    // Remove blocked dates from car
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