import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5005',
  timeout: 10000,
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
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  }
};

export const carService = {
  getAllCars: async (params = {}) => {
    const response = await api.get('/api/cars', { params });
    return response.data;
  },

  searchCars: async (filters) => {
    const response = await api.get('/api/cars/search', { params: filters });
    return response.data;
  },

  getCarById: async (id) => {
    const response = await api.get(`/api/cars/${id}`);
    return response.data;
  },

  getMyCars: async () => {
    const response = await api.get('/api/cars/my-cars');
    return response.data;
  },

  addCar: async (carData) => {
    const response = await api.post('/api/cars', carData);
    return response.data;
  },

  deleteCar: async (id) => {
    const response = await api.delete(`/api/cars/${id}`);
    return response.data;
  }
};

export const bookingService = {
  createBooking: async (bookingData) => {
    const response = await api.post('/api/bookings', bookingData);
    return response.data;
  },

  getUserBookings: async () => {
    const response = await api.get('/api/bookings/user-bookings');
    return response.data;
  },

  getOwnerBookings: async () => {
    const response = await api.get('/api/bookings/owner-bookings');
    return response.data;
  },

  cancelBooking: async (id, reason) => {
    const response = await api.put(`/api/bookings/${id}/cancel`, { reason });
    return response.data;
  },

  handleBookingRequest: async (id, action, reason = '') => {
    const response = await api.put(`/api/bookings/${id}/${action}`, { 
      rejectionReason: reason 
    });
    return response.data;
  }
};

export default api;