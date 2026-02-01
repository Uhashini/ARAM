import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Mock user role - will be replaced with actual authentication in task 2.1
  const userRole = 'admin'; // This will come from authentication context

  const navigationItems = {
    witness: [
      { path: '/witness-dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/witness-report', label: 'Report Incident', icon: '📝' }
    ],
    victim: [
      { path: '/victim-dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/victim-dashboard/screening', label: 'Self-Screening', icon: '🔍' },
      { path: '/victim-dashboard/safety-plan', label: 'Safety Plan', icon: '🛡️' },
      { path: '/victim-dashboard/journal', label: 'Journal', icon: '📔' },
      { path: '/victim-dashboard/referrals', label: 'Referrals', icon: '🤝' }
    ],
    healthcare_worker: [
      { path: '/healthcare-dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/healthcare-dashboard/patients', label: 'Patient Search', icon: '👥' },
      { path: '/healthcare-dashboard/screening', label: 'Clinical Screening', icon: '🏥' },
      { path: '/healthcare-dashboard/careplans', label: 'Care Plans', icon: '📋' },
      { path: '/healthcare-dashboard/referrals', label: 'Referrals', icon: '🤝' }
    ],
    admin: [
      { path: '/admin-dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/admin-dashboard/analytics', label: 'Analytics', icon: '📈' },
      { path: '/admin-dashboard/reports', label: 'Reports', icon: '📄' },
      { path: '/admin-dashboard/users', label: 'User Management', icon: '👤' },
      { path: '/admin-dashboard/content', label: 'Content Management', icon: '📝' }
    ]
  };

  const currentItems = navigationItems[userRole] || [];

  return (
    <nav className={`navigation ${isOpen ? 'navigation--open' : ''}`}>
      <div className="navigation__header">
        <h2>IPV System</h2>
        <button 
          className="navigation__toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
      </div>
      
      <ul className="navigation__list">
        {currentItems.map((item) => (
          <li key={item.path} className="navigation__item">
            <Link 
              to={item.path}
              className={`navigation__link ${
                location.pathname === item.path ? 'navigation__link--active' : ''
              }`}
              onClick={() => setIsOpen(false)}
            >
              <span className="navigation__icon">{item.icon}</span>
              <span className="navigation__label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      
      <div className="navigation__footer">
        <button className="navigation__logout">
          <span className="navigation__icon">🚪</span>
          <span className="navigation__label">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;