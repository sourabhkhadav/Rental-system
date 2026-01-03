import axios from 'axios';
import { API_ENDPOINTS } from '../constants';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
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
  (error) => Promise.reject(error)
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

// Auth Services
export const authService = {
  login: async (credentials) => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  }
};

// Car Services
export const carService = {
  getAllCars: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.CARS.BASE, { params });
    return response.data;
  },

  searchCars: async (filters) => {
    const response = await api.get(API_ENDPOINTS.CARS.SEARCH, { params: filters });
    return response.data;
  },

  getCarById: async (id) => {
    const response = await api.get(API_ENDPOINTS.CARS.BY_ID(id));
    return response.data;
  },

  getMyCars: async () => {
    const response = await api.get(`${API_ENDPOINTS.CARS.BASE}/my-cars`);
    return response.data;
  }
};

// Booking Services
export const bookingService = {
  createBooking: async (bookingData) => {
    const response = await api.post(API_ENDPOINTS.BOOKINGS.BASE, bookingData);
    return response.data;
  },

  getUserBookings: async () => {
    const response = await api.get(API_ENDPOINTS.BOOKINGS.USER);
    return response.data;
  },

  getOwnerBookings: async () => {
    const response = await api.get(API_ENDPOINTS.BOOKINGS.OWNER);
    return response.data;
  },

  cancelBooking: async (id, reason) => {
    const response = await api.put(API_ENDPOINTS.BOOKINGS.CANCEL(id), { reason });
    return response.data;
  },

  handleBookingRequest: async (id, action, reason = '') => {
    const response = await api.put(API_ENDPOINTS.BOOKINGS.HANDLE(id), { 
      action, 
      rejectionReason: reason 
    });
    return response.data;
  }
};

export default api;