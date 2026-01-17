const Car = require('../models/Car');
const Booking = require('../models/Booking');
const { validationResult } = require('express-validator');

const ACTIVE_BOOKING_STATUSES = ['pending', 'accepted', 'confirmed'];

const extractCarFiles = (files) => ({
  images: files.images ? files.images.map(file => file.path) : [],
  rcDocument: files.rcDocument?.[0]?.path,
  insurance: files.insurance?.[0]?.path,
  pollutionCert: files.pollutionCert?.[0]?.path
});

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

    const existingCar = await Car.findOne({ numberPlate });
    if (existingCar) {
      return res.status(400).json({ message: 'Car with this number plate already exists' });
    }

    const carFiles = extractCarFiles(req.files);

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
      ...carFiles
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

exports.getMyCars = async (req, res) => {
  try {
    const cars = await Car.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, cars });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findOne({ _id: req.params.id, owner: req.user.id });
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const updateData = { ...req.body };
    
    // Handle file uploads if provided
    if (req.files) {
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

exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findOne({ _id: req.params.id, owner: req.user.id });
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const activeBookings = await Booking.find({
      car: req.params.id,
      status: { $in: ACTIVE_BOOKING_STATUSES }
    });

    if (activeBookings.length > 0) {
      return res.status(400).json({ message: 'Cannot delete car with active bookings' });
    }

    await Car.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const buildCarQuery = (filters) => {
  const { city, seats, fuelType, transmission, minPrice, maxPrice } = filters;
  const query = { status: 'approved' };
  
  if (city) {
    query['pickupLocation.city'] = new RegExp(city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  }
  if (seats && !isNaN(seats)) {
    query.seats = { $gte: parseInt(seats) };
  }
  if (fuelType && ['petrol', 'diesel', 'cng', 'electric'].includes(fuelType)) {
    query.fuelType = fuelType;
  }
  if (transmission && ['manual', 'automatic'].includes(transmission)) {
    query.transmission = transmission;
  }
  
  if (minPrice || maxPrice) {
    query.pricePerDay = {};
    if (minPrice && !isNaN(minPrice)) query.pricePerDay.$gte = parseInt(minPrice);
    if (maxPrice && !isNaN(maxPrice)) query.pricePerDay.$lte = parseInt(maxPrice);
  }

  return query;
};

const filterCarsByDateAvailability = (cars, startDate, endDate) => {
  if (!startDate || !endDate) return cars;

  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return cars.filter(car => {
    const hasConflict = car.blockedDates.some(blocked => {
      const blockedStart = new Date(blocked.from);
      const blockedEnd = new Date(blocked.to);
      return start <= blockedEnd && end >= blockedStart;
    });
    return !hasConflict;
  });
};

exports.getAllCars = async (req, res) => {
  try {
    const { startDate, endDate, ...filters } = req.query;
    const query = buildCarQuery(filters);

    let cars = await Car.find(query)
      .populate('owner', 'name phone rating')
      .sort({ createdAt: -1 });

    cars = filterCarsByDateAvailability(cars, startDate, endDate);

    res.json({ success: true, cars });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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