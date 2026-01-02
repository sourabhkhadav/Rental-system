import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Clock, User, Phone, MapPin, DollarSign, ArrowLeft } from 'lucide-react';

const Bookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/bookings/owner-bookings');
      setBookings(response.data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Dummy data
      setBookings([
        {
          _id: '1',
          user: {
            name: 'Rahul Sharma',
            phone: '+91 9876543210',
            email: 'rahul@example.com'
          },
          car: {
            name: 'Swift Dzire',
            brand: 'Maruti',
            numberPlate: 'MH12AB1234'
          },
          startDate: '2024-01-15',
          endDate: '2024-01-18',
          totalDays: 3,
          finalAmount: 3600,
          status: 'pending',
          createdAt: '2024-01-10T10:30:00Z'
        },
        {
          _id: '2',
          user: {
            name: 'Priya Patel',
            phone: '+91 8765432109',
            email: 'priya@example.com'
          },
          car: {
            name: 'Honda City',
            brand: 'Honda',
            numberPlate: 'MH14CD5678'
          },
          startDate: '2024-01-12',
          endDate: '2024-01-14',
          totalDays: 2,
          finalAmount: 3600,
          status: 'accepted',
          createdAt: '2024-01-08T14:20:00Z'
        },
        {
          _id: '3',
          user: {
            name: 'Amit Kumar',
            phone: '+91 7654321098',
            email: 'amit@example.com'
          },
          car: {
            name: 'Hyundai Creta',
            brand: 'Hyundai',
            numberPlate: 'MH01EF9012'
          },
          startDate: '2024-01-05',
          endDate: '2024-01-08',
          totalDays: 3,
          finalAmount: 7500,
          status: 'completed',
          createdAt: '2024-01-02T09:15:00Z'
        },
        {
          _id: '4',
          user: {
            name: 'Sneha Gupta',
            phone: '+91 6543210987',
            email: 'sneha@example.com'
          },
          car: {
            name: 'Swift Dzire',
            brand: 'Maruti',
            numberPlate: 'MH12AB1234'
          },
          startDate: '2024-01-20',
          endDate: '2024-01-22',
          totalDays: 2,
          finalAmount: 2400,
          status: 'rejected',
          createdAt: '2024-01-18T16:45:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = async (bookingId, action) => {
    try {
      // Simulate API call
      console.log(`${action} booking ${bookingId}`);
      
      // Update local state
      setBookings(bookings.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: action === 'accept' ? 'accepted' : 'rejected' }
          : booking
      ));
    } catch (error) {
      console.error(`Error ${action} booking:`, error);
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

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  if (loading) {
    return <div className="text-center py-8">Loading bookings...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F7F7FB]">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Requests</h1>
          <p className="text-gray-600">Manage your car booking requests</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="border-b border-gray-100">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'all', label: 'All Bookings', count: bookings.length },
                { id: 'pending', label: 'Pending', count: bookings.filter(b => b.status === 'pending').length },
                { id: 'accepted', label: 'Accepted', count: bookings.filter(b => b.status === 'accepted').length },
                { id: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`py-4 px-1 border-b-2 font-semibold text-sm flex items-center space-x-2 transition-colors ${
                    filter === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    filter === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">No bookings found</h3>
                <p className="text-gray-600">
                  {filter === 'all' ? 'No booking requests yet.' : `No ${filter} bookings.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div key={booking._id} className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:bg-white hover:shadow-lg transition-all duration-300">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                      <div className="flex-1">
                        {/* Header with Car Name and Status */}
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-gray-900">
                            {booking.car.name} - {booking.car.brand}
                          </h3>
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        
                        {/* Customer and Booking Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <User className="h-5 w-5 text-gray-400" />
                              <span className="font-medium text-gray-900">{booking.user.name}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Phone className="h-5 w-5 text-gray-400" />
                              <span className="text-gray-700">{booking.user.phone}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <Calendar className="h-5 w-5 text-gray-400" />
                              <span className="text-gray-700">
                                {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Clock className="h-5 w-5 text-gray-400" />
                              <span className="text-gray-700">{booking.totalDays} days</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Price and Request Date */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-5 w-5 text-green-600" />
                            <span className="text-2xl font-bold text-green-600">₹{booking.finalAmount.toLocaleString()}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            Requested on {new Date(booking.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      {booking.status === 'pending' && (
                        <div className="mt-6 lg:mt-0 lg:ml-6 flex space-x-3">
                          <button
                            onClick={() => handleBookingAction(booking._id, 'accept')}
                            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleBookingAction(booking._id, 'reject')}
                            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;