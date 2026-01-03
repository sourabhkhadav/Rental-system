import { PLATFORM_CONFIG, STATUS_COLORS } from '../constants';

// Date utilities
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const calculateDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

// Price utilities
export const formatPrice = (amount) => {
  return `${PLATFORM_CONFIG.CURRENCY}${amount.toLocaleString('en-IN')}`;
};

export const calculateTotalPrice = (pricePerDay, days) => {
  const subtotal = pricePerDay * days;
  const platformFee = Math.round(subtotal * PLATFORM_CONFIG.FEE_PERCENTAGE);
  return {
    subtotal,
    platformFee,
    total: subtotal + platformFee
  };
};

// Status utilities
export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
};

export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[+]?[1-9][\d\s\-()]{8,15}$/;
  return phoneRegex.test(phone);
};

// URL utilities
export const buildSearchParams = (filters) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach(key => {
    if (filters[key]) {
      params.append(key, filters[key]);
    }
  });
  return params.toString();
};

// Array utilities
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

// Local storage utilities
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Handle storage errors silently
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Handle storage errors silently
    }
  }
};

// Debounce utility
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};