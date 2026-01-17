const mongoose = require('mongoose');
require('dotenv').config();

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
    city: { type: String, required: true }
  },
  rcDocument: { type: String, required: true },
  insurance: { type: String, required: true },
  pollutionCert: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'blocked', 'inactive'], default: 'pending' },
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  features: [{ type: String }],
  blockedDates: [{ from: Date, to: Date, bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' } }]
}, { timestamps: true });

const Car = mongoose.model('Car', carSchema);
const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));

const sampleCars = [
  {
    name: 'Maruti Swift',
    brand: 'Maruti Suzuki',
    model: 'Swift VXI',
    year: 2022,
    numberPlate: 'DL01AB1234',
    fuelType: 'petrol',
    seats: 5,
    transmission: 'manual',
    pricePerDay: 1200,
    securityDeposit: 2000,
    maxKmPerDay: 300,
    extraChargePerKm: 8,
    pickupLocation: { address: 'Connaught Place', city: 'Delhi' },
    features: ['AC', 'Music System', 'Power Steering'],
    images: ['https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800'],
    rating: 4.5,
    totalRatings: 45
  },
  {
    name: 'Hyundai Creta',
    brand: 'Hyundai',
    model: 'Creta SX',
    year: 2023,
    numberPlate: 'MH02CD5678',
    fuelType: 'diesel',
    seats: 5,
    transmission: 'automatic',
    pricePerDay: 2500,
    securityDeposit: 5000,
    maxKmPerDay: 250,
    extraChargePerKm: 12,
    pickupLocation: { address: 'Bandra West', city: 'Mumbai' },
    features: ['AC', 'GPS', 'Sunroof', 'Leather Seats'],
    images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'],
    rating: 4.8,
    totalRatings: 120
  },
  {
    name: 'Honda City',
    brand: 'Honda',
    model: 'City ZX',
    year: 2023,
    numberPlate: 'KA03EF9012',
    fuelType: 'petrol',
    seats: 5,
    transmission: 'automatic',
    pricePerDay: 2000,
    securityDeposit: 3000,
    maxKmPerDay: 300,
    extraChargePerKm: 10,
    pickupLocation: { address: 'Koramangala', city: 'Bangalore' },
    features: ['AC', 'Music System', 'Cruise Control'],
    images: ['https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800'],
    rating: 4.6,
    totalRatings: 85
  },
  {
    name: 'Mahindra Thar',
    brand: 'Mahindra',
    model: 'Thar LX',
    year: 2022,
    numberPlate: 'RJ14GH3456',
    fuelType: 'diesel',
    seats: 4,
    transmission: 'manual',
    pricePerDay: 3500,
    securityDeposit: 8000,
    maxKmPerDay: 200,
    extraChargePerKm: 15,
    pickupLocation: { address: 'MI Road', city: 'Jaipur' },
    features: ['4WD', 'AC', 'Off-road Capable'],
    images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800'],
    rating: 4.9,
    totalRatings: 95
  },
  {
    name: 'Toyota Innova',
    brand: 'Toyota',
    model: 'Innova Crysta',
    year: 2023,
    numberPlate: 'TN09IJ7890',
    fuelType: 'diesel',
    seats: 7,
    transmission: 'automatic',
    pricePerDay: 3000,
    securityDeposit: 6000,
    maxKmPerDay: 300,
    extraChargePerKm: 12,
    pickupLocation: { address: 'T Nagar', city: 'Chennai' },
    features: ['AC', 'GPS', 'Spacious', 'Captain Seats'],
    images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'],
    rating: 4.7,
    totalRatings: 150
  },
  {
    name: 'Tata Nexon EV',
    brand: 'Tata',
    model: 'Nexon EV Max',
    year: 2023,
    numberPlate: 'GJ01KL2345',
    fuelType: 'electric',
    seats: 5,
    transmission: 'automatic',
    pricePerDay: 2200,
    securityDeposit: 4000,
    maxKmPerDay: 250,
    extraChargePerKm: 10,
    pickupLocation: { address: 'SG Highway', city: 'Ahmedabad' },
    features: ['AC', 'Fast Charging', 'Touchscreen', 'Connected Car'],
    images: ['https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800'],
    rating: 4.4,
    totalRatings: 60
  }
];

async function addSampleCars() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const admin = await User.findOne({ email: 'admin@gmail.com' });
    if (!admin) {
      console.error('Admin user not found. Please run the server first to create default users.');
      process.exit(1);
    }

    await Car.deleteMany({});
    console.log('Cleared existing cars');

    const today = new Date();
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 6);

    for (const carData of sampleCars) {
      await Car.create({
        ...carData,
        owner: admin._id,
        availableFrom: today,
        availableTo: futureDate,
        rcDocument: 'uploads/docs/rc.pdf',
        insurance: 'uploads/docs/insurance.pdf',
        pollutionCert: 'uploads/docs/pollution.pdf',
        status: 'approved'
      });
      console.log(`Added: ${carData.name}`);
    }

    console.log('\n✅ Successfully added 6 sample cars!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addSampleCars();
