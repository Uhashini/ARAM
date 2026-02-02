import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Shield, Home } from 'lucide-react';
import aramLogo from '../assets/aram-hero-logo.png';
import '../App.css';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  // Mock auth state - replace with actual context later
  const isLoggedIn = false;

  const handleQuickExit = () => {
    window.location.href = "https://www.google.com";
  };

  return (
    <nav className="navbar" style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--white)', padding: '0.8rem 0' }}>
      <div className="container nav-content">
        <div className="logo">
          <Link to="/">
            <img src={aramLogo} alt="ARAM Logo" style={{ height: '40px' }} />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="nav-links desktop-nav" style={{ display: isOpen ? 'none' : 'flex' }}>
          <Link to="/" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Home size={18} /> Home</Link>
          {!isLoggedIn ? (
            <>
              <Link to="/resources/legal" className="nav-link">Legal Resources</Link>
              <Link to="/resources/shelters" className="nav-link">Safe Shelters</Link>
              <Link to="/helplines" className="nav-link">Helplines</Link>
              <Link to="/login" className="btn-outline">Log in</Link>
            </>
          ) : (
            <>
              <Link to="/victim-dashboard" className="nav-link">Dashboard</Link>
              <Link to="/self-screen" className="nav-link">Self Screen</Link>
              <Link to="/journal" className="nav-link">Journal</Link>
              <button
                onClick={() => { /* Logout logic */ navigate('/'); }}
                className="btn-ghost"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          )}

          <button
            onClick={handleQuickExit}
            className="btn-primary"
            style={{ backgroundColor: '#ef4444', marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <LogOut size={16} style={{ transform: 'rotate(180deg)' }} /> Quick Exit
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mobile-menu container" style={{ paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link to="/" className="nav-link mobile-link"><Home size={18} /> Home</Link>
            {!isLoggedIn ? (
              <>
                <Link to="/resources/legal" className="nav-link mobile-link">Legal Resources</Link>
                <Link to="/resources/shelters" className="nav-link mobile-link">Safe Shelters</Link>
                <Link to="/helplines" className="nav-link mobile-link">Helplines</Link>
                <Link to="/login" className="btn-outline mobile-btn">Log in</Link>
              </>
            ) : (
              <>
                <Link to="/victim-dashboard" className="nav-link mobile-link">Dashboard</Link>
                <Link to="/self-screen" className="nav-link mobile-link">Self Screen</Link>
                <Link to="/journal" className="nav-link mobile-link">Journal</Link>
                <button className="btn-ghost mobile-btn">Logout</button>
              </>
            )}
            <button
              onClick={handleQuickExit}
              className="btn-primary mobile-btn"
              style={{ backgroundColor: '#ef4444' }}
            >
              Quick Exit
            </button>
          </div>
        </div>
      )}

      {/* Mobile Styles Injection */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
          .mobile-link { padding: 0.5rem 0; border-bottom: 1px solid #eee; display: block; }
          .mobile-btn { width: 100%; text-align: center; margin-top: 0.5rem; }
        }
      `}</style>
    </nav>
  );
};

export default Navigation;