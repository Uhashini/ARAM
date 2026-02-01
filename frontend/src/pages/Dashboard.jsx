import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1>Welcome to IPV Intervention System</h1>
        <p>Select your role-specific dashboard from the navigation menu</p>
      </div>
      
      <div className="dashboard__cards">
        <div className="dashboard__card">
          <h3>🏥 Healthcare Workers</h3>
          <p>Conduct patient screenings, manage care plans, and access clinical tools</p>
          <a href="/healthcare-dashboard" className="dashboard__link">
            Go to Healthcare Dashboard
          </a>
        </div>
        
        <div className="dashboard__card">
          <h3>👤 Victims/Survivors</h3>
          <p>Access self-screening tools, safety planning, and support resources</p>
          <a href="/victim-dashboard" className="dashboard__link">
            Go to Victim Dashboard
          </a>
        </div>
        
        <div className="dashboard__card">
          <h3>👁️ Witnesses</h3>
          <p>Report incidents anonymously and access guidance resources</p>
          <a href="/witness-dashboard" className="dashboard__link">
            Go to Witness Dashboard
          </a>
        </div>
        
        <div className="dashboard__card">
          <h3>⚙️ Administrators</h3>
          <p>Manage system analytics, reports, and user administration</p>
          <a href="/admin-dashboard" className="dashboard__link">
            Go to Admin Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;