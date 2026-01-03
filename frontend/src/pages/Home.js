import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Shield, Clock, Star, Users, Fuel, Settings, MapPin, Car, ArrowRight, CheckCircle } from 'lucide-react';
import { DEFAULT_CAR_IMAGE } from '../hooks';

const Home = () => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState({
    city: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    setTimeout(() => {
      setFeaturedCars([
        {
          _id: '1',
          name: 'Swift Dzire',
          brand: 'Maruti Suzuki',
          fuelType: 'petrol',
          seats: 5,
          transmission: 'manual',
          pricePerDay: 1200,
          pickupLocation: { city: 'Mumbai' },
          rating: 4.5,
          images: [DEFAULT_CAR_IMAGE]
        },
        {
          _id: '2',
          name: 'Honda City',
          brand: 'Honda',
          fuelType: 'petrol',
          seats: 5,
          transmission: 'automatic',
          pricePerDay: 1800,
          pickupLocation: { city: 'Mumbai' },
          rating: 4.8,
          images: [DEFAULT_CAR_IMAGE]
        },
        {
          _id: '3',
          name: 'Hyundai Creta',
          brand: 'Hyundai',
          fuelType: 'diesel',
          seats: 5,
          transmission: 'automatic',
          pricePerDay: 2500,
          pickupLocation: { city: 'Delhi' },
          rating: 4.7,
          images: [DEFAULT_CAR_IMAGE]
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchData.city) params.append('city', searchData.city);
    if (searchData.startDate) params.append('startDate', searchData.startDate);
    if (searchData.endDate) params.append('endDate', searchData.endDate);
    window.location.href = `/search?${params.toString()}`;
  };

  const popularCities = [
    { name: 'Mumbai', icon: '🏙️' },
    { name: 'Delhi', icon: '🏛️' },
    { name: 'Bangalore', icon: '🌆' },
    { name: 'Chennai', icon: '🏖️' },
    { name: 'Hyderabad', icon: '🏰' },
    { name: 'Pune', icon: '🎓' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-indigo-700 text-white min-h-screen flex items-center">
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Star className="h-4 w-4 mr-2 text-yellow-400" />
                <span className="text-sm font-medium">India's #1 Car Rental Platform</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Rent Cars
                <span className="block text-yellow-400">Anywhere</span>
              </h1>
              
              <p className="text-xl text-blue-100 mb-8 max-w-lg">
                Experience premium mobility with our trusted car rental platform. 
                Safe, Smart, Seamless.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link 
                  to="/search" 
                  className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-300 transition-colors flex items-center justify-center"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Find Your Car
                </Link>
                <Link 
                  to="/register" 
                  className="border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors flex items-center justify-center"
                >
                  <Car className="h-5 w-5 mr-2" />
                  List Your Car
                </Link>
              </div>
              
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-yellow-400">10K+</div>
                  <div className="text-blue-200 text-sm">Happy Customers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">500+</div>
                  <div className="text-blue-200 text-sm">Premium Cars</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">50+</div>
                  <div className="text-blue-200 text-sm">Cities</div>
                </div>
              </div>
            </div>
            
            {/* Right Search Form */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Book Your Ride
                  </h3>
                  <p className="text-gray-600">Start your journey in seconds</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <MapPin className="h-4 w-4 inline mr-1 text-blue-600" />
                      Pickup City
                    </label>
                    <input
                      type="text"
                      placeholder="Enter city name"
                      value={searchData.city}
                      onChange={(e) => setSearchData({...searchData, city: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={searchData.startDate}
                        onChange={(e) => setSearchData({...searchData, startDate: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={searchData.endDate}
                        onChange={(e) => setSearchData({...searchData, endDate: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-gray-900"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSearch}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center justify-center"
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
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular <span className="text-blue-600">Destinations</span>
            </h2>
            <p className="text-lg text-gray-600">Choose from our top destinations</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {popularCities.map((city) => (
              <button
                key={city.name}
                onClick={() => setSearchData({...searchData, city: city.name})}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center border hover:border-blue-200"
              >
                <div className="text-3xl mb-3">{city.icon}</div>
                <div className="font-semibold text-gray-900">{city.name}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured <span className="text-orange-500">Vehicles</span>
            </h2>
            <p className="text-lg text-gray-600">
              Handpicked premium vehicles from verified owners
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-10 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCars.map((car) => (
                <div key={car._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                  <div className="relative">
                    {car.images && car.images.length > 0 ? (
                      <img
                        src={car.images[0]}
                        alt={car.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <Car className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-semibold">{car.rating || 'New'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{car.name}</h3>
                      <p className="text-gray-600">{car.brand}</p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <Users className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                        <span className="text-xs font-medium text-gray-700">{car.seats} seats</span>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <Fuel className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                        <span className="text-xs font-medium text-gray-700 capitalize">{car.fuelType}</span>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <Settings className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                        <span className="text-xs font-medium text-gray-700 capitalize">{car.transmission}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{car.pickupLocation.city}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">₹{car.pricePerDay}</div>
                        <div className="text-xs text-gray-500">per day</div>
                      </div>
                    </div>
                    
                    <Link 
                      to={`/car/${car._id}`} 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors text-center block flex items-center justify-center"
                    >
                      View Details
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link 
              to="/search" 
              className="inline-flex items-center bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              <Search className="h-5 w-5 mr-2" />
              Explore All Cars
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-blue-600">Us</span>
            </h2>
            <p className="text-lg text-gray-600">
              Experience the difference with our premium service
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-xl hover:bg-blue-50 transition-colors">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Smart Search</h3>
              <p className="text-gray-600">Find the perfect car with our intelligent search system</p>
            </div>

            <div className="text-center p-6 rounded-xl hover:bg-green-50 transition-colors">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">100% Verified</h3>
              <p className="text-gray-600">Every car and owner is thoroughly verified for safety</p>
            </div>

            <div className="text-center p-6 rounded-xl hover:bg-purple-50 transition-colors">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock customer support and assistance</p>
            </div>

            <div className="text-center p-6 rounded-xl hover:bg-yellow-50 transition-colors">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Top Rated</h3>
              <p className="text-gray-600">Highly rated by thousands of satisfied customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of happy customers and experience premium car rental
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-300 transition-colors flex items-center justify-center"
            >
              Get Started Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
            <Link 
              to="/search" 
              className="border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              <Search className="h-5 w-5 mr-2" />
              Browse Cars
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;