const User = require('../models/User');
const Car = require('../models/Car');
const Booking = require('../models/Booking');

// Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalOwners,
      totalCars,
      totalBookings,
      pendingUsers,
      pendingOwners,
      pendingCars,
      completedBookings,
      activeBookings,
      totalEarnings,
      monthlyEarnings
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'owner' }),
      Car.countDocuments(),
      Booking.countDocuments(),
      User.countDocuments({ status: 'pending' }),
      User.countDocuments({ role: 'owner', status: 'pending' }),
      Car.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'completed' }),
      Booking.countDocuments({ status: 'active' }),
      Booking.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$platformFee' } } }
      ]),
      Booking.aggregate([
        { 
          $match: { 
            status: 'completed',
            createdAt: { 
              $gte: (() => {
                const now = new Date();
                return new Date(now.getFullYear(), now.getMonth(), 1);
              })()
            }
          } 
        },
        { $group: { _id: null, total: { $sum: '$platformFee' } } }
      ])
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalOwners,
        totalCars,
        totalBookings,
        pendingApprovals: {
          users: pendingUsers,
          owners: pendingOwners,
          cars: pendingCars
        },
        completedBookings,
        activeBookings,
        totalEarnings: totalEarnings[0]?.total || 0,
        monthlyEarnings: monthlyEarnings[0]?.total || 0
      }
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
    const { page = 1, limit = 10, role, status } = req.query;
    
    let query = {};
    if (role) query.role = role;
    if (status) query.status = status;

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        page: Number(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Cars
exports.getAllCars = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let query = {};
    if (status) query.status = status;

    const cars = await Car.find(query)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Car.countDocuments(query);

    res.json({
      success: true,
      cars,
      pagination: {
        page: Number(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Bookings
exports.getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let query = {};
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('owner', 'name email phone')
      .populate('car', 'name brand numberPlate')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      bookings,
      pagination: {
        page: Number(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
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