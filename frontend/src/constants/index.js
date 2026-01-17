import { DEFAULT_CAR_IMAGE } from '../hooks';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    PROFILE: '/api/auth/profile'
  },
  CARS: {
    BASE: '/api/cars',
    SEARCH: '/api/cars/search',
    BY_ID: (id) => `/api/cars/${id}`
  },
  BOOKINGS: {
    BASE: '/api/bookings',
    USER: '/api/bookings/user-bookings',
    OWNER: '/api/bookings/owner-bookings',
    CANCEL: (id) => `/api/bookings/${id}/cancel`,
    HANDLE: (id) => `/api/bookings/${id}/handle`
  }
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  SEARCH: '/search',
  CAR_DETAILS: (id) => `/car/${id}`,
  MY_BOOKINGS: '/my-bookings',
  MY_CARS: '/my-cars',
  PROFILE: '/profile',
  ADMIN: '/admin'
};

export const USER_ROLES = {
  USER: 'user',
  OWNER: 'owner',
  ADMIN: 'admin'
};

export const BOOKING_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  CONFIRMED: 'confirmed',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const CAR_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  BLOCKED: 'blocked',
  INACTIVE: 'inactive'
};

export const POPULAR_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'
];

export const DUMMY_CARS = [
  {
    _id: 'dummy-1',
    name: 'Maruti Swift',
    brand: 'Maruti Suzuki',
    pricePerDay: 1200,
    seats: 5,
    fuelType: 'petrol',
    transmission: 'manual',
    rating: 4.5,
    images: ['https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=240&fit=crop'],
    pickupLocation: { city: 'Mumbai' },
    isDummy: true
  },
  {
    _id: 'dummy-2', 
    name: 'Hyundai Creta',
    brand: 'Hyundai',
    pricePerDay: 2500,
    seats: 5,
    fuelType: 'diesel',
    transmission: 'automatic',
    rating: 4.7,
    images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&h=240&fit=crop'],
    pickupLocation: { city: 'Delhi' },
    isDummy: true
  },
  {
    _id: 'dummy-3',
    name: 'Honda City',
    brand: 'Honda',
    pricePerDay: 1800,
    seats: 5,
    fuelType: 'petrol',
    transmission: 'automatic', 
    rating: 4.6,
    images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=240&fit=crop'],
    pickupLocation: { city: 'Bangalore' },
    isDummy: true
  }
];

export const CAR_SPECS = {
  FUEL_TYPES: ['petrol', 'diesel', 'cng', 'electric'],
  TRANSMISSIONS: ['manual', 'automatic'],
  SEAT_OPTIONS: [4, 5, 7, 8]
};

export const PLATFORM_CONFIG = {
  FEE_PERCENTAGE: 0.05,
  MIN_BOOKING_DAYS: 1,
  MAX_BOOKING_DAYS: 30,
  CURRENCY: '₹'
};

export const STATUS_COLORS = {
  [BOOKING_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [BOOKING_STATUS.ACCEPTED]: 'bg-green-100 text-green-800',
  [BOOKING_STATUS.REJECTED]: 'bg-red-100 text-red-800',
  [BOOKING_STATUS.CONFIRMED]: 'bg-blue-100 text-blue-800',
  [BOOKING_STATUS.COMPLETED]: 'bg-gray-100 text-gray-800',
  [BOOKING_STATUS.CANCELLED]: 'bg-red-100 text-red-800'
};