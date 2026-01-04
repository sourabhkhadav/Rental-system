const Car = require('../models/Car');
const Booking = require('../models/Booking');
const Dispute = require('../models/Dispute');
const { validationResult } = require('express-validator');

// Add Car
exports.addCar = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const {
      name, brand, model, year, numberPlate, fuelType, seats, transmission,
      pricePerDay, securityDeposit, maxKmPerDay, extraChargePerKm,
      availableFrom, availableTo, pickupAddress, pickupCity, features
    } = req.body;

    const existingCar = await Car.findOne({ numberPlate: numberPlate.toUpperCase() });
    if (existingCar) {
      return res.status(400).json({ 
        success: false,
        message: `Car with number plate ${numberPlate.toUpperCase()} already exists. Please use a different number plate.` 
      });
    }

    const images = req.files?.images ? req.files.images.map(file => file.path) : [];
    const rcDocument = req.files?.rcDocument?.[0]?.path;
    const insurance = req.files?.insurance?.[0]?.path;
    const pollutionCert = req.files?.pollutionCert?.[0]?.path;

    if (!rcDocument || !insurance || images.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'RC Document, Insurance Document and Car Images are required' 
      });
    }

    const car = await Car.create({
      owner: req.user.id,
      name,
      brand,
      model,
      year: parseInt(year),
      numberPlate: numberPlate.toUpperCase(),
      fuelType,
      seats: parseInt(seats),
      transmission,
      pricePerDay: parseFloat(pricePerDay),
      securityDeposit: securityDeposit ? parseFloat(securityDeposit) : 0,
      maxKmPerDay: maxKmPerDay ? parseInt(maxKmPerDay) : 300,
      extraChargePerKm: extraChargePerKm ? parseFloat(extraChargePerKm) : 10,
      availableFrom: new Date(availableFrom),
      availableTo: new Date(availableTo),
      pickupLocation: {
        address: pickupAddress,
        city: pickupCity
      },
      features: features ? (typeof features === 'string' ? JSON.parse(features) : features) : [],
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
    console.error('Add car error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Get My Cars
exports.getMyCars = async (req, res) => {
  try {
    console.log('getMyCars called by user:', req.user);
    const cars = await Car.find({ owner: req.user.id }).sort({ createdAt: -1 });
    console.log('Found cars:', cars.length);
    res.json({ success: true, cars });
  } catch (error) {
    console.error('getMyCars error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Owner Stats
exports.getOwnerStats = async (req, res) => {
  try {
    console.log('getOwnerStats called by user:', req.user.id);
    
    const cars = await Car.find({ owner: req.user.id });
    const bookings = await Booking.find({ owner: req.user.id });

    console.log('Found cars:', cars.length, 'bookings:', bookings.length);

    const stats = {
      totalCars: cars.length,
      activeCars: cars.filter(car => car.status === 'approved').length,
      totalBookings: bookings.length,
      totalEarnings: bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (b.finalAmount || 0), 0),
      pendingPayouts: bookings
        .filter(b => ['accepted', 'confirmed'].includes(b.status))
        .reduce((sum, b) => sum + (b.finalAmount || 0), 0)
    };

    console.log('Calculated stats:', stats);
    res.json({ success: true, stats });
  } catch (error) {
    console.error('getOwnerStats error:', error);
    res.status(500).json({ success: false, message: error.message });
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
    console.log('Delete car request for ID:', req.params.id, 'by user:', req.user.id);
    
    const car = await Car.findOne({ _id: req.params.id, owner: req.user.id });
    if (!car) {
      return res.status(404).json({ 
        success: false,
        message: 'Car not found or you do not have permission to delete this car' 
      });
    }

    // Check if car has active bookings
    const activeBookings = await Booking.find({
      car: req.params.id,
      status: { $in: ['pending', 'accepted', 'confirmed'] }
    });

    if (activeBookings.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Cannot delete car with active bookings' 
      });
    }

    await Car.findByIdAndDelete(req.params.id);
    console.log('Car deleted successfully:', req.params.id);
    
    res.json({ 
      success: true, 
      message: 'Car deleted successfully' 
    });
  } catch (error) {
    console.error('Delete car error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
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

// Update Dynamic Pricing
exports.updateDynamicPricing = async (req, res) => {
  try {
    const { carId } = req.params;
    const { enabled, weekendPrice, weekdayPrice, seasonalRates, customDates } = req.body;

    const car = await Car.findOne({ _id: carId, owner: req.user.id });
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    car.dynamicPricing = {
      enabled,
      weekendPrice,
      weekdayPrice,
      seasonalRates: seasonalRates || [],
      customDates: customDates || []
    };

    await car.save();
    res.json({ success: true, message: 'Dynamic pricing updated', car });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Dynamic Price for Date
exports.getDynamicPrice = async (req, res) => {
  try {
    const { carId, date } = req.params;
    const car = await Car.findById(carId);
    
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const targetDate = new Date(date);
    let price = car.pricePerDay;

    if (car.dynamicPricing.enabled) {
      // Check custom dates first
      const customDate = car.dynamicPricing.customDates.find(cd => 
        new Date(cd.date).toDateString() === targetDate.toDateString()
      );
      
      if (customDate) {
        price = customDate.pricePerDay;
      } else {
        // Check seasonal rates
        const seasonalRate = car.dynamicPricing.seasonalRates.find(sr => 
          targetDate >= new Date(sr.startDate) && targetDate <= new Date(sr.endDate)
        );
        
        if (seasonalRate) {
          price = seasonalRate.pricePerDay;
        } else {
          // Check weekend/weekday pricing
          const dayOfWeek = targetDate.getDay();
          if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
            price = car.dynamicPricing.weekendPrice || car.pricePerDay;
          } else { // Weekday
            price = car.dynamicPricing.weekdayPrice || car.pricePerDay;
          }
        }
      }
    }

    res.json({ success: true, price, date });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Availability Calendar
exports.updateAvailabilityCalendar = async (req, res) => {
  try {
    const { carId } = req.params;
    const { dates } = req.body; // Array of {date, status, reason}

    const car = await Car.findOne({ _id: carId, owner: req.user.id });
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Update or add calendar entries
    dates.forEach(dateEntry => {
      const existingIndex = car.availabilityCalendar.findIndex(cal => 
        new Date(cal.date).toDateString() === new Date(dateEntry.date).toDateString()
      );
      
      if (existingIndex >= 0) {
        car.availabilityCalendar[existingIndex] = {
          ...car.availabilityCalendar[existingIndex],
          ...dateEntry
        };
      } else {
        car.availabilityCalendar.push(dateEntry);
      }
    });

    await car.save();
    res.json({ success: true, message: 'Availability calendar updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Maintenance Log
exports.addMaintenanceLog = async (req, res) => {
  try {
    const { carId } = req.params;
    const { type, description, cost, serviceDate, nextServiceDate, serviceCenter, odometer } = req.body;

    const car = await Car.findOne({ _id: carId, owner: req.user.id });
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const documents = req.files ? req.files.map(file => file.path) : [];

    const maintenanceEntry = {
      type,
      description,
      cost,
      serviceDate,
      nextServiceDate,
      serviceCenter,
      odometer,
      documents
    };

    car.maintenanceLog.push(maintenanceEntry);
    
    // Update service reminders
    if (type === 'service' && nextServiceDate) {
      car.serviceReminders.nextService = {
        date: nextServiceDate,
        type: 'Regular Service',
        kmsDue: odometer + 10000 // Assuming 10k km service interval
      };
    }

    await car.save();
    res.json({ success: true, message: 'Maintenance log added', car });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Maintenance History
exports.getMaintenanceHistory = async (req, res) => {
  try {
    const { carId } = req.params;
    const car = await Car.findOne({ _id: carId, owner: req.user.id })
      .select('maintenanceLog serviceReminders name numberPlate');
    
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.json({ success: true, car });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Auto-Pricing Suggestions
exports.getAutoSuggestions = async (req, res) => {
  try {
    const { carId } = req.params;
    const car = await Car.findById(carId);
    
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Find similar cars in the same city
    const similarCars = await Car.find({
      'pickupLocation.city': car.pickupLocation.city,
      seats: car.seats,
      fuelType: car.fuelType,
      status: 'approved',
      _id: { $ne: carId }
    }).select('pricePerDay brand model');

    if (similarCars.length === 0) {
      return res.json({ 
        success: true, 
        message: 'No similar cars found for comparison',
        suggestions: null
      });
    }

    const avgPrice = similarCars.reduce((sum, c) => sum + c.pricePerDay, 0) / similarCars.length;
    const minPrice = Math.min(...similarCars.map(c => c.pricePerDay));
    const maxPrice = Math.max(...similarCars.map(c => c.pricePerDay));

    const suggestions = {
      currentPrice: car.pricePerDay,
      marketAverage: Math.round(avgPrice),
      priceRange: { min: minPrice, max: maxPrice },
      recommendation: avgPrice > car.pricePerDay ? 'increase' : 'decrease',
      message: `Aapke area mein ${car.seats}-seater ${car.fuelType} cars avg ₹${Math.round(avgPrice)}/day chal rahi hai`,
      competitorCount: similarCars.length
    };

    res.json({ success: true, suggestions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Dispute
exports.createDispute = async (req, res) => {
  try {
    const { bookingId, type, title, description, claimedAmount } = req.body;
    
    const booking = await Booking.findById(bookingId)
      .populate('car')
      .populate('user')
      .populate('owner');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is owner of the car
    if (booking.owner._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const images = req.files ? req.files.map(file => file.path) : [];

    const dispute = await Dispute.create({
      booking: bookingId,
      car: booking.car._id,
      raisedBy: req.user.id,
      againstUser: booking.user._id,
      type,
      title,
      description,
      claimedAmount,
      images
    });

    res.status(201).json({ success: true, message: 'Dispute created successfully', dispute });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get My Disputes
exports.getMyDisputes = async (req, res) => {
  try {
    const disputes = await Dispute.find({ raisedBy: req.user.id })
      .populate('booking', 'startDate endDate totalAmount')
      .populate('car', 'name numberPlate')
      .populate('againstUser', 'name phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, disputes });
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