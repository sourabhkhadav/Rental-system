import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, Car, Calendar, DollarSign, CheckCircle, XCircle, 
  Shield, AlertTriangle, TrendingUp, Activity, 
  UserCheck, UserX, Eye, Search, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingCars, setPendingCars] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allCars, setAllCars] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === 'all-users') fetchAllUsers();
    if (activeTab === 'all-cars') fetchAllCars();
    if (activeTab === 'bookings') fetchAllBookings();
  }, [activeTab]);

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
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get('/api/admin/users');
      setAllUsers(res.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    }
  };

  const fetchAllCars = async () => {
    try {
      const res = await axios.get('/api/admin/cars');
      setAllCars(res.data.cars);
    } catch (error) {
      console.error('Error fetching cars:', error);
      toast.error('Failed to load cars');
    }
  };

  const fetchAllBookings = async () => {
    try {
      const res = await axios.get('/api/admin/bookings');
      setAllBookings(res.data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    }
  };

  const handleUserApproval = async (userId, action) => {
    try {
      await axios.put(`/api/admin/users/${userId}/approve`, { action });
      toast.success(`User ${action}d successfully`);
      fetchDashboardData();
      if (activeTab === 'all-users') fetchAllUsers();
    } catch (error) {
      console.error('Error handling user approval:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleCarApproval = async (carId, action) => {
    try {
      await axios.put(`/api/admin/cars/${carId}/approve`, { action });
      toast.success(`Car ${action}d successfully`);
      fetchDashboardData();
      if (activeTab === 'all-cars') fetchAllCars();
    } catch (error) {
      console.error('Error handling car approval:', error);
      toast.error('Failed to update car status');
    }
  };

  const handleUserBlock = async (userId, action) => {
    try {
      await axios.put(`/api/admin/users/${userId}/block`, { action });
      toast.success(`User ${action}ed successfully`);
      fetchAllUsers();
    } catch (error) {
      console.error('Error blocking user:', error);
      toast.error('Failed to update user status');
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      blocked: 'bg-gray-100 text-gray-800'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`;
  };

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredCars = allCars.filter(car => {
    const matchesSearch = (car.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (car.brand || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (car.numberPlate || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || car.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">Manage users, cars, bookings and monitor platform activity</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalUsers || 0}</p>
                <p className="text-xs text-gray-500 mt-1">+{stats.totalOwners || 0} owners</p>
              </div>
              <Users className="h-12 w-12 text-blue-600 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cars</p>
                <p className="text-3xl font-bold text-green-600">{stats.totalCars || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Listed vehicles</p>
              </div>
              <Car className="h-12 w-12 text-green-600 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalBookings || 0}</p>
                <p className="text-xs text-gray-500 mt-1">{stats.completedBookings || 0} completed</p>
              </div>
              <Calendar className="h-12 w-12 text-purple-600 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Platform Revenue</p>
                <p className="text-3xl font-bold text-yellow-600">₹{stats.totalEarnings || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Commission earned</p>
              </div>
              <DollarSign className="h-12 w-12 text-yellow-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Pending Approvals Alert */}
        {(stats.pendingApprovals?.users > 0 || stats.pendingApprovals?.cars > 0) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <h3 className="text-sm font-medium text-yellow-800">Pending Approvals Required</h3>
            </div>
            <div className="mt-2 text-sm text-yellow-700">
              {stats.pendingApprovals?.users > 0 && (
                <span className="mr-4">{stats.pendingApprovals.users} users awaiting approval</span>
              )}
              {stats.pendingApprovals?.cars > 0 && (
                <span>{stats.pendingApprovals.cars} cars awaiting approval</span>
              )}
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Overview', icon: Activity },
              { id: 'pending-users', label: 'Pending Users', icon: UserCheck, count: stats.pendingApprovals?.users },
              { id: 'pending-cars', label: 'Pending Cars', icon: Car, count: stats.pendingApprovals?.cars },
              { id: 'all-users', label: 'All Users', icon: Users },
              { id: 'all-cars', label: 'All Cars', icon: Car },
              { id: 'bookings', label: 'Bookings', icon: Calendar }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Users</span>
                  <span className="font-semibold">{stats.totalUsers - (stats.pendingApprovals?.users || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Approved Cars</span>
                  <span className="font-semibold">{stats.totalCars - (stats.pendingApprovals?.cars || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed Bookings</span>
                  <span className="font-semibold">{stats.completedBookings || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Platform Commission</span>
                  <span className="font-semibold text-green-600">₹{stats.totalEarnings || 0}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab('pending-users')}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Review Pending Users</span>
                    <span className="text-sm text-gray-500">{stats.pendingApprovals?.users || 0} pending</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('pending-cars')}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Review Pending Cars</span>
                    <span className="text-sm text-gray-500">{stats.pendingApprovals?.cars || 0} pending</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('all-users')}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Manage All Users</span>
                    <span className="text-sm text-gray-500">{stats.totalUsers || 0} total</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pending-users' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Pending User Approvals</h2>
              <p className="text-gray-600 mt-1">Review and approve new user registrations</p>
            </div>
            
            <div className="p-6">
              {pendingUsers.length === 0 ? (
                <div className="text-center py-12">
                  <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No pending user approvals</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingUsers.map((user) => (
                    <div key={user._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                            <span className={getStatusBadge(user.status)}>{user.status}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'owner' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                            <p><span className="font-medium">Email:</span> {user.email}</p>
                            <p><span className="font-medium">Phone:</span> {user.phone}</p>
                            <p><span className="font-medium">Registered:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
                            {user.city && <p><span className="font-medium">City:</span> {user.city}</p>}
                          </div>
                        </div>
                        
                        <div className="mt-4 lg:mt-0 flex space-x-2">
                          <button
                            onClick={() => handleUserApproval(user._id, 'approve')}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleUserApproval(user._id, 'reject')}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
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
          </div>
        )}

        {activeTab === 'pending-cars' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Pending Car Approvals</h2>
              <p className="text-gray-600 mt-1">Review and approve new car listings</p>
            </div>
            
            <div className="p-6">
              {pendingCars.length === 0 ? (
                <div className="text-center py-12">
                  <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No pending car approvals</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingCars.map((car) => (
                    <div key={car._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{car.name} - {car.brand}</h3>
                            <span className={getStatusBadge(car.status)}>{car.status}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                            <p><span className="font-medium">Number Plate:</span> {car.numberPlate}</p>
                            <p><span className="font-medium">Owner:</span> {car.owner?.name} ({car.owner?.email})</p>
                            <p><span className="font-medium">Price:</span> ₹{car.pricePerDay}/day</p>
                            <p><span className="font-medium">Location:</span> {car.pickupLocation?.city}</p>
                            <p><span className="font-medium">Submitted:</span> {new Date(car.createdAt).toLocaleDateString()}</p>
                            <p><span className="font-medium">Fuel Type:</span> {car.fuelType}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 lg:mt-0 flex space-x-2">
                          <button
                            onClick={() => handleCarApproval(car._id, 'approve')}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleCarApproval(car._id, 'reject')}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
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
          </div>
        )}

        {activeTab === 'all-users' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">All Users</h2>
                  <p className="text-gray-600 mt-1">Manage all registered users</p>
                </div>
                <div className="mt-4 sm:mt-0 flex space-x-3">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No users found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                            <span className={getStatusBadge(user.status)}>{user.status}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'owner' ? 'bg-blue-100 text-blue-800' : 
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                            <p><span className="font-medium">Email:</span> {user.email}</p>
                            <p><span className="font-medium">Phone:</span> {user.phone}</p>
                            <p><span className="font-medium">Joined:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 lg:mt-0 flex space-x-2">
                          {user.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleUserApproval(user._id, 'approve')}
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleUserApproval(user._id, 'reject')}
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {user.status === 'approved' && user.role !== 'admin' && (
                            <button
                              onClick={() => handleUserBlock(user._id, 'block')}
                              className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
                            >
                              Block
                            </button>
                          )}
                          {user.status === 'blocked' && (
                            <button
                              onClick={() => handleUserBlock(user._id, 'unblock')}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                            >
                              Unblock
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'all-cars' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">All Cars</h2>
                  <p className="text-gray-600 mt-1">Manage all car listings</p>
                </div>
                <div className="mt-4 sm:mt-0 flex space-x-3">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search cars..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {filteredCars.length === 0 ? (
                <div className="text-center py-12">
                  <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No cars found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCars.map((car) => (
                    <div key={car._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{car.name} - {car.brand}</h3>
                            <span className={getStatusBadge(car.status)}>{car.status}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                            <p><span className="font-medium">Number Plate:</span> {car.numberPlate}</p>
                            <p><span className="font-medium">Owner:</span> {car.owner?.name}</p>
                            <p><span className="font-medium">Price:</span> ₹{car.pricePerDay}/day</p>
                            <p><span className="font-medium">Location:</span> {car.pickupLocation?.city}</p>
                            <p><span className="font-medium">Fuel:</span> {car.fuelType}</p>
                            <p><span className="font-medium">Listed:</span> {new Date(car.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 lg:mt-0 flex space-x-2">
                          {car.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleCarApproval(car._id, 'approve')}
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleCarApproval(car._id, 'reject')}
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">All Bookings</h2>
              <p className="text-gray-600 mt-1">Monitor all platform bookings</p>
            </div>
            
            <div className="p-6">
              {allBookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No bookings found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {allBookings.map((booking) => (
                    <div key={booking._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {booking.car?.name} - {booking.car?.brand}
                            </h3>
                            <span className={getStatusBadge(booking.status)}>{booking.status}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                            <p><span className="font-medium">Customer:</span> {booking.user?.name}</p>
                            <p><span className="font-medium">Owner:</span> {booking.owner?.name}</p>
                            <p><span className="font-medium">Total:</span> ₹{booking.totalAmount}</p>
                            <p><span className="font-medium">Start:</span> {new Date(booking.startDate).toLocaleDateString()}</p>
                            <p><span className="font-medium">End:</span> {new Date(booking.endDate).toLocaleDateString()}</p>
                            <p><span className="font-medium">Booked:</span> {new Date(booking.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;