import React from 'react';
import Navigation from '../Navigation';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <Navigation />
      <div className="dashboard-content">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;