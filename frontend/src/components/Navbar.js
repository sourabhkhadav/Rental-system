import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, Menu, X, User, LogOut } from 'lucide-react';
import OwnerPanelModal from './OwnerPanelModal';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOwnerPanelOpen, setIsOwnerPanelOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-bold text-gray-900">CarRental</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Only show Search Cars for users and non-authenticated */}
            {(!isAuthenticated || user?.role === 'user') && (
              <Link to="/search" className="text-gray-700 hover:text-primary-500">
                Search Cars
              </Link>
            )}
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary-500">
                  Dashboard
                </Link>
                
                {/* Owner Panel Button */}
                {user?.role === 'owner' && (
                  <button
                    onClick={() => {
                      console.log('Owner Panel button clicked');
                      setIsOwnerPanelOpen(true);
                    }}
                    className="text-gray-700 hover:text-primary-500"
                  >
                    Owner Panel
                  </button>
                )}
                
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-gray-700 hover:text-primary-500">
                    Admin Panel
                  </Link>
                )}
                
                <div className="flex items-center space-x-4">
                  <Link to="/profile" className="text-gray-700 hover:text-primary-500">
                    Profile
                  </Link>
                  <span className="text-gray-700">
                    Hi, {user?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-700 hover:text-primary-500"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-primary-500">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-500"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {/* Only show Search Cars for users and non-authenticated */}
              {(!isAuthenticated || user?.role === 'user') && (
                <Link
                  to="/search"
                  className="block px-3 py-2 text-gray-700 hover:text-primary-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Search Cars
                </Link>
              )}
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-gray-700 hover:text-primary-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  
                  {/* Owner Panel Button */}
                  {user?.role === 'owner' && (
                    <button
                      onClick={() => {
                        setIsOwnerPanelOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="block px-3 py-2 text-gray-700 hover:text-primary-500"
                    >
                      Owner Panel
                    </button>
                  )}
                  
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 text-gray-700 hover:text-primary-500"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-gray-700 hover:text-primary-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary-500"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-gray-700 hover:text-primary-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-gray-700 hover:text-primary-500"
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
      
      {/* Owner Panel Modal */}
      <OwnerPanelModal 
        isOpen={isOwnerPanelOpen} 
        onClose={() => setIsOwnerPanelOpen(false)} 
      />
    </nav>
  );
};

export default Navbar;