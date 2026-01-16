import React from 'react';

const Input = ({ 
  label, 
  icon: Icon, 
  error, 
  className = '', 
  containerClassName = '',
  ...props 
}) => {
  return (
    <div className={`${containerClassName}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-600" />
        )}
        <input
          className={`input-field ${Icon ? 'pl-10' : ''} ${
            error ? 'border-red-300 focus:ring-red-500' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;