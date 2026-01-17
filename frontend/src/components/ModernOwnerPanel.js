import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import OwnerPanelRouter from './OwnerPanelRouter';
import { 
  X, 
  LayoutDashboard, 
  Car, 
  Plus, 
  Calendar, 
  DollarSign, 
  User, 
  Star,
  ArrowLeft
} from 'lucide-react';

const ModernOwnerPanel = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    // Hide sidebar when navigating to a page (except dashboard)
    if (location.pathname !== '/dashboard' && isOpen) {
      setSidebarVisible(false);
    } else if (location.pathname === '/dashboard' && isOpen) {
      setSidebarVisible(true);
    }
  }, [location.pathname, isOpen]);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/add-car': return 'Add New Car';
      case '/my-cars': return 'My Cars';
      case '/bookings': return 'Bookings';
      case '/earnings': return 'Earnings';
      case '/reviews': return 'Reviews';
      case '/profile': return 'Profile';
      default: return '';
    }
  };

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

  const handleNavigation = (path) => {
    navigate(path);
    if (path !== '/dashboard') {
      setSidebarVisible(false);
    }
  };

  const handleBackToPanel = () => {
    setSidebarVisible(true);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Main Panel Container */}
      <div className={`fixed inset-0 z-50 flex transition-all duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Sidebar */}
        <div className={`bg-white shadow-2xl transition-all duration-300 ease-out ${
          sidebarVisible ? 'w-80 opacity-100' : 'w-0 opacity-0 overflow-hidden'
        }`}>
          <div className="flex flex-col h-full">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-5 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Owner Panel</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/80 rounded-xl transition-all duration-200 group"
                >
                  <X className="h-5 w-5 text-slate-500 group-hover:text-slate-700" />
                </button>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6">
              <nav className="px-4">
                <ul className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <li key={item.name}>
                        <button
                          onClick={() => handleNavigation(item.path)}
                          className={`w-full group flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-200'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <Icon className={`h-5 w-5 transition-colors duration-200 ${
                            isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                          }`} />
                          <span>{item.name}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
            
            {/* Footer */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4">
              <p className="text-xs text-slate-500 text-center">
                Manage your car rental business
              </p>
            </div>
            
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 bg-white transition-all duration-300">
          
          {/* Back Button Header (shown when sidebar is hidden) */}
          {!sidebarVisible && (
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToPanel}
                  className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="text-sm font-medium">Back to Panel</span>
                </button>
                {getPageTitle() && (
                  <>
                    <div className="w-px h-6 bg-slate-300"></div>
                    <h1 className="text-lg font-semibold text-slate-800">{getPageTitle()}</h1>
                  </>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
          )}
          
          {/* Page Content */}
          <div className={`h-full overflow-y-auto ${!sidebarVisible ? 'pt-0' : 'pt-0'}`}>
            <OwnerPanelRouter />
          </div>
          
        </div>
        
      </div>
    </>
  );
};

export default ModernOwnerPanel;