const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  againstUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Dispute Details
  type: { 
    type: String, 
    enum: ['damage', 'late_return', 'payment_issue', 'no_show', 'cleanliness', 'other'], 
    required: true 
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  
  // Evidence
  images: [String],
  documents: [String],
  
  // Financial Impact
  claimedAmount: { type: Number, default: 0 },
  approvedAmount: { type: Number, default: 0 },
  
  // Status & Resolution
  status: { 
    type: String, 
    enum: ['open', 'under_review', 'resolved', 'rejected', 'closed'], 
    default: 'open' 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'], 
    default: 'medium' 
  },
  
  // Admin Response
  adminNotes: String,
  resolution: String,
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolvedAt: Date,
  
  // Communication
  messages: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    attachments: [String]
  }]
  
}, { timestamps: true });

module.exports = mongoose.model('Dispute', disputeSchema);