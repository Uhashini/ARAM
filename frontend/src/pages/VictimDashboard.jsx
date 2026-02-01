import React from 'react';
import './RoleDashboard.css';

const VictimDashboard = () => {
  return (
    <div className="role-dashboard">
      <div className="role-dashboard__header">
        <h1>Victim/Survivor Dashboard</h1>
        <p>Access support tools and resources for your safety and wellbeing</p>
      </div>
      
      <div className="role-dashboard__content">
        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="action-cards">
            <div className="action-card">
              <h3>🔍 Self-Screening</h3>
              <p>Complete a confidential assessment to understand your situation</p>
              <button className="action-button">Start Screening</button>
            </div>
            
            <div className="action-card">
              <h3>🛡️ Safety Plan</h3>
              <p>Create or update your personalized safety plan</p>
              <button className="action-button">Manage Safety Plan</button>
            </div>
            
            <div className="action-card">
              <h3>📔 Journal Entry</h3>
              <p>Record your thoughts, feelings, and track your wellbeing</p>
              <button className="action-button">Add Entry</button>
            </div>
            
            <div className="action-card">
              <h3>🤝 Get Referrals</h3>
              <p>Connect with counselors, legal aid, and support services</p>
              <button className="action-button">Find Support</button>
            </div>
          </div>
        </div>
        
        <div className="dashboard-section">
          <h2>Your Progress</h2>
          <div className="progress-summary">
            <div className="progress-item">
              <h4>Risk Assessment</h4>
              <p>Last completed: Not yet completed</p>
              <span className="status-badge status-pending">Pending</span>
            </div>
            <div className="progress-item">
              <h4>Safety Plan</h4>
              <p>Status: Not created</p>
              <span className="status-badge status-pending">Pending</span>
            </div>
            <div className="progress-item">
              <h4>Journal Entries</h4>
              <p>Total entries: 0</p>
              <span className="status-badge status-info">Start Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VictimDashboard;