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
  
  // Pricing
  pricePerDay: { type: Number, required: true },
  securityDeposit: { type: Number, default: 0 },
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
  
  // Blocked dates (when car is booked)
  blockedDates: [{
    from: Date,
    to: Date,
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }
  }]
  
}, { timestamps: true });

// Index for search
carSchema.index({ 'pickupLocation.city': 1, status: 1, availableFrom: 1, availableTo: 1 });

module.exports = mongoose.model('Car', carSchema);