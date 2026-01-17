const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'Account blocked. Contact admin.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

exports.requireApproval = (req, res, next) => {
  if (req.user.status !== 'approved') {
    return res.status(403).json({ 
      message: 'Account not approved yet. Please wait for admin approval.',
      status: req.user.status 
    });
  }
  next();
};

exports.adminOnly = [
  exports.authenticate,
  exports.authorize('admin')
];

exports.ownerOnly = [
  exports.authenticate,
  exports.authorize('owner'),
  exports.requireApproval
];

exports.userOnly = [
  exports.authenticate,
  exports.authorize('user'),
  exports.requireApproval
];