import React from 'react';
import './RoleDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="role-dashboard">
      <div className="role-dashboard__header">
        <h1>Administrator Dashboard</h1>
        <p>System management, analytics, and administrative tools</p>
      </div>
      
      <div className="role-dashboard__content">
        <div className="dashboard-section">
          <h2>System Management</h2>
          <div className="action-cards">
            <div className="action-card">
              <h3>📈 Analytics</h3>
              <p>View system-wide analytics and trends</p>
              <button className="action-button">View Analytics</button>
            </div>
            
            <div className="action-card">
              <h3>📄 Reports</h3>
              <p>Generate compliance and performance reports</p>
              <button className="action-button">Generate Reports</button>
            </div>
            
            <div className="action-card">
              <h3>👤 User Management</h3>
              <p>Manage user accounts and permissions</p>
              <button className="action-button">Manage Users</button>
            </div>
            
            <div className="action-card">
              <h3>📝 Content Management</h3>
              <p>Update educational content and resources</p>
              <button className="action-button">Manage Content</button>
            </div>
          </div>
        </div>
        
        <div className="dashboard-section">
          <h2>System Overview</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>1,247</h3>
              <p>Total Users</p>
            </div>
            <div className="stat-card">
              <h3>89</h3>
              <p>Reports This Month</p>
            </div>
            <div className="stat-card">
              <h3>156</h3>
              <p>Active Referrals</p>
            </div>
            <div className="stat-card">
              <h3>98.5%</h3>
              <p>System Uptime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;