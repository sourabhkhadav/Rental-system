import axios from 'axios';
import { API_ENDPOINTS } from '../constants';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5005';
const API_TIMEOUT = 10000;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

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
    const response = await api.get(API_ENDPOINTS.CARS.MY_CARS);
    return response.data;
  },

  getOwnerStats: async () => {
    const response = await api.get(API_ENDPOINTS.CARS.OWNER_STATS);
    return response.data;
  }
};

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
    const response = await api.put(`/api/bookings/${id}/${action}`, { 
      rejectionReason: reason 
    });
    return response.data;
  }
};

export const earningsService = {
  getOwnerEarnings: async () => {
    const response = await api.get(API_ENDPOINTS.EARNINGS.OWNER);
    return response.data;
  }
};

export default api;