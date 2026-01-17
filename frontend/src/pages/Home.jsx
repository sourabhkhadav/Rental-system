import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Shield, Clock, Star, Users, Fuel, Settings, MapPin, Car, ArrowRight } from 'lucide-react';
import { carService } from '../services/api';
import { DEFAULT_CAR_IMAGE } from '../hooks';
import { POPULAR_CITIES } from '../constants';
import CityCard from '../components/common/CityCard';
import BookingModal from '../components/common/BookingModal';
import { useAuth } from '../context/AuthContext';
import BookNowButton from '../components/ui/BookNowButton';

// Components
const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[1, 2, 3].map((i) => (
      <div key={i} className="car-card">
        <div className="h-48 skeleton" />
        <div className="p-6 space-y-4">
          <div className="h-6 skeleton w-3/4" />
          <div className="h-4 skeleton w-1/2" />
          <div className="h-10 skeleton" />
        </div>
      </div>
    ))}
  </div>
);

const CarCard = ({ car, onBookClick }) => (
  <div className="car-card group">
    <div className="relative overflow-hidden">
      {car.images && car.images.length > 0 ? (
        <img
          src={car.images[0]}
          alt={car.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = DEFAULT_CAR_IMAGE;
          }}
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
          <Car className="h-16 w-16 text-gray-400" />
        </div>
      )}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-500 fill-current" />
          <span className="text-sm font-semibold text-gray-900">{car.rating || 'New'}</span>
        </div>
      </div>
    </div>
    
    <div className="p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{car.name}</h3>
        <p className="text-gray-500 font-medium">{car.brand}</p>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-card">
          <Users className="h-5 w-5 text-gray-400 mx-auto mb-1" />
          <span className="text-xs font-medium text-gray-600">{car.seats} seats</span>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-card">
          <Fuel className="h-5 w-5 text-gray-400 mx-auto mb-1" />
          <span className="text-xs font-medium text-gray-600 capitalize">{car.fuelType}</span>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-card">
          <Settings className="h-5 w-5 text-gray-400 mx-auto mb-1" />
          <span className="text-xs font-medium text-gray-600 capitalize">{car.transmission}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{car.pickupLocation?.city || 'N/A'}</span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600">₹{car.pricePerDay}</div>
          <div className="text-xs text-gray-400">per day</div>
        </div>
      </div>
      
      <BookNowButton 
        onClick={() => onBookClick(car)}
        className="py-3 text-base"
      >
        Book Now
      </BookNowButton>
    </div>
  </div>
);

