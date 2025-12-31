import React from 'react';
import { useAuth } from '../context/AuthContext';
import OwnerSidebar from './OwnerSidebar';

const OwnerLayout = ({ children }) => {
  const { user } = useAuth();

  if (user?.role !== 'owner') {
    return children; // Return normal layout for non-owners
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <OwnerSidebar />
      <div className="flex-1">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;