import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Car, Calendar, DollarSign, TrendingUp, Users, Plus, Settings, Eye, User } from 'lucide-react';

const OwnerDashboard = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    activeCars: 0,
    totalBookings: 0,
    totalEarnings: 0,
    pendingPayouts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/cars/owner-stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Use dummy data if API fails
      setStats({
        totalCars: 5,
        activeCars: 3,
        totalBookings: 12,
        totalEarnings: 45000,
        pendingPayouts: 8500
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7FB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Cars',
      value: stats.totalCars,
      icon: Car,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Active Cars',
      value: stats.activeCars,
      icon: Car,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      title: 'Total Earnings',
      value: `₹${stats.totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Pending Payout',
      value: `₹${stats.pendingPayouts.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-amber-500',
      textColor: 'text-amber-600'
    }
  ];

  const quickActions = [
    {
      title: 'Add New Car',
      description: 'List a new vehicle for rental',
      icon: Plus,
      color: 'bg-blue-500',
      link: '/add-car'
    },
    {
      title: 'Manage Cars',
      description: 'View and edit your vehicles',
      icon: Settings,
      color: 'bg-green-500',
      link: '/my-cars'
    },
    {
      title: 'View Bookings',
      description: 'Check rental requests & history',
      icon: Eye,
      color: 'bg-purple-500',
      link: '/bookings'
    },
    {
      title: 'Update Profile',
      description: 'Manage your account settings',
      icon: User,
      color: 'bg-gray-500',
      link: '/profile'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F7FB]">
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Section 1: Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Dashboard Overview</h1>
          <p className="text-lg text-gray-500">Track your car rental business performance</p>
        </div>

        {/* Section 2: Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {statCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-2">{stat.title}</p>
                    <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center ml-4`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section 3: Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Link
                  key={index}
                  to={action.link}
                  className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100"
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 ${action.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default OwnerDashboard;