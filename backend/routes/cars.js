const express = require('express');
const { body } = require('express-validator');
const {
  addCar,
  getMyCars,
  updateCar,
  deleteCar,
  getOwnerStats,
  getAllCars,
  getCarById
} = require('../controllers/carController');
const { authenticate, authorize } = require('../middleware/auth');
const { uploadCarFiles, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// Validation rules
const carValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Car name must be at least 2 characters'),
  body('brand').notEmpty().withMessage('Brand is required'),
  body('model').notEmpty().withMessage('Model is required'),
  body('year').isInt({ min: 2000, max: new Date().getFullYear() }).withMessage('Invalid year'),
  body('numberPlate').notEmpty().withMessage('Number plate is required'),
  body('fuelType').isIn(['petrol', 'diesel', 'cng', 'electric']).withMessage('Invalid fuel type'),
  body('seats').isInt({ min: 2, max: 8 }).withMessage('Seats must be between 2-8'),
  body('transmission').isIn(['manual', 'automatic']).withMessage('Invalid transmission'),
  body('pricePerDay').isFloat({ min: 500 }).withMessage('Price must be at least ₹500'),
  body('pickupAddress').notEmpty().withMessage('Pickup address is required'),
  body('pickupCity').notEmpty().withMessage('Pickup city is required')
];

// Routes
router.post('/', authenticate, authorize(['owner']), uploadCarFiles, handleUploadError, carValidation, addCar);
router.get('/my-cars', authenticate, authorize(['owner']), getMyCars);
router.get('/owner-stats', authenticate, authorize(['owner']), getOwnerStats);
router.put('/:id', authenticate, authorize(['owner']), uploadCarFiles, handleUploadError, updateCar);
router.delete('/:id', authenticate, authorize(['owner']), deleteCar);

// Public routes
router.get('/', getAllCars);
router.get('/:id', getCarById);

module.exports = router;