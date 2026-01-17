import React, { useState } from 'react';
import { X, Calendar, MapPin, IndianRupee, Clock, Users, Fuel, Settings, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import BookNowButton from '../ui/BookNowButton';

const BookingModal = ({ car, isOpen, onClose }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    startTime: '10:00',
    endTime: '10:00',
    specialRequests: ''
  });

  if (!isOpen) return null;

  const calculateDays = () => {
    if (!bookingData.startDate || !bookingData.endDate) return 0;
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const days = calculateDays();
  const subtotal = days * car.pricePerDay;
  const platformFee = Math.round(subtotal * 0.05);
  const total = subtotal + platformFee;

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book a car');
      navigate('/login');
      onClose();
      return;
    }

    if (user?.role !== 'user') {
      toast.error('Only users can book cars');
      return;
    }

    if (!bookingData.startDate || !bookingData.endDate) {
      toast.error('Please select booking dates');
      return;
    }

    if (days <= 0) {
      toast.error('End date must be after start date');
      return;
    }

    setBookingLoading(true);
    try {
      const response = await axios.post('/api/bookings', {
        carId: car._id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        pickupTime: bookingData.startTime,
        dropoffTime: bookingData.endTime,
        specialRequests: bookingData.specialRequests
      });
      
      toast.success('Booking request sent successfully!');
      onClose();
      setBookingData({
        startDate: '',
        endDate: '',
        startTime: '10:00',
        endTime: '10:00',
        specialRequests: ''
      });
      
      // Navigate to bookings page
      setTimeout(() => {
        navigate('/my-bookings');
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-y-auto">
      <div className="min-h-screen">
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Complete Your Booking</h2>
              <p className="text-sm text-gray-600 mt-1">Just a few steps away from your ride</p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Car Info & Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Car Info Card - Compact Design */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
                <div className="flex gap-5">
                  {/* Small Car Image */}
                  <div className="flex-shrink-0">
                    <img 
                      src={car.images?.[0] || '/default-car.jpg'} 
                      alt={car.name}
                      className="w-32 h-32 object-cover rounded-xl shadow-md"
                    />
                  </div>
                  
                  {/* Car Details */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{car.name}</h3>
                    <p className="text-base text-gray-600 mb-3">{car.brand}</p>
                    
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{car.pickupLocation?.city || 'N/A'}</span>
                    </div>
                    
                    {/* Car Specifications - Inline */}
                    <div className="flex gap-3">
                      <div className="bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-semibold text-gray-900">{car.seats} Seats</span>
                        </div>
                      </div>
                      <div className="bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                        <div className="flex items-center gap-2">
                          <Fuel className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-semibold text-gray-900 capitalize">{car.fuelType}</span>
                        </div>
                      </div>
                      <div className="bg-purple-50 px-3 py-2 rounded-lg border border-purple-100">
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-semibold text-gray-900 capitalize">{car.transmission}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center">
                  <Calendar className="h-6 w-6 mr-2 text-blue-600" />
                  Booking Details
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={bookingData.startDate}
                        onChange={(e) => setBookingData({...bookingData, startDate: e.target.value})}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={bookingData.endDate}
                        onChange={(e) => setBookingData({...bookingData, endDate: e.target.value})}
                        min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Clock className="h-4 w-4 inline mr-1 text-blue-600" />
                        Pickup Time
                      </label>
                      <input
                        type="time"
                        value={bookingData.startTime}
                        onChange={(e) => setBookingData({...bookingData, startTime: e.target.value})}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Clock className="h-4 w-4 inline mr-1 text-blue-600" />
                        Return Time
                      </label>
                      <input
                        type="time"
                        value={bookingData.endTime}
                        onChange={(e) => setBookingData({...bookingData, endTime: e.target.value})}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      value={bookingData.specialRequests}
                      onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                      placeholder="Any special requirements or requests..."
                      rows="3"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none resize-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Price Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                {/* Price Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-5 text-white">
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-1">₹{car.pricePerDay}</div>
                      <div className="text-blue-100 text-base">per day</div>
                    </div>
                  </div>

                  {days > 0 ? (
                    <div className="p-5">
                      <h4 className="text-base font-bold text-gray-900 mb-3 flex items-center">
                        <IndianRupee className="h-4 w-4 mr-1 text-blue-600" />
                        Price Breakdown
                      </h4>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">Duration</span>
                          <span className="font-semibold text-gray-900">{days} {days === 1 ? 'day' : 'days'}</span>
                        </div>
                        
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">₹{car.pricePerDay} × {days}</span>
                          <span className="font-semibold text-gray-900">₹{subtotal}</span>
                        </div>
                        
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">Platform fee (5%)</span>
                          <span className="font-semibold text-gray-900">₹{platformFee}</span>
                        </div>
                        
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 mt-3">
                          <div className="flex justify-between items-center">
                            <span className="text-base font-bold text-gray-900">Total Amount</span>
                            <span className="text-2xl font-bold text-blue-600">₹{total}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-5 space-y-2">
                        <BookNowButton
                          onClick={handleBooking}
                          loading={bookingLoading}
                          disabled={bookingLoading}
                        >
                          {isAuthenticated ? 'Confirm Booking' : 'Login to Book'}
                        </BookNowButton>
                        
                        {!isAuthenticated && (
                          <p className="text-center text-sm text-gray-600">
                            Please <Link to="/login" className="text-blue-600 font-semibold hover:underline">login</Link> or <Link to="/register" className="text-blue-600 font-semibold hover:underline">sign up</Link> to complete booking
                          </p>
                        )}
                        
                        <button
                          onClick={onClose}
                          className="w-full border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                        >
                          Cancel
                        </button>
                      </div>

                      {/* Trust Badges */}
                      <div className="mt-5 pt-5 border-t border-gray-200 space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Info className="h-3 w-3 text-green-600" />
                          </div>
                          <span>Verified owner & car</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Info className="h-3 w-3 text-blue-600" />
                          </div>
                          <span>Insurance covered</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Info className="h-3 w-3 text-purple-600" />
                          </div>
                          <span>24/7 support available</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 text-center">
                      <Calendar className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Select dates to see pricing</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
