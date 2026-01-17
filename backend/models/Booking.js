const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalDays: { type: Number, required: true },
  
  pricePerDay: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  platformFee: { type: Number, default: 0 },
  finalAmount: { type: Number, required: true },
  
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'confirmed', 'ongoing', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'partial', 'completed', 'refunded'], 
    default: 'pending' 
  },
  paymentId: String,
  advanceAmount: { type: Number, default: 0 },
  
  cancellationReason: String,
  cancelledBy: { type: String, enum: ['user', 'owner', 'admin'] },
  cancellationDate: Date,
  
  userReview: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    date: Date
  },
  ownerReview: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    date: Date
  },
  
  specialRequests: String,
  pickupTime: String,
  dropoffTime: String
}, { timestamps: true });

bookingSchema.pre('save', function(next) {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    this.totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    this.totalAmount = this.totalDays * this.pricePerDay;
    this.finalAmount = this.totalAmount + this.platformFee;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);