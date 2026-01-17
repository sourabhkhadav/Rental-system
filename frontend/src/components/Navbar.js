import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import ModernOwnerPanel from './ModernOwnerPanel';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOwnerPanelOpen, setIsOwnerPanelOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/dashboard');
    setIsProfileDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                <Car className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-slate-800">CarRental</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Only show Search Cars for users and non-authenticated */}
            {(!isAuthenticated || user?.role === 'user') && (
              <Link 
                to="/search" 
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                Search Cars
              </Link>
            )}
            
            {isAuthenticated ? (
              <>
                {/* Dashboard Link */}
                <Link 
                  to="/dashboard" 
                  className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                
                {/* Owner Panel Button */}
                {user?.role === 'owner' && (
                  <button
                    onClick={() => setIsOwnerPanelOpen(true)}
                    className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
                  >
                    Owner Panel
                  </button>
                )}
                
                {/* Admin Panel */}
                {user?.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
                  >
                    Admin Panel
                  </Link>
                )}
                
                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    {user?.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt={user?.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {getInitials(user?.name)}
                      </div>
                    )}
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                      isProfileDropdownOpen ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 animate-in slide-in-from-top-2 duration-200">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="font-medium">My Profile</span>
                      </Link>
                      <hr className="my-2 border-slate-100" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4 text-slate-400" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4">
            <div className="space-y-2">
              {(!isAuthenticated || user?.role === 'user') && (
                <Link
                  to="/search"
                  className="block px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Search Cars
                </Link>
              )}
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  
                  {user?.role === 'owner' && (
                    <button
                      onClick={() => {
                        setIsOwnerPanelOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      Owner Panel
                    </button>
                  )}
                  
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  
                  <hr className="my-2 border-slate-200" />
                  
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Modern Owner Panel */}
      <ModernOwnerPanel 
        isOpen={isOwnerPanelOpen} 
        onClose={() => setIsOwnerPanelOpen(false)}
      />
    </nav>
  );
};

export default Navbar;