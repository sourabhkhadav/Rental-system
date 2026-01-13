const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  getMe,
  updateProfile,
  deleteAccount,
  changePassword
} = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { uploadProfile, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').isLength({ min: 10 }).withMessage('Please provide a valid phone number'),
  body('role').optional().isIn(['user', 'owner']).withMessage('Invalid role')
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, uploadProfile, handleUploadError, updateProfile);
router.put('/change-password', authenticate, changePasswordValidation, changePassword);
router.delete('/account', authenticate, deleteAccount);

module.exports = router;