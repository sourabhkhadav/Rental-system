const Car = require('../models/Car');
const Booking = require('../models/Booking');
const { validationResult } = require('express-validator');

// Add Car
exports.addCar = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name, brand, model, year, numberPlate, fuelType, seats, transmission,
      pricePerDay, securityDeposit, maxKmPerDay, extraChargePerKm,
      availableFrom, availableTo, pickupAddress, pickupCity, features
    } = req.body;

    // Check if number plate already exists
    const existingCar = await Car.findOne({ numberPlate });
    if (existingCar) {
      return res.status(400).json({ message: 'Car with this number plate already exists' });
    }

    // Handle file uploads
    const images = req.files.images ? req.files.images.map(file => file.path) : [];
    const rcDocument = req.files.rcDocument ? req.files.rcDocument[0].path : null;
    const insurance = req.files.insurance ? req.files.insurance[0].path : null;
    const pollutionCert = req.files.pollutionCert ? req.files.pollutionCert[0].path : null;

    const car = await Car.create({
      owner: req.user.id,
      name,
      brand,
      model,
      year,
      numberPlate: numberPlate.toUpperCase(),
      fuelType,
      seats,
      transmission,
      pricePerDay,
      securityDeposit: securityDeposit || 0,
      maxKmPerDay: maxKmPerDay || 300,
      extraChargePerKm: extraChargePerKm || 10,
      availableFrom,
      availableTo,
      pickupLocation: {
        address: pickupAddress,
        city: pickupCity
      },
      features: features ? JSON.parse(features) : [],
      images,
      rcDocument,
      insurance,
      pollutionCert
    });

    res.status(201).json({
      success: true,
      message: 'Car added successfully! Waiting for admin approval.',
      car
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get My Cars
exports.getMyCars = async (req, res) => {
  try {
    const cars = await Car.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, cars });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Owner Stats
exports.getOwnerStats = async (req, res) => {
  try {
    const cars = await Car.find({ owner: req.user.id });
    const bookings = await Booking.find({ owner: req.user.id });

    const stats = {
      totalCars: cars.length,
      activeCars: cars.filter(car => car.status === 'approved').length,
      totalBookings: bookings.length,
      totalEarnings: bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.finalAmount, 0),
      pendingPayouts: bookings
        .filter(b => ['accepted', 'confirmed'].includes(b.status))
        .reduce((sum, b) => sum + b.finalAmount, 0)
    };

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Car
exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findOne({ _id: req.params.id, owner: req.user.id });
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Handle file uploads if provided
    const updateData = { ...req.body };
    if (req.files.images) {
      updateData.images = req.files.images.map(file => file.path);
    }
    if (req.files.rcDocument) {
      updateData.rcDocument = req.files.rcDocument[0].path;
    }
    if (req.files.insurance) {
      updateData.insurance = req.files.insurance[0].path;
    }
    if (req.files.pollutionCert) {
      updateData.pollutionCert = req.files.pollutionCert[0].path;
    }

    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({ success: true, car: updatedCar });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Car
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findOne({ _id: req.params.id, owner: req.user.id });
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Check if car has active bookings
    const activeBookings = await Booking.find({
      car: req.params.id,
      status: { $in: ['pending', 'accepted', 'confirmed'] }
    });

    if (activeBookings.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete car with active bookings' 
      });
    }

    await Car.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Cars (Public)
exports.getAllCars = async (req, res) => {
  try {
    const { city, startDate, endDate, seats, fuelType, transmission, minPrice, maxPrice } = req.query;
    
    let query = { status: 'approved' };
    
    if (city) {
      query['pickupLocation.city'] = new RegExp(city, 'i');
    }
    
    if (seats) {
      query.seats = { $gte: parseInt(seats) };
    }
    
    if (fuelType) {
      query.fuelType = fuelType;
    }
    
    if (transmission) {
      query.transmission = transmission;
    }
    
    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = parseInt(minPrice);
      if (maxPrice) query.pricePerDay.$lte = parseInt(maxPrice);
    }

    const cars = await Car.find(query)
      .populate('owner', 'name phone rating')
      .sort({ createdAt: -1 });

    res.json({ success: true, cars });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Car by ID
exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)
      .populate('owner', 'name phone rating totalRatings');
    
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.json({ success: true, car });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};