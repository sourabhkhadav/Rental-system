import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const AuthDebugger = () => {
  const { user, token, isAuthenticated } = useAuth();
  const [debugInfo, setDebugInfo] = useState(null);

  const checkAuthStatus = async () => {
    try {
      const response = await api.get('/api/auth/me');
      setDebugInfo({
        success: true,
        user: response.data.user,
        message: 'Authentication successful'
      });
    } catch (error) {
      setDebugInfo({
        success: false,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        hasToken: !!localStorage.getItem('token')
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      checkAuthStatus();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
        <h3 className="font-semibold text-red-800">Not Authenticated</h3>
        <p className="text-red-600">Please log in to access owner features.</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 m-4">
      <h3 className="font-semibold text-blue-800 mb-2">Authentication Debug Info</h3>
      
      <div className="space-y-2 text-sm">
        <div><strong>User Role:</strong> {user?.role || 'Unknown'}</div>
        <div><strong>User Status:</strong> {user?.status || 'Unknown'}</div>
        <div><strong>User ID:</strong> {user?._id || 'Unknown'}</div>
        <div><strong>Has Token:</strong> {token ? 'Yes' : 'No'}</div>
        
        {debugInfo && (
          <div className="mt-3 p-2 bg-white rounded border">
            <div><strong>API Check:</strong> {debugInfo.success ? '✅ Success' : '❌ Failed'}</div>
            {debugInfo.status && <div><strong>Status Code:</strong> {debugInfo.status}</div>}
            <div><strong>Message:</strong> {debugInfo.message}</div>
          </div>
        )}
      </div>
      
      <button 
        onClick={checkAuthStatus}
        className="mt-3 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
      >
        Refresh Auth Check
      </button>
    </div>
  );
};

export default AuthDebugger;