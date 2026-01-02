const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Car Details
  name: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  numberPlate: { type: String, required: true, unique: true },
  fuelType: { type: String, enum: ['petrol', 'diesel', 'cng', 'electric'], required: true },
  seats: { type: Number, required: true },
  transmission: { type: String, enum: ['manual', 'automatic'], required: true },
  
  // Images
  images: [{ type: String }],
  
  // Dynamic Pricing
  pricePerDay: { type: Number, required: true }, // Base price
  dynamicPricing: {
    enabled: { type: Boolean, default: false },
    weekendPrice: { type: Number },
    weekdayPrice: { type: Number },
    seasonalRates: [{
      name: String, // "Summer", "Winter", "Festival"
      startDate: Date,
      endDate: Date,
      pricePerDay: Number
    }],
    customDates: [{
      date: Date,
      pricePerDay: Number,
      reason: String // "Holiday", "Event"
    }]
  },
  securityDeposit: { type: Number, default: 0 },
  
  // KM Based Pricing
  pricingType: { type: String, enum: ['unlimited', 'per_km'], default: 'unlimited' },
  maxKmPerDay: { type: Number, default: 300 },
  extraChargePerKm: { type: Number, default: 10 },
  
  // Availability
  availableFrom: { type: Date, required: true },
  availableTo: { type: Date, required: true },
  
  // Location
  pickupLocation: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  
  // Documents
  rcDocument: { type: String, required: true },
  insurance: { type: String, required: true },
  pollutionCert: { type: String },
  
  // Status
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'blocked', 'inactive'], 
    default: 'pending' 
  },
  
  // Ratings
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  
  // Features
  features: [{ type: String }], // AC, GPS, etc.
  
  // Availability Calendar
  availabilityCalendar: [{
    date: { type: Date, required: true },
    status: { type: String, enum: ['available', 'blocked', 'booked', 'maintenance'], default: 'available' },
    reason: String, // "Personal use", "Maintenance", "Booked"
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }
  }],
  
  // Blocked dates (when car is booked)
  blockedDates: [{
    from: Date,
    to: Date,
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }
  }],
  
  // Maintenance & Service Log
  maintenanceLog: [{
    type: { type: String, enum: ['service', 'tyre_change', 'oil_change', 'repair', 'other'], required: true },
    description: String,
    cost: Number,
    serviceDate: { type: Date, required: true },
    nextServiceDate: Date,
    serviceCenter: String,
    odometer: Number,
    documents: [String], // Receipt images
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Service Reminders
  serviceReminders: {
    nextService: {
      date: Date,
      type: String,
      kmsDue: Number
    },
    insurance: {
      expiryDate: Date,
      reminderSent: { type: Boolean, default: false }
    },
    pollution: {
      expiryDate: Date,
      reminderSent: { type: Boolean, default: false }
    }
  }
  
}, { timestamps: true });

// Index for search
carSchema.index({ 'pickupLocation.city': 1, status: 1, availableFrom: 1, availableTo: 1 });

module.exports = mongoose.model('Car', carSchema);