const Home = () => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchData, setSearchData] = useState({
    city: '',
    startDate: '',
    endDate: ''
  });
  const [selectedCar, setSelectedCar] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await carService.getAllCars({ limit: 6 });
        
        if (response.success && Array.isArray(response.cars)) {
          const carsWithImages = response.cars.map(car => ({
            ...car,
            images: car.images && car.images.length > 0 ? car.images : [DEFAULT_CAR_IMAGE]
          }));
          setFeaturedCars(carsWithImages);
        } else {
          setFeaturedCars([]);
        }
      } catch (error) {
        console.error('Error fetching featured cars:', error);
        setFeaturedCars([]);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCars();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchData.city) params.append('city', searchData.city);
    if (searchData.startDate) params.append('startDate', searchData.startDate);
    if (searchData.endDate) params.append('endDate', searchData.endDate);
    navigate(`/search${params.toString() ? '?' + params.toString() : ''}`);
  };

  const handleCityClick = (city) => {
    navigate(`/search?city=${city}`);
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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white min-h-screen flex items-center">
        <div className="absolute inset-0 bg-black/5"></div>
        
        <div className="relative max-w-6xl mx-auto px-6 md:px-12 lg:px-16 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
                <Star className="h-4 w-4 mr-2 text-yellow-400" />
                <span className="text-sm font-medium">India's #1 Car Rental Platform</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                Rent Cars
                <span className="block text-yellow-400">Anywhere</span>
              </h1>
              
              <p className="text-xl text-blue-100 mb-10 max-w-lg leading-relaxed">
                Experience premium mobility with our trusted car rental platform. 
                Safe, Smart, Seamless.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link 
                  to="/search" 
                  className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-8 py-4 rounded-card font-semibold transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Find Your Car
                </Link>
                <Link 
                  to="/register" 
                  className="border-2 border-white/30 hover:border-white/50 text-white px-8 py-4 rounded-card font-semibold hover:bg-white/10 transition-all duration-200 flex items-center justify-center"
                >
                  <Car className="h-5 w-5 mr-2" />
                  List Your Car
                </Link>
              </div>
              
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-yellow-400 mb-1">10K+</div>
                  <div className="text-blue-200 text-sm">Happy Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-400 mb-1">500+</div>
                  <div className="text-blue-200 text-sm">Premium Cars</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-400 mb-1">50+</div>
                  <div className="text-blue-200 text-sm">Cities</div>
                </div>
              </div>
            </div>
            
            {/* Right Search Form */}
            <div className="relative">
              <div className="card shadow-2xl border border-white/10">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Book Your Ride
                  </h3>
                  <p className="text-gray-500">Start your journey in seconds</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      <MapPin className="h-4 w-4 inline mr-1 text-primary-600" />
                      Pickup City
                    </label>
                    <input
                      type="text"
                      placeholder="Enter city name"
                      value={searchData.city}
                      onChange={(e) => setSearchData({...searchData, city: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={searchData.startDate}
                        onChange={(e) => setSearchData({...searchData, startDate: e.target.value})}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={searchData.endDate}
                        onChange={(e) => setSearchData({...searchData, endDate: e.target.value})}
                        className="input-field"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSearch}
                    className="btn-primary w-full flex items-center justify-center"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Search Available Cars
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Popular <span className="text-primary-600">Destinations</span>
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">Choose from our top destinations and start your journey</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {POPULAR_CITIES.slice(0, 6).map((city) => (
              <CityCard
                key={city}
                city={city}
                onClick={handleCityClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Featured <span className="text-accent-orange">Vehicles</span>
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Handpicked premium vehicles from verified owners
            </p>
          </div>

          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-lg-card shadow-card p-12 max-w-md mx-auto">
                <Car className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{error}</h3>
                <p className="text-gray-500 mb-8">Check back later for available cars</p>
                <Link 
                  to="/search" 
                  className="btn-primary inline-flex items-center"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search Cars
                </Link>
              </div>
            </div>
          ) : featuredCars.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredCars.map((car) => (
                  <CarCard key={car._id} car={car} onBookClick={handleBookClick} />
                ))}
              </div>
              <div className="text-center mt-16">
                <Link 
                  to="/search" 
                  className="btn-secondary inline-flex items-center"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Explore All Cars
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white rounded-lg-card shadow-card p-12 max-w-md mx-auto">
                <Car className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">No Cars Available</h3>
                <p className="text-gray-500">Be the first to list your car!</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span className="text-primary-600">Us</span>
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Experience the difference with our premium service
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card card-hover text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Smart Search</h3>
              <p className="text-gray-500 leading-relaxed">Find the perfect car with our intelligent search system</p>
            </div>

            <div className="card card-hover text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">100% Verified</h3>
              <p className="text-gray-500 leading-relaxed">Every car and owner is thoroughly verified for safety</p>
            </div>

            <div className="card card-hover text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">24/7 Support</h3>
              <p className="text-gray-500 leading-relaxed">Round-the-clock customer support and assistance</p>
            </div>

            <div className="card card-hover text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Top Rated</h3>
              <p className="text-gray-500 leading-relaxed">Highly rated by thousands of satisfied customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white section-padding">
        <div className="max-w-4xl mx-auto container-padding text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl mb-12 text-blue-100 leading-relaxed">
            Join thousands of happy customers and experience premium car rental
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/register" 
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-8 py-4 rounded-card font-semibold transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
            >
              Get Started Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
            <Link 
              to="/search" 
              className="border-2 border-white/30 hover:border-white/50 text-white px-8 py-4 rounded-card font-semibold hover:bg-white/10 transition-all duration-200 flex items-center justify-center"
            >
              <Search className="h-5 w-5 mr-2" />
              Browse Cars
            </Link>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
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

export default Home;