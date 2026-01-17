const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  name: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  numberPlate: { type: String, required: true, unique: true },
  fuelType: { type: String, enum: ['petrol', 'diesel', 'cng', 'electric'], required: true },
  seats: { type: Number, required: true },
  transmission: { type: String, enum: ['manual', 'automatic'], required: true },
  
  images: [{ type: String }],
  
  pricePerDay: { type: Number, required: true },
  securityDeposit: { type: Number, default: 0 },
  maxKmPerDay: { type: Number, default: 300 },
  extraChargePerKm: { type: Number, default: 10 },
  
  availableFrom: { type: Date, required: true },
  availableTo: { type: Date, required: true },
  
  pickupLocation: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  
  rcDocument: { type: String, required: true },
  insurance: { type: String, required: true },
  pollutionCert: { type: String },
  
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'blocked', 'inactive'], 
    default: 'pending' 
  },
  
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  
  features: [{ type: String }],
  
  blockedDates: [{
    from: Date,
    to: Date,
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }
  }]
}, { timestamps: true });

carSchema.index({ 'pickupLocation.city': 1, status: 1, availableFrom: 1, availableTo: 1 });

module.exports = mongoose.model('Car', carSchema);