import React from 'react';
import { useLocation } from 'react-router-dom';
<<<<<<< HEAD
import OwnerDashboard from './OwnerDashboard';
=======
import ModernOwnerPanel from './ModernOwnerPanel';
>>>>>>> b27a4ec828499174ba4aa7f4196a9dc78a751635
import AddCar from '../pages/AddCar';
import MyCars from '../pages/MyCars';
import Bookings from '../pages/Bookings';
import Earnings from '../pages/Earnings';
import Reviews from '../pages/Reviews';
import Profile from '../pages/Profile';

const OwnerPanelRouter = () => {
  const location = useLocation();

<<<<<<< HEAD
=======
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/add-car': return 'Add New Car';
      case '/my-cars': return 'My Cars';
      case '/bookings': return 'Bookings';
      case '/earnings': return 'Earnings';
      case '/reviews': return 'Reviews';
      case '/profile': return 'Profile';
      default: return '';
    }
  };

>>>>>>> b27a4ec828499174ba4aa7f4196a9dc78a751635
  const renderContent = () => {
    switch (location.pathname) {
      case '/owner-panel':
      case '/dashboard':
<<<<<<< HEAD
        return <OwnerDashboard />;
=======
        return <ModernOwnerPanel />;
>>>>>>> b27a4ec828499174ba4aa7f4196a9dc78a751635
      case '/add-car':
        return (
          <div className="p-6">
            <AddCar />
          </div>
        );
      case '/my-cars':
        return (
          <div className="p-6">
            <MyCars />
          </div>
        );
      case '/bookings':
        return (
          <div className="p-6">
            <Bookings />
          </div>
        );
      case '/earnings':
        return (
          <div className="p-6">
            <Earnings />
          </div>
        );
      case '/reviews':
        return (
          <div className="p-6">
            <Reviews />
          </div>
        );
      case '/profile':
        return (
          <div className="p-6">
            <Profile />
          </div>
        );
      default:
<<<<<<< HEAD
        return <OwnerDashboard />;
=======
        return <ModernOwnerPanel />;
>>>>>>> b27a4ec828499174ba4aa7f4196a9dc78a751635
    }
  };

  return (
    <>
      {renderContent()}
    </>
  );
};

export default OwnerPanelRouter;