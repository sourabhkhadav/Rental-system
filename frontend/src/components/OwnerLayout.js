import React from 'react';
import { useAuth } from '../context/AuthContext';

const OwnerLayout = ({ children }) => {
  const { user } = useAuth();

  // Since we now use ModernOwnerPanel, this layout just returns children
  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        {children}
      </main>
    </div>
  );
};

export default OwnerLayout;