import React from 'react';
import { Link } from 'react-router-dom';
import { X, Car, Plus, Calendar, DollarSign, Star, User } from 'lucide-react';

const OwnerPanelModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: Car,
      description: 'Overview & Stats'
    },
    {
      name: 'Add Car',
      path: '/add-car',
      icon: Plus,
      description: 'List new car'
    },
    {
      name: 'My Cars',
      path: '/my-cars',
      icon: Car,
      description: 'Manage listings'
    },
    {
      name: 'Bookings',
      path: '/bookings',
      icon: Calendar,
      description: 'Handle requests'
    },
    {
      name: 'Earnings',
      path: '/earnings',
      icon: DollarSign,
      description: 'Track income'
    },
    {
      name: 'Reviews',
      path: '/reviews',
      icon: Star,
      description: 'Customer feedback'
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: User,
      description: 'Update details'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Owner Panel</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={onClose}
                    className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex-shrink-0">
                      <Icon className="h-6 w-6 text-gray-400 group-hover:text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              Manage your car rental business
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerPanelModal;