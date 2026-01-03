import React from 'react';

const Card = ({ 
  children, 
  variant = 'default', 
  className = '', 
  padding = 'default',
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-lg border transition-shadow';
  
  const variants = {
    default: 'border-gray-200 shadow-sm hover:shadow-md',
    elevated: 'border-gray-200 shadow-md hover:shadow-lg',
    outlined: 'border-gray-300 shadow-none hover:shadow-sm',
    ghost: 'border-transparent shadow-none hover:bg-gray-50'
  };
  
  const paddings = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8'
  };
  
  return (
    <div
      className={`${baseClasses} ${variants[variant]} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;