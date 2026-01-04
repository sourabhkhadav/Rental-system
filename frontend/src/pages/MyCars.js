import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Car, Plus, Edit, Eye, Trash2, Star, ArrowLeft } from 'lucide-react';

const MyCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setError(null);
      console.log('Fetching cars...');
      const response = await axios.get('/api/cars/my-cars');
      console.log('Cars response:', response.data);
      setCars(response.data.cars || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
      console.error('Error response:', error.response?.data);
      setCars([]);
      setError(error.response?.data?.message || 'Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (carId) => {
    // For now show alert - edit functionality can be implemented later
    alert(`Edit car functionality coming soon! Car ID: ${carId}`);
  };

  const handleView = (carId) => {
    // Navigate to car details page using React Router
    navigate(`/car/${carId}`);
  };

  const handleDelete = async (carId) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        console.log('Deleting car:', carId);
        const response = await axios.delete(`/api/cars/${carId}`);
        console.log('Delete response:', response.data);
        
        if (response.data.success) {
          setCars(cars.filter(car => car._id !== carId));
          alert('Car deleted successfully!');
        } else {
          alert(response.data.message || 'Failed to delete car');
        }
      } catch (error) {
        console.error('Error deleting car:', error);
        alert(error.response?.data?.message || 'Failed to delete car. Please try again.');
      }
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
    <div className="min-h-screen bg-[#F7F7FB]">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Cars</h1>
            <p className="text-gray-600 mt-1">Manage your car listings</p>
          </div>
          <Link
            to="/add-car"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Car
          </Link>
        </div>

        {cars.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No cars listed yet</h3>
            <p className="text-gray-600 mb-6">Start earning by adding your first car</p>
            <Link
              to="/add-car"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Car
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {cars.map((car) => (
              <div key={car._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Car Image */}
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={car.images[0] || 'https://via.placeholder.com/400x200?text=No+Image'}
                    alt={car.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(car.status)}`}>
                      {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                {/* Car Details */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{car.name}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="font-medium">{car.brand} {car.model} ({car.year})</p>
                      <p>{car.numberPlate} • {car.seats} seats • {car.fuelType}</p>
                      <p className="capitalize">{car.transmission} transmission</p>
                    </div>
                  </div>
                  
                  {/* Price and Rating */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-2xl font-bold text-green-600">₹{car.pricePerDay}/day</div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{car.rating.toFixed(1)}</span>
                      <span className="text-sm text-gray-500">({car.totalRatings})</span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => handleEdit(car._id)}
                      className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleView(car._id)}
                      className="flex items-center justify-center px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </button>
                    <button 
                      onClick={() => handleDelete(car._id)}
                      className="flex items-center justify-center px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCars;