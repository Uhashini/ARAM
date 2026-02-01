import React from 'react';
import './RoleDashboard.css';

const WitnessDashboard = () => {
  return (
    <div className="role-dashboard">
      <div className="role-dashboard__header">
        <h1>Witness Dashboard</h1>
        <p>Report incidents and access guidance resources</p>
      </div>
      
      <div className="role-dashboard__content">
        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="action-cards">
            <div className="action-card">
              <h3>📝 Report New Incident</h3>
              <p>Submit an anonymous report about an IPV incident</p>
              <button className="action-button">Report Incident</button>
            </div>
            
            <div className="action-card">
              <h3>📋 View My Reports</h3>
              <p>Check the status of previously submitted reports</p>
              <button className="action-button">View Reports</button>
            </div>
          </div>
        </div>
        
        <div className="dashboard-section">
          <h2>Resources</h2>
          <div className="resource-list">
            <div className="resource-item">
              <h4>How to Recognize IPV Signs</h4>
              <p>Learn about warning signs and indicators of intimate partner violence</p>
            </div>
            <div className="resource-item">
              <h4>Safety Guidelines for Witnesses</h4>
              <p>Important safety considerations when witnessing or reporting IPV</p>
            </div>
            <div className="resource-item">
              <h4>Emergency Contacts</h4>
              <p>24/7 hotlines and emergency services for immediate assistance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WitnessDashboard;