import React from 'react';
import { useLocation } from 'react-router-dom';
import AddCar from '../pages/AddCar';
import MyCars from '../pages/MyCars';
import Bookings from '../pages/Bookings';
import Earnings from '../pages/Earnings';
import Reviews from '../pages/Reviews';
import Profile from '../pages/Profile';
import OwnerDashboard from './OwnerDashboard';

const OwnerPanelRouter = () => {
  const location = useLocation();

  const renderContent = () => {
    switch (location.pathname) {
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
        return <OwnerDashboard />;
    }
  };

  return (
    <>
      {renderContent()}
    </>
  );
};

export default OwnerPanelRouter;