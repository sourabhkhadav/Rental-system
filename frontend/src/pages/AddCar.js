import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Car, FileText, MapPin, DollarSign, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddCar = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    numberPlate: '',
    fuelType: 'petrol',
    seats: 4,
    transmission: 'manual',
    pricePerDay: '',
    securityDeposit: '',
    maxKmPerDay: 300,
    extraChargePerKm: 10,
    availableFrom: '',
    availableTo: '',
    pickupAddress: '',
    pickupCity: '',
    features: []
  });
  
  const [files, setFiles] = useState({
    rcDocument: null,
    insurance: null,
    pollutionCert: null,
    images: []
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e, type) => {
    if (type === 'images') {
      setFiles({
        ...files,
        images: Array.from(e.target.files)
      });
    } else {
      setFiles({
        ...files,
        [type]: e.target.files[0]
      });
    }
  };

  const handleFeatureToggle = (feature) => {
    const features = formData.features.includes(feature)
      ? formData.features.filter(f => f !== feature)
      : [...formData.features, feature];
    
    setFormData({ ...formData, features });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      
      // Add form data
      Object.keys(formData).forEach(key => {
        if (key === 'features') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      });

      // Add files
      if (files.rcDocument) submitData.append('rcDocument', files.rcDocument);
      if (files.insurance) submitData.append('insurance', files.insurance);
      if (files.pollutionCert) submitData.append('pollutionCert', files.pollutionCert);
      
      files.images.forEach(image => {
        submitData.append('images', image);
      });

      console.log('Submitting car data...');
      const response = await axios.post('/api/cars', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 600000 // 10 minutes
      });

      console.log('Response:', response.data);
      
      if (response.data.success) {
        toast.success(response.data.message || 'Car added successfully!');
        navigate('/dashboard');
      } else {
        toast.error(response.data.message || 'Failed to add car');
      }
    } catch (error) {
      console.error('Submit error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add car';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const carFeatures = [
    'AC', 'GPS', 'Bluetooth', 'USB Charger', 'Music System', 
    'Power Steering', 'Power Windows', 'Central Locking', 'ABS', 'Airbags'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 rounded-t-lg">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
        </div>

        <div className="bg-white rounded-b-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Car className="h-6 w-6 mr-2 text-blue-600" />
              Add New Car
            </h1>
            <p className="text-gray-600 mt-1">Fill in the details to list your car for rental</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Car Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Car className="h-5 w-5 mr-2" />
                Car Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Car Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Swift Dzire"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <select
                    name="brand"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.brand}
                    onChange={handleChange}
                  >
                    <option value="">Select Brand</option>
                    <option value="Maruti">Maruti</option>
                    <option value="Hyundai">Hyundai</option>
                    <option value="Honda">Honda</option>
                    <option value="Toyota">Toyota</option>
                    <option value="Tata">Tata</option>
                    <option value="Mahindra">Mahindra</option>
                    <option value="Ford">Ford</option>
                    <option value="Volkswagen">Volkswagen</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <input
                    type="text"
                    name="model"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., VXI"
                    value={formData.model}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="number"
                    name="year"
                    required
                    min="2000"
                    max={new Date().getFullYear()}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.year}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                  <input
                    type="text"
                    name="numberPlate"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., MH12AB1234"
                    value={formData.numberPlate}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                  <select
                    name="fuelType"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.fuelType}
                    onChange={handleChange}
                  >
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="cng">CNG</option>
                    <option value="electric">Electric</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
                  <select
                    name="seats"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.seats}
                    onChange={handleChange}
                  >
                    <option value={2}>2 Seater</option>
                    <option value={4}>4 Seater</option>
                    <option value={5}>5 Seater</option>
                    <option value={7}>7 Seater</option>
                    <option value={8}>8 Seater</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                  <select
                    name="transmission"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.transmission}
                    onChange={handleChange}
                  >
                    <option value="manual">Manual</option>
                    <option value="automatic">Automatic</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Pricing & Terms
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price per Day (₹)</label>
                  <input
                    type="number"
                    name="pricePerDay"
                    required
                    min="500"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.pricePerDay}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit (₹)</label>
                  <input
                    type="number"
                    name="securityDeposit"
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.securityDeposit}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max KM per Day</label>
                  <input
                    type="number"
                    name="maxKmPerDay"
                    min="100"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.maxKmPerDay}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Extra Charge per KM (₹)</label>
                  <input
                    type="number"
                    name="extraChargePerKm"
                    min="5"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.extraChargePerKm}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Pickup Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    name="pickupAddress"
                    required
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Full pickup address"
                    value={formData.pickupAddress}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="pickupCity"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Mumbai"
                    value={formData.pickupCity}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Availability */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Available From</label>
                  <input
                    type="date"
                    name="availableFrom"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.availableFrom}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Available To</label>
                  <input
                    type="date"
                    name="availableTo"
                    required
                    min={formData.availableFrom || new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.availableTo}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Car Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {carFeatures.map(feature => (
                  <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Documents & Images
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">RC Document *</label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    required
                    onChange={(e) => handleFileChange(e, 'rcDocument')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Document *</label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    required
                    onChange={(e) => handleFileChange(e, 'insurance')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pollution Certificate</label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange(e, 'pollutionCert')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Car Images *</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    required
                    onChange={(e) => handleFileChange(e, 'images')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload multiple images of your car</p>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Adding Car...' : 'Add Car'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCar;