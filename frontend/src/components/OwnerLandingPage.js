import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Plus, BarChart3, Shield, Clock, Users, Star, CheckCircle, ArrowRight, User } from 'lucide-react';

const OwnerLandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Manage Your Rental Cars 
                <span className="text-blue-600">Easily</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                A smart dashboard built for car owners to manage bookings, earnings, and vehicles — all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link 
                  to="/dashboard"
                  className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Go to Owner Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link 
                  to="/add-car"
                  className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center"
                >
                  Add New Car
                </Link>
              </div>
              <p className="text-sm text-gray-500">Trusted by 500+ vehicle owners</p>
            </div>
            
            {/* Dashboard Preview Card */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-200 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">Dashboard Overview</h3>
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">Total Cars</p>
                      <p className="text-2xl font-bold text-blue-600">12</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">Earnings</p>
                      <p className="text-2xl font-bold text-green-600">₹45K</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Honda City</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Swift Dzire</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Booked</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">About the Owner Platform</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              This platform helps car owners manage cars, documents, bookings, and earnings digitally. 
              Secure, transparent and reliable.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: BarChart3, title: "Easy Dashboard", desc: "Intuitive interface for all operations" },
              { icon: Shield, title: "Secure Payments", desc: "Bank-grade security for transactions" },
              { icon: CheckCircle, title: "Verified Renters", desc: "KYC verified customers only" },
              { icon: Clock, title: "24/7 Support", desc: "Round the clock assistance" }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Owners Love Our Platform</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Real-time Booking Management", desc: "Instant notifications and easy accept/reject" },
              { title: "Transparent Earnings Tracking", desc: "Detailed analytics and payment history" },
              { title: "Smart Pricing & Availability", desc: "Dynamic pricing and calendar management" },
              { title: "Instant Notifications", desc: "Stay updated with all booking activities" },
              { title: "Secure KYC Based Users", desc: "Only verified customers can book" },
              { title: "Zero-Commission Trial", desc: "Start earning without any platform fees" }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works for Owners</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Create Account", desc: "Sign up and verify your identity" },
              { step: "2", title: "List Your Car", desc: "Add car details and documents" },
              { step: "3", title: "Get Booking Requests", desc: "Receive and manage bookings" },
              { step: "4", title: "Earn & Track Payments", desc: "Monitor earnings and payouts" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 bg-gradient-to-br from-blue-50 to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Owners Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Rajesh Kumar", rating: 5, text: "Amazing platform! Easy to manage bookings and track earnings." },
              { name: "Priya Sharma", rating: 5, text: "Professional interface and excellent customer support." },
              { name: "Amit Singh", rating: 5, text: "Increased my car rental income by 40% in just 3 months." }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Start Managing Your Cars Smarter</h2>
          <p className="text-blue-100 mb-8 text-lg">Join hundreds of car owners who trust our platform</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/dashboard"
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Open Dashboard
            </Link>
            <Link 
              to="/support"
              className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Car className="w-8 h-8 text-blue-400" />
                <h3 className="text-2xl font-bold text-white">CarRental</h3>
              </div>
              <p className="text-gray-400">Professional car rental platform for owners</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <div className="space-y-2">
                <Link to="/about" className="block hover:text-white transition-colors">About</Link>
                <Link to="/help" className="block hover:text-white transition-colors">Help</Link>
                <Link to="/support" className="block hover:text-white transition-colors">Support</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <div className="space-y-2">
                <Link to="/terms" className="block hover:text-white transition-colors">Terms</Link>
                <Link to="/privacy" className="block hover:text-white transition-colors">Privacy</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <p className="text-gray-400">support@carrental.com</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">© 2024 CarRental. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OwnerLandingPage;