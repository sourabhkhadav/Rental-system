import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import OwnerDashboard from './components/OwnerDashboard';
import OwnerHomePage from './components/OwnerHomePage';
import OwnerLandingPage from './components/OwnerLandingPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CarSearch from './pages/CarSearch';
import CarDetails from './pages/CarDetails';
import AdminDashboard from './pages/AdminDashboard';
import AddCar from './pages/AddCar';
import Profile from './pages/Profile';
import ModernOwnerPanel from './components/ModernOwnerPanel';
import OwnerPanelRouter from './components/OwnerPanelRouter';
import MyCars from './pages/MyCars';
import Bookings from './pages/Bookings';
import UserHome from './pages/UserHome';
import UserDashboard from './pages/UserDashboard';
import UserBookings from './pages/UserBookings';
import Earnings from './pages/Earnings';
import Reviews from './pages/Reviews';
import Footer from './components/Footer';

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
    return <Navigate to="/" />;
  }

  return children;
};

function AppContent() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
        {/* Home Route - Different for owners vs users */}
        <Route 
          path="/" 
          element={
            isAuthenticated && user?.role === 'owner' ? 
              <OwnerHomePage key="owner-home" /> : 
              <Home />
          } 
        />
        <Route path="/search" element={<CarSearch />} />
        <Route path="/car/:id" element={<CarDetails />} />
        
        {/* Auth Routes */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : 
            user?.role === 'admin' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/" />} 
        />
        <Route 
          path="/register" 
          element={!isAuthenticated ? <Register /> : <Navigate to="/" />} 
        />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={<Navigate to="/admin/dashboard" />} 
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
          path="/owner-panel" 
          element={
            <ProtectedRoute requiredRole="owner">
              <OwnerPanelRouter />
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