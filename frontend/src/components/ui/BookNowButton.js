import React from 'react';
import { ArrowRight, IndianRupee } from 'lucide-react';

const BookNowButton = ({ 
  onClick, 
  loading = false, 
  disabled = false,
  className = '',
  showIcon = true,
  children = 'Book Now',
  ...props 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          <span>Processing...</span>
        </>
      ) : (
        <>
          {showIcon && <IndianRupee className="h-6 w-6" />}
          <span>{children}</span>
          {showIcon && <ArrowRight className="h-5 w-5" />}
        </>
      )}
    </button>
  );
};

export default BookNowButton;
