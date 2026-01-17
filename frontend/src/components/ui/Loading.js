import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ 
  variant = 'spinner', 
  size = 'md', 
  text = '', 
  className = '',
  fullScreen = false 
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };
  
  const Spinner = () => (
    <Loader2 className={`animate-spin text-blue-600 ${sizes[size]}`} />
  );
  
  const Dots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`bg-blue-600 rounded-full animate-pulse ${
            size === 'sm' ? 'h-2 w-2' : size === 'lg' ? 'h-4 w-4' : 'h-3 w-3'
          }`}
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
  
  const Skeleton = () => (
    <div className="animate-pulse space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  );
  
  const renderVariant = () => {
    switch (variant) {
      case 'dots': return <Dots />;
      case 'skeleton': return <Skeleton />;
      default: return <Spinner />;
    }
  };
  
  const content = (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      {renderVariant()}
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }
  
  return content;
};

export default Loading;