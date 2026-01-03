import React, { useState } from 'react';
import { Calendar, Clock, MapPin, DollarSign, Star, X, Phone, Car } from 'lucide-react';
import axios from 'axios';
import { DEFAULT_CAR_IMAGE } from '../hooks';

const UserBookings = () => {
  const [bookings, setBookings] = useState([
    {
      _id: '1',
      car: {
        name: 'Swift Dzire',
        brand: 'Maruti Suzuki',
        numberPlate: 'MH12AB1234',
        images: [DEFAULT_CAR_IMAGE],
        pickupLocation: { address: 'Andheri West, Mumbai', city: 'Mumbai' }
      },
      owner: { name: 'Rajesh Kumar', phone: '+91 9876543210' },
      startDate: '2024-01-15',
      endDate: '2024-01-18',
      totalDays: 3,
      finalAmount: 3780,
      status: 'completed',
      paymentStatus: 'completed',
      createdAt: '2024-01-10T10:30:00Z'
    },
    {
      _id: '2',
      car: {
        name: 'Honda City',
        brand: 'Honda',
        numberPlate: 'MH14CD5678',
        images: [DEFAULT_CAR_IMAGE],
        pickupLocation: { address: 'Bandra East, Mumbai', city: 'Mumbai' }
      },
      owner: { name: 'Rajesh Kumar', phone: '+91 9876543210' },
      startDate: '2024-01-25',
      endDate: '2024-01-27',
      totalDays: 2,
      finalAmount: 3780,
      status: 'accepted',
      paymentStatus: 'partial',
      createdAt: '2024-01-20T14:20:00Z'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [cancelModal, setCancelModal] = useState({ show: false, bookingId: null });
  const [cancelReason, setCancelReason] = useState('');



  const handleCancelBooking = async () => {
    try {
      await axios.put(`/api/bookings/${cancelModal.bookingId}/cancel`, {
        reason: cancelReason
      });
      
      setBookings(bookings.map(booking => 
        booking._id === cancelModal.bookingId 
          ? { ...booking, status: 'cancelled' }
          : booking
      ));
      
      setCancelModal({ show: false, bookingId: null });
      setCancelReason('');
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const canCancelBooking = (booking) => {
    return ['pending', 'accepted'].includes(booking.status) && 
           new Date(booking.startDate) > new Date();
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">Track and manage your car bookings</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'all', label: 'All Bookings', count: bookings.length },
                { id: 'pending', label: 'Pending', count: bookings.filter(b => b.status === 'pending').length },
                { id: 'accepted', label: 'Confirmed', count: bookings.filter(b => b.status === 'accepted').length },
                { id: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    filter === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    filter === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all' ? 'You haven\'t made any bookings yet.' : `No ${filter} bookings.`}
            </p>
            <button
              onClick={() => window.location.href = '/search'}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Cars
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                        {booking.car.images && booking.car.images[0] ? (
                          <img
                            src={booking.car.images[0]}
                            alt={booking.car.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.car.name} - {booking.car.brand}
                        </h3>
                        <p className="text-sm text-gray-600">{booking.car.numberPlate}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{booking.totalDays} days</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{booking.car.pickupLocation.city}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>{booking.owner.name}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="flex items-center space-x-2 font-semibold text-green-600 mb-2 sm:mb-0">
                      <DollarSign className="h-4 w-4" />
                      <span>₹{booking.finalAmount}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        booking.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                        booking.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.paymentStatus}
                      </span>
                    </div>
                    
                    <div className="flex space-x-3">
                      {canCancelBooking(booking) && (
                        <button
                          onClick={() => setCancelModal({ show: true, bookingId: booking._id })}
                          className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Cancel Booking
                        </button>
                      )}
                      <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cancel Modal */}
        {cancelModal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Cancel Booking</h3>
                <button
                  onClick={() => setCancelModal({ show: false, bookingId: null })}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-gray-600 mb-4">
                Are you sure you want to cancel this booking? Please provide a reason:
              </p>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason for cancellation..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 mb-4"
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => setCancelModal({ show: false, bookingId: null })}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancelBooking}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBookings;