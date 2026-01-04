import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, MapPin, Users, Fuel, Settings, Car, Star } from 'lucide-react';

const CarSearch = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    city: '',
    startDate: '',
    endDate: '',
    minPrice: '',
    maxPrice: '',
    seats: '',
    fuelType: '',
    transmission: ''
  });

  useEffect(() => {
    searchCars();
  }, []);

  const searchCars = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      
      const response = await axios.get('/api/cars');
      setCars(response.data.cars);
    } catch (error) {
      console.error('Error searching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchCars();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Perfect Car</h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="card">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="Enter city"
                  className="input-field"
                  value={filters.city}
                  onChange={handleFilterChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  className="input-field"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  className="input-field"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
                <select
                  name="seats"
                  className="input-field"
                  value={filters.seats}
                  onChange={handleFilterChange}
                >
                  <option value="">Any</option>
                  <option value="4">4 Seater</option>
                  <option value="5">5 Seater</option>
                  <option value="7">7 Seater</option>
                  <option value="8">8+ Seater</option>
                </select>
              </div>
            </div>
            
            {/* Additional Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (₹/day)</label>
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min price"
                  className="input-field"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (₹/day)</label>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max price"
                  className="input-field"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                <select
                  name="fuelType"
                  className="input-field"
                  value={filters.fuelType}
                  onChange={handleFilterChange}
                >
                  <option value="">Any</option>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="cng">CNG</option>
                  <option value="electric">Electric</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                <select
                  name="transmission"
                  className="input-field"
                  value={filters.transmission}
                  onChange={handleFilterChange}
                >
                  <option value="">Any</option>
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatic</option>
                </select>
              </div>
            </div>
            
            <button type="submit" className="btn-primary flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Search Cars</span>
            </button>
          </form>
        </div>

        {/* Results */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {loading ? 'Searching...' : `${cars.length} cars found`}
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            </div>
          ) : cars.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No cars found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <div key={car._id} className="card hover:shadow-lg transition-shadow">
                  <div className="aspect-w-16 aspect-h-9 mb-4">
                    {car.images && car.images.length > 0 ? (
                      <img
                        src={car.images[0]}
                        alt={car.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Car className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{car.name}</h3>
                      <p className="text-gray-600">{car.brand}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{car.seats} seats</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Fuel className="h-4 w-4" />
                        <span>{car.fuelType}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Settings className="h-4 w-4" />
                        <span>{car.transmission}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{car.pickupLocation.city}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-primary-600">₹{car.pricePerDay}</span>
                        <span className="text-gray-600">/day</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{car.rating || 'New'}</span>
                      </div>
                    </div>
                    
                    <button className="w-full btn-primary">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarSearch;