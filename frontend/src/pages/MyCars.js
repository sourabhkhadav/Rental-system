import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Car, Plus, Edit, Eye, Trash2, Star } from 'lucide-react';

const MyCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axios.get('/api/cars/my-cars');
      setCars(response.data.cars);
    } catch (error) {
      console.error('Error fetching cars:', error);
      // Dummy data
      setCars([
        {
          _id: '1',
          name: 'Swift Dzire',
          brand: 'Maruti',
          model: 'VXI',
          year: 2022,
          numberPlate: 'MH12AB1234',
          fuelType: 'petrol',
          seats: 5,
          transmission: 'manual',
          pricePerDay: 1200,
          status: 'approved',
          rating: 4.5,
          totalRatings: 23,
          images: ['https://via.placeholder.com/300x200?text=Swift+Dzire']
        },
        {
          _id: '2',
          name: 'Honda City',
          brand: 'Honda',
          model: 'VX',
          year: 2021,
          numberPlate: 'MH14CD5678',
          fuelType: 'petrol',
          seats: 5,
          transmission: 'automatic',
          pricePerDay: 1800,
          status: 'pending',
          rating: 4.2,
          totalRatings: 15,
          images: ['https://via.placeholder.com/300x200?text=Honda+City']
        },
        {
          _id: '3',
          name: 'Hyundai Creta',
          brand: 'Hyundai',
          model: 'SX',
          year: 2023,
          numberPlate: 'MH01EF9012',
          fuelType: 'diesel',
          seats: 5,
          transmission: 'automatic',
          pricePerDay: 2500,
          status: 'approved',
          rating: 4.7,
          totalRatings: 31,
          images: ['https://via.placeholder.com/300x200?text=Hyundai+Creta']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      blocked: 'bg-gray-100 text-gray-800',
      inactive: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="text-center py-8">Loading your cars...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Cars</h1>
          <p className="text-gray-600">Manage your car listings</p>
        </div>
        <Link
          to="/add-car"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Car
        </Link>
      </div>

      {cars.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No cars listed yet</h3>
          <p className="text-gray-600 mb-4">Start earning by adding your first car</p>
          <Link
            to="/add-car"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Car
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div key={car._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={car.images[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt={car.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{car.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(car.status)}`}>
                    {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                  </span>
                </div>
                
                <div className="space-y-1 text-sm text-gray-600 mb-3">
                  <p>{car.brand} {car.model} ({car.year})</p>
                  <p>{car.numberPlate} • {car.seats} seats • {car.fuelType}</p>
                  <p className="capitalize">{car.transmission} transmission</p>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-green-600">₹{car.pricePerDay}/day</span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    {car.rating.toFixed(1)} ({car.totalRatings})
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                    <Edit className="h-3 w-3 inline mr-1" />
                    Edit
                  </button>
                  <button className="flex-1 px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors">
                    <Eye className="h-3 w-3 inline mr-1" />
                    View
                  </button>
                  <button className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCars;