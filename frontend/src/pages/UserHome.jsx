import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Filter, TrendingUp, Clock, Car } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCars } from '../hooks';
import { CarCard, LoadingSpinner, EmptyState, Button, Input } from '../components/UI';
import { POPULAR_CITIES, ROUTES } from '../constants';
import { buildSearchParams } from '../utils';
import CityCard from '../components/common/CityCard';
import BookingModal from '../components/common/BookingModal';

const UserHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cars, loading } = useCars({ limit: 12 });
  const [searchQuery, setSearchQuery] = useState({
    city: '',
    startDate: '',
    endDate: ''
  });
  const [selectedCar, setSelectedCar] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleQuickSearch = (e) => {
    e.preventDefault();
    const params = buildSearchParams(searchQuery);
    navigate(`/search?${params}`);
  };

  const handleCityClick = (city) => {
    const params = buildSearchParams({ city });
    navigate(`/search?${params}`);
  };

  const updateSearchQuery = (field, value) => {
    setSearchQuery(prev => ({ ...prev, [field]: value }));
  };

  const handleBookClick = (car) => {
    setSelectedCar(car);
    setShowBookingModal(true);
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedCar(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Ready for your next adventure? Find the perfect car for your journey.
            </p>

            {/* Quick Search Bar */}
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleQuickSearch} className="bg-white rounded-lg shadow-lg p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
                  <Input
                    icon={MapPin}
                    label="City"
                    placeholder="Enter city"
                    value={searchQuery.city}
                    onChange={(e) => updateSearchQuery('city', e.target.value)}
                    className="md:col-span-1"
                  />
                  <Input
                    icon={Calendar}
                    label="Start Date"
                    type="date"
                    value={searchQuery.startDate}
                    onChange={(e) => updateSearchQuery('startDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <Input
                    icon={Calendar}
                    label="End Date"
                    type="date"
                    value={searchQuery.endDate}
                    onChange={(e) => updateSearchQuery('endDate', e.target.value)}
                    min={searchQuery.startDate || new Date().toISOString().split('T')[0]}
                  />
                  <div className="flex items-end">
                    <Button type="submit" className="w-full flex items-center justify-center h-12">
                      <Search className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                      <span className="hidden sm:inline">Search</span>
                      <span className="sm:hidden">Go</span>
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Popular Cities */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Popular Cities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {POPULAR_CITIES.slice(0, 6).map((city) => (
              <CityCard
                key={city}
                city={city}
                onClick={handleCityClick}
              />
            ))}
          </div>
        </section>

        {/* Available Cars */}
        <section className="mb-8 md:mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Available Cars</h2>
              <p className="text-gray-600 text-sm md:text-base">Choose from our wide selection of vehicles</p>
            </div>
            <Link to="/search">
              <Button variant="outline" className="w-full sm:w-auto flex items-center justify-center">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Search
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8 md:py-12">
              <LoadingSpinner size="lg" className="mx-auto" />
              <p className="text-gray-600 mt-4 text-sm md:text-base">Loading cars...</p>
            </div>
          ) : cars.length === 0 ? (
            <EmptyState
              icon={Car}
              title="No cars available"
              description="We're working to add more cars to your area."
              action={
                <Link to="/search">
                  <Button>Browse All Cars</Button>
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {cars.map((car) => (
                <CarCard key={car._id} car={car} onBookClick={handleBookClick} />
              ))}
            </div>
          )}
        </section>

        {/* Stats Section */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
            <div className="group">
              <div className="flex items-center justify-center mb-3 md:mb-4">
                <div className="p-2 md:p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                  <Car className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">500+</h3>
              <p className="text-gray-600 text-sm md:text-base">Cars Available</p>
            </div>
            <div className="group">
              <div className="flex items-center justify-center mb-3 md:mb-4">
                <div className="p-2 md:p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                  <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">10K+</h3>
              <p className="text-gray-600 text-sm md:text-base">Happy Customers</p>
            </div>
            <div className="group">
              <div className="flex items-center justify-center mb-3 md:mb-4">
                <div className="p-2 md:p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                  <Clock className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">24/7</h3>
              <p className="text-gray-600 text-sm md:text-base">Customer Support</p>
            </div>
          </div>
        </section>
      </div>

      {selectedCar && (
        <BookingModal 
          car={selectedCar}
          isOpen={showBookingModal}
          onClose={closeBookingModal}
        />
      )}
    </div>
  );
};

export default UserHome;