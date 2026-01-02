import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  X, 
  LayoutDashboard, 
  Car, 
  Plus, 
  Calendar, 
  DollarSign, 
  User, 
  Star
} from 'lucide-react';

const OwnerPanelModal = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  if (!isOpen) return null;

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'Add Car',
      path: '/add-car',
      icon: Plus
    },
    {
      name: 'My Cars',
      path: '/my-cars',
      icon: Car
    },
    {
      name: 'Bookings',
      path: '/bookings',
      icon: Calendar
    },
    {
      name: 'Earnings',
      path: '/earnings',
      icon: DollarSign
    },
    {
      name: 'Reviews',
      path: '/reviews',
      icon: Star
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: User
    }
  ];

  return (
    <>
      {/* Dimmed Overlay Background */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Sliding Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full bg-[#F5F7FB]">
          
          {/* Header Section */}
          <div className="bg-white px-6 py-5 border-b border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Owner Panel</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200 group"
              >
                <X className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-4">
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.path}
                        onClick={onClose}
                        className={`group flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 shadow-sm border-l-4 border-blue-500'
                            : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm'
                        }`}
                      >
                        <Icon className={`h-5 w-5 transition-colors duration-200 ${
                          isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                        }`} />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
          
          {/* Footer Section */}
          <div className="bg-white border-t border-gray-100 px-6 py-4">
            <div className="text-center">
              <p className="text-xs text-gray-500 font-medium">
                Manage your car rental business
              </p>
              <div className="mt-2 flex justify-center">
                <div className="w-8 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
};

export default OwnerPanelModal;