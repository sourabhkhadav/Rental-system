import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
  isAuthenticated: !!localStorage.getItem('token')
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    case 'LOAD_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false
      };
    case 'AUTH_ERROR':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload
      };
    default:
      return state;
  }
};

const handleApiResponse = (response) => {
  if (response.success) {
    return { success: true, ...response };
  }
  return { success: false, message: response.message };
};

const handleApiError = (error, defaultMessage) => ({
  success: false,
  message: error.response?.data?.message || defaultMessage
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await loadUser();
        } catch (error) {
          dispatch({ type: 'AUTH_ERROR' });
        }
      } else {
        dispatch({ type: 'AUTH_ERROR' });
      }
    };
    initAuth();
  }, []);

  const loadUser = async () => {
    try {
      const res = await api.get('/api/auth/me');
      dispatch({ type: 'LOAD_USER', payload: res.data.user });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      return { success: true };
    } catch (error) {
      return handleApiError(error, 'Login failed');
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/api/auth/register', userData);
      if (res.data.success) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
        return { success: true, user: res.data.user, message: res.data.message };
      }
      return handleApiResponse(res.data);
    } catch (error) {
      return handleApiError(error, 'Registration failed');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/api/auth/profile', profileData);
      if (res.data.success) {
        dispatch({ type: 'UPDATE_USER', payload: res.data.user });
      }
      return handleApiResponse(res.data);
    } catch (error) {
      return handleApiError(error, 'Profile update failed');
    }
  };

  const changePassword = async (passwordData) => {
    try {
      const res = await api.put('/api/auth/change-password', passwordData);
      return handleApiResponse(res.data);
    } catch (error) {
      return handleApiError(error, 'Password change failed');
    }
  };

  const deleteAccount = async () => {
    try {
      const res = await api.delete('/api/auth/account');
      if (res.data.success) {
        dispatch({ type: 'LOGOUT' });
      }
      return handleApiResponse(res.data);
    } catch (error) {
      return handleApiError(error, 'Account deletion failed');
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout,
      loadUser,
      updateProfile,
      changePassword,
      deleteAccount
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};