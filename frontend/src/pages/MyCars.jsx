import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { carService } from '../services/api';
import { DEFAULT_CAR_IMAGE } from '../hooks';
import { Car, Plus, Edit, Eye, Trash2, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const MyCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await carService.getMyCars();
      
      if (response.success && Array.isArray(response.cars)) {
        setCars(response.cars);
      } else {
        setCars([]);
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
      setError('Failed to load your cars');
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCar = async (carId) => {
    setDeleteLoading(carId);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5005/api/cars/${carId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Car deleted successfully');
      setCars(cars.filter(car => car._id !== carId));
      setShowDeleteConfirm(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete car');
    } finally {
      setDeleteLoading(null);
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
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Cars</h1>
            <p className="text-gray-600">Manage your car listings</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-8 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Delete Car</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this car? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => handleDeleteCar(showDeleteConfirm)}
                disabled={deleteLoading === showDeleteConfirm}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {deleteLoading === showDeleteConfirm ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {error ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Car className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{error}</h3>
          <button
            onClick={fetchCars}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : cars.length === 0 ? (
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
                  src={(car.images && car.images[0]) || DEFAULT_CAR_IMAGE}
                  alt={car.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = DEFAULT_CAR_IMAGE;
                  }}
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
                  {car.rating && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      {car.rating.toFixed(1)} ({car.totalRatings || 0})
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                    <Edit className="h-3 w-3 inline mr-1" />
                    Edit
                  </button>
                  <Link
                    to={`/car/${car._id}`}
                    className="flex-1 px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors text-center"
                  >
                    <Eye className="h-3 w-3 inline mr-1" />
                    View
                  </Link>
                  <button 
                    onClick={() => setShowDeleteConfirm(car._id)}
                    className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                  >
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