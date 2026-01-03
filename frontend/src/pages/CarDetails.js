import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Users, Fuel, Settings, Star, Calendar, Phone, Car, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CarDetails = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    specialRequests: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchCarDetails();
  }, [id]);

  const fetchCarDetails = async () => {
    try {
      const response = await axios.get(`/api/cars/${id}`);
      setCar(response.data.car);
    } catch (error) {
      console.error('Error fetching car details:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDays = () => {
    if (bookingData.startDate && bookingData.endDate) {
      const start = new Date(bookingData.startDate);
      const end = new Date(bookingData.endDate);
      const diffTime = Math.abs(end - start);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to book a car');
      return;
    }

    if (user.role !== 'user') {
      toast.error('Only users can book cars');
      return;
    }

    setBookingLoading(true);
    try {
      const response = await axios.post('/api/bookings', {
        carId: car._id,
        ...bookingData
      });
      
      toast.success('Booking request sent successfully!');
      setBookingData({ startDate: '', endDate: '', specialRequests: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Car not found</h2>
          <p className="text-gray-600">The car you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const totalDays = calculateDays();
  const totalAmount = totalDays * car.pricePerDay;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Car Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="card">
              {car.images && car.images.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {car.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${car.name} ${index + 1}`}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  ))}
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Car className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{car.name}</h1>
                  <p className="text-xl text-gray-600">{car.brand}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600">₹{car.pricePerDay}</div>
                  <div className="text-gray-600">per day</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Users className="h-5 w-5" />
                  <span>{car.seats} seats</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Fuel className="h-5 w-5" />
                  <span>{car.fuelType}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Settings className="h-5 w-5" />
                  <span>{car.transmission}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span>{car.rating || 'New'}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-gray-600 mb-4">
                <MapPin className="h-5 w-5" />
                <span>{car.pickupLocation.address}, {car.pickupLocation.city}</span>
              </div>

              {car.features && car.features.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {car.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Owner Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Car Owner</h3>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold">
                    {car.owner.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{car.owner.name}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Phone className="h-4 w-4" />
                      <span>{car.owner.phone}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{car.owner.rating || 'New'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-blue-600">₹{car.pricePerDay}</div>
                <div className="text-gray-600">per day</div>
                <div className="flex items-center justify-center mt-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm text-gray-600">{car.rating || 'New'} ({car.totalRatings || 0} reviews)</span>
                </div>
              </div>
              
              <form onSubmit={handleBooking} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Start Date
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={bookingData.startDate}
                      onChange={(e) => setBookingData({
                        ...bookingData,
                        startDate: e.target.value
                      })}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      End Date
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={bookingData.endDate}
                      onChange={(e) => setBookingData({
                        ...bookingData,
                        endDate: e.target.value
                      })}
                      min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Any special requirements..."
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData({
                      ...bookingData,
                      specialRequests: e.target.value
                    })}
                  />
                </div>

                {totalDays > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{totalDays} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price per day:</span>
                        <span className="font-medium">₹{car.pricePerDay}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">₹{totalAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Platform fee (5%):</span>
                        <span className="font-medium">₹{Math.round(totalAmount * 0.05)}</span>
                      </div>
                      <div className="border-t border-blue-200 pt-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-lg">Total Amount:</span>
                          <span className="font-bold text-xl text-blue-600">₹{totalAmount + Math.round(totalAmount * 0.05)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={bookingLoading || !isAuthenticated}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {bookingLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending Request...
                    </>
                  ) : (
                    'Send Booking Request'
                  )}
                </button>

                {!isAuthenticated && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Please login to book this car</p>
                    <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                      Login Now
                    </Link>
                  </div>
                )}
              </form>

              {/* Security Features */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Verified owner</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Insurance covered</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>24/7 support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;