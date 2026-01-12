import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

// Pages
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CarSearch from './pages/CarSearch.jsx';
import CarDetails from './pages/CarDetails.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AddCar from './pages/AddCar.jsx';
import Profile from './pages/Profile.jsx';
import MyCars from './pages/MyCars.jsx';
import Bookings from './pages/Bookings.jsx';
import UserHome from './pages/UserHome.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import UserBookings from './pages/UserBookings.jsx';
import Earnings from './pages/Earnings.jsx';
import Reviews from './pages/Reviews.jsx';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />;
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
          <Route path="/" element={
            isAuthenticated && user?.role === 'user' ? <UserHome /> : 
            isAuthenticated && user?.role === 'admin' ? <Navigate to="/admin/dashboard" /> :
            <Home />
          } />
          <Route path="/search" element={<CarSearch />} />
          <Route path="/car/:id" element={<CarDetails />} />
          
          <Route path="/login" element={!isAuthenticated ? <Login /> : 
            user?.role === 'admin' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
          
          <Route path="/admin/login" element={!isAuthenticated ? <AdminLogin /> : 
            user?.role === 'admin' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/" />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              {user?.role === 'admin' ? <AdminDashboard /> :
               user?.role === 'user' ? <UserDashboard /> : <Dashboard />}
            </ProtectedRoute>
          } />
          
          <Route path="/add-car" element={
            <ProtectedRoute requiredRole="owner">
              <AddCar />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="/my-bookings" element={
            <ProtectedRoute>
              {user?.role === 'user' ? <UserBookings /> : <Navigate to="/dashboard" />}
            </ProtectedRoute>
          } />
          
          <Route path="/my-cars" element={
            <ProtectedRoute requiredRole="owner">
              <MyCars />
            </ProtectedRoute>
          } />
          
          <Route path="/bookings" element={
            <ProtectedRoute requiredRole="owner">
              <Bookings />
            </ProtectedRoute>
          } />
          
          <Route path="/earnings" element={
            <ProtectedRoute requiredRole="owner">
              <Earnings />
            </ProtectedRoute>
          } />
          
          <Route path="/reviews" element={
            <ProtectedRoute requiredRole="owner">
              <Reviews />
            </ProtectedRoute>
          } />
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