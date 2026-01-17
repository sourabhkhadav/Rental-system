import React from 'react';
import { MapPin } from 'lucide-react';

const CityCard = ({ city, onClick, className = '' }) => {
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
      className={`card card-hover text-center group ${className}`}
    >
      <div className="flex flex-col items-center space-y-3">
        <div className="text-3xl group-hover:scale-110 transition-transform duration-200">
          {cityIcons[city] || <MapPin className="h-8 w-8 text-primary-500" />}
        </div>
        <div className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
          {city}
        </div>
      </div>
    </button>
  );
};

export default CityCard;