import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, Fuel, Settings, MapPin, Car } from 'lucide-react';
import { formatPrice, capitalizeFirst } from '../utils';
import { ROUTES } from '../constants';

// Loading Spinner Component
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`animate-spin rounded-full border-b-2 border-blue-500 ${sizeClasses[size]} ${className}`} />
  );
};

// Button Component
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const classes = `
    ${baseClasses} 
    ${variants[variant]} 
    ${sizes[size]} 
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} 
    ${className}
  `.trim();

  return (
    <button 
      className={classes} 
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <LoadingSpinner size="sm" className="mr-2" />
          Loading...
        </div>
      ) : children}
    </button>
  );
};

// Input Component
export const Input = ({ 
  label, 
  error, 
  icon: Icon, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {Icon && <Icon className="h-4 w-4 inline mr-1" />}
          {label}
        </label>
      )}
      <input
        className={`
          w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500
          ${error ? 'border-red-300' : 'border-gray-300'}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

// Select Component
export const Select = ({ 
  label, 
  options = [], 
  error, 
  icon: Icon, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {Icon && <Icon className="h-4 w-4 inline mr-1" />}
          {label}
        </label>
      )}
      <select
        className={`
          w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${error ? 'border-red-300' : 'border-gray-300'}
        `}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

// Card Component
export const Card = ({ children, className = '', hover = false }) => {
  return (
    <div className={`
      bg-white rounded-lg shadow-sm border border-gray-200 
      ${hover ? 'hover:shadow-lg transition-shadow' : ''} 
      ${className}
    `}>
      {children}
    </div>
  );
};

// Status Badge Component
export const StatusBadge = ({ status, className = '' }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`
      px-3 py-1 rounded-full text-xs font-medium 
      ${statusColors[status] || 'bg-gray-100 text-gray-800'} 
      ${className}
    `}>
      {capitalizeFirst(status)}
    </span>
  );
};

// Car Card Component
export const CarCard = ({ car, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden ${className}`}>
      <div className="relative">
        {car.images && car.images[0] ? (
          <img
            src={car.images[0]}
            alt={car.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <Car className="h-16 w-16 text-gray-400" />
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-semibold">{car.rating || 'New'}</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{car.name}</h3>
          <p className="text-gray-600">{car.brand}</p>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <Users className="h-5 w-5 text-gray-400 mx-auto mb-1" />
            <span className="text-xs font-medium text-gray-700">{car.seats} seats</span>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <Fuel className="h-5 w-5 text-gray-400 mx-auto mb-1" />
            <span className="text-xs font-medium text-gray-700 capitalize">{car.fuelType}</span>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <Settings className="h-5 w-5 text-gray-400 mx-auto mb-1" />
            <span className="text-xs font-medium text-gray-700 capitalize">{car.transmission}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{car.pickupLocation?.city}</span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">₹{car.pricePerDay}</div>
            <div className="text-xs text-gray-500">per day</div>
          </div>
        </div>
        
        <Link 
          to={`/car/${car._id}`} 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors text-center block flex items-center justify-center"
        >
          View Details
          <span className="h-4 w-4 ml-2">→</span>
        </Link>
      </div>
    </div>
  );
};

// Empty State Component
export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  className = '' 
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      {Icon && <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      {action}
    </div>
  );
};