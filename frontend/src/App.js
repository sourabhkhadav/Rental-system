import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import OwnerLayout from './components/OwnerLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CarSearch from './pages/CarSearch';
import CarDetails from './pages/CarDetails';
import AdminDashboard from './pages/AdminDashboard';
import AddCar from './pages/AddCar';
import Profile from './pages/Profile';
import MyCars from './pages/MyCars';
import Bookings from './pages/Bookings';
import UserHome from './pages/UserHome';
import UserDashboard from './pages/UserDashboard';
import UserBookings from './pages/UserBookings';
import Earnings from './pages/Earnings';
import Reviews from './pages/Reviews';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }

  if (user?.status !== 'approved' && user?.role !== 'admin') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Account Pending Approval</h2>
          <p>Please wait for admin approval to access the system.</p>
        </div>
      </div>
    );
  }

  return children;
};

function AppContent() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
        {/* Home Route - Shows UserHome for logged-in users, Home for guests */}
        <Route path="/" element={
          isAuthenticated && user?.role === 'user' ? <UserHome /> : <Home />
        } />
        <Route path="/search" element={<CarSearch />} />
        <Route path="/car/:id" element={<CarDetails />} />
        
        {/* Auth Routes */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />} 
        />
        <Route 
          path="/register" 
          element={!isAuthenticated ? <Register /> : <Navigate to="/" />} 
        />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              {user?.role === 'admin' ? <AdminDashboard /> :
               user?.role === 'user' ? <UserDashboard /> : <Dashboard />}
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/add-car" 
          element={
            <ProtectedRoute requiredRole="owner">
              <AddCar />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/my-bookings" 
          element={
            <ProtectedRoute>
              {user?.role === 'user' ? <UserBookings /> : <Navigate to="/dashboard" />}
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/my-cars" 
          element={
            <ProtectedRoute requiredRole="owner">
              <MyCars />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/bookings" 
          element={
            <ProtectedRoute requiredRole="owner">
              <Bookings />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/earnings" 
          element={
            <ProtectedRoute requiredRole="owner">
              <Earnings />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/reviews" 
          element={
            <ProtectedRoute requiredRole="owner">
              <Reviews />
            </ProtectedRoute>
          } 
        />
        

        </Routes>
      </main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;