import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 120000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Functions
export const authAPI = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  register: (userData) => api.post('/api/auth/register', userData),
  logout: () => api.post('/api/auth/logout'),
  getProfile: () => api.get('/api/auth/profile')
};

export const carAPI = {
  getAllCars: () => api.get('/api/cars'),
  getCarById: (id) => api.get(`/api/cars/${id}`),
  addCar: (carData) => api.post('/api/cars', carData),
  updateCar: (id, carData) => api.put(`/api/cars/${id}`, carData),
  deleteCar: (id) => api.delete(`/api/cars/${id}`),
  getOwnerCars: () => api.get('/api/cars/owner')
};

export const bookingAPI = {
  createBooking: (bookingData) => api.post('/api/bookings', bookingData),
  getBookings: () => api.get('/api/bookings'),
  updateBookingStatus: (id, status) => api.put(`/api/bookings/${id}/status`, { status })
};

export default api;