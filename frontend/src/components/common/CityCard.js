import React from 'react';
import { MapPin } from 'lucide-react';

const CityCard = ({ city, onClick, className = '' }) => {
  // City icons mapping
  const cityIcons = {
    'Mumbai': '🏙️',
    'Delhi': '🏛️', 
    'Bangalore': '🌆',
    'Chennai': '🏖️',
    'Hyderabad': '🏰',
    'Pune': '🎓',
    'Kolkata': '🌉',
    'Ahmedabad': '🕌'
  };

  return (
    <button
      onClick={() => onClick && onClick(city)}
      className={`bg-white p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-center border border-gray-100 hover:border-blue-200 group ${className}`}
    >
      <div className="flex flex-col items-center space-y-2 md:space-y-3">
        <div className="text-2xl md:text-3xl mb-1 group-hover:scale-110 transition-transform duration-200">
          {cityIcons[city] || <MapPin className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />}
        </div>
        <div className="font-semibold text-gray-900 text-sm md:text-base group-hover:text-blue-600 transition-colors">
          {city}
        </div>
      </div>
    </button>
  );
};

export default CityCard;