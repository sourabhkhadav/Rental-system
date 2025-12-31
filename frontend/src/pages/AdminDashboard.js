import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Car, Calendar, DollarSign, CheckCircle, XCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingCars, setPendingCars] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, usersRes, carsRes] = await Promise.all([
        axios.get('/api/admin/dashboard'),
        axios.get('/api/admin/users/pending'),
        axios.get('/api/admin/cars/pending')
      ]);
      
      setStats(statsRes.data.stats);
      setPendingUsers(usersRes.data.users);
      setPendingCars(carsRes.data.cars);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserApproval = async (userId, action) => {
    try {
      await axios.put(`/api/admin/users/${userId}/approve`, { action });
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error handling user approval:', error);
    }
  };

  const handleCarApproval = async (carId, action) => {
    try {
      await axios.put(`/api/admin/cars/${carId}/approve`, { action });
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error handling car approval:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading admin dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage users, cars, and bookings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center space-x-3">
              <Car className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Cars</h3>
                <p className="text-3xl font-bold text-green-600">{stats.totalCars}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Bookings</h3>
                <p className="text-3xl font-bold text-purple-600">{stats.totalBookings}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-8 w-8 text-yellow-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Platform Earnings</h3>
                <p className="text-3xl font-bold text-yellow-600">₹{stats.totalEarnings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Approvals Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-yellow-50 border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Pending User Approvals</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingApprovals?.users || 0}</p>
          </div>
          
          <div className="card bg-orange-50 border-orange-200">
            <h3 className="text-lg font-semibold text-orange-800 mb-2">Pending Car Approvals</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.pendingApprovals?.cars || 0}</p>
          </div>
          
          <div className="card bg-red-50 border-red-200">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Pending Owner Approvals</h3>
            <p className="text-3xl font-bold text-red-600">{stats.pendingApprovals?.owners || 0}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {['dashboard', 'users', 'cars'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'users' && (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Pending User Approvals</h2>
            
            {pendingUsers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No pending user approvals</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingUsers.map((user) => (
                  <div key={user._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{user.name}</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Email: {user.email}</p>
                          <p>Phone: {user.phone}</p>
                          <p>Role: {user.role}</p>
                          <p>Registered: {new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0 flex space-x-2">
                        <button
                          onClick={() => handleUserApproval(user._id, 'approve')}
                          className="btn-primary text-sm flex items-center space-x-1"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleUserApproval(user._id, 'reject')}
                          className="btn-secondary text-sm flex items-center space-x-1"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'cars' && (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Pending Car Approvals</h2>
            
            {pendingCars.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No pending car approvals</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingCars.map((car) => (
                  <div key={car._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{car.name} - {car.brand}</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Number Plate: {car.numberPlate}</p>
                          <p>Owner: {car.owner.name} ({car.owner.email})</p>
                          <p>Price: ₹{car.pricePerDay}/day</p>
                          <p>Location: {car.pickupLocation.city}</p>
                          <p>Submitted: {new Date(car.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0 flex space-x-2">
                        <button
                          onClick={() => handleCarApproval(car._id, 'approve')}
                          className="btn-primary text-sm flex items-center space-x-1"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleCarApproval(car._id, 'reject')}
                          className="btn-secondary text-sm flex items-center space-x-1"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;