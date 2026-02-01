import React from 'react';
import './AuthLayout.css';

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-header">
          <h1>IPV Intervention System</h1>
          <p>Secure Access Portal</p>
        </div>
        <div className="auth-content">
          {children}
        </div>
        <div className="auth-footer">
          <p>Protected by industry-standard security measures</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;