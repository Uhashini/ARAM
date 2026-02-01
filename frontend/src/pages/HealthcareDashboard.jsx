import React from 'react';
import './RoleDashboard.css';

const HealthcareDashboard = () => {
  return (
    <div className="role-dashboard">
      <div className="role-dashboard__header">
        <h1>Healthcare Worker Dashboard</h1>
        <p>Clinical tools for IPV screening, assessment, and patient care</p>
      </div>
      
      <div className="role-dashboard__content">
        <div className="dashboard-section">
          <h2>Patient Management</h2>
          <div className="action-cards">
            <div className="action-card">
              <h3>👥 Patient Search</h3>
              <p>Search and access patient records with IPV history</p>
              <button className="action-button">Search Patients</button>
            </div>
            
            <div className="action-card">
              <h3>🏥 Clinical Screening</h3>
              <p>Conduct structured IPV screening assessments</p>
              <button className="action-button">New Screening</button>
            </div>
            
            <div className="action-card">
              <h3>📋 Care Plans</h3>
              <p>Create and manage patient care plans</p>
              <button className="action-button">Manage Care Plans</button>
            </div>
            
            <div className="action-card">
              <h3>🤝 Referrals</h3>
              <p>Initiate referrals to support services</p>
              <button className="action-button">Create Referral</button>
            </div>
          </div>
        </div>
        
        <div className="dashboard-section">
          <h2>Today's Summary</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>12</h3>
              <p>Patients Screened</p>
            </div>
            <div className="stat-card">
              <h3>3</h3>
              <p>High Risk Cases</p>
            </div>
            <div className="stat-card">
              <h3>5</h3>
              <p>Referrals Made</p>
            </div>
            <div className="stat-card">
              <h3>8</h3>
              <p>Follow-ups Due</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthcareDashboard;