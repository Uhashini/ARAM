import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Shield, Home } from 'lucide-react';
import aramLogo from '../assets/aram-hero-logo.png';
import '../App.css';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/');
  };

  const handleQuickExit = () => {
    // Immediate redirect to a neutral site
    window.location.replace("https://www.google.com/search?q=weather");
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    switch (user.role) {
      case 'victim': return "/victim-dashboard";
      case 'witness': return "/witness";
      case 'healthcare': return "/healthcare";
      case 'admin': return "/admin";
      default: return "/";
    }
  };

  return (
    <nav className="navbar" style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--white)', padding: '0.8rem 0', borderBottom: '1px solid #e2e8f0' }}>
      <div className="container nav-content">
        <div className="logo">
          <Link to="/">
            <img src={aramLogo} alt="ARAM Logo" style={{ height: '40px' }} />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="nav-links desktop-nav" style={{ display: isOpen ? 'none' : 'flex', alignItems: 'center' }}>
          <Link to="/" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Home size={18} /> Home</Link>

          {!user ? (
            <>
              <Link to="/resources/legal" className="nav-link">Legal</Link>
              <Link to="/resources/shelters" className="nav-link">Shelters</Link>
              <Link to="/helplines" className="nav-link">Helplines</Link>
              <Link to="/login" className="btn-outline">Log In</Link>
            </>
          ) : (
            <>
              <Link to={getDashboardLink()} className="nav-link" style={{ fontWeight: '500' }}>Dashboard</Link>
              {user.role === 'victim' && (
                <>
                  <Link to="/self-screen" className="nav-link">Self Screen</Link>
                  <Link to="/journal" className="nav-link">Journal</Link>
                </>
              )}
              {user.role === 'witness' && (
                <Link to="/report-incident" className="nav-link">Report</Link>
              )}

              <div style={{ width: '1px', height: '20px', background: '#e2e8f0', margin: '0 0.5rem' }}></div>

              <button
                onClick={handleLogout}
                className="btn-ghost"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          )}

          <button
            onClick={handleQuickExit}
            className="btn-primary"
            title="Saves your safety by quickly leaving this page"
            style={{ backgroundColor: '#ef4444', marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Shield size={16} /> Quick Exit
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
        <div className="mobile-menu container" style={{ paddingBottom: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '1rem' }}>
            <Link to="/" onClick={() => setIsOpen(false)} className="nav-link mobile-link"><Home size={18} /> Home</Link>

            {!user ? (
              <>
                <Link to="/resources/legal" onClick={() => setIsOpen(false)} className="nav-link mobile-link">Legal Resources</Link>
                <Link to="/resources/shelters" onClick={() => setIsOpen(false)} className="nav-link mobile-link">Safe Shelters</Link>
                <Link to="/helplines" onClick={() => setIsOpen(false)} className="nav-link mobile-link">Helplines</Link>
                <Link to="/login" onClick={() => setIsOpen(false)} className="btn-outline mobile-btn" style={{ marginTop: '1rem' }}>Log In</Link>
              </>
            ) : (
              <>
                <Link to={getDashboardLink()} onClick={() => setIsOpen(false)} className="nav-link mobile-link">Dashboard</Link>
                {user.role === 'victim' && (
                  <>
                    <Link to="/self-screen" onClick={() => setIsOpen(false)} className="nav-link mobile-link">Self Screen Tool</Link>
                    <Link to="/journal" onClick={() => setIsOpen(false)} className="nav-link mobile-link">Private Journal</Link>
                  </>
                )}
                <button onClick={handleLogout} className="btn-ghost mobile-btn" style={{ justifyContent: 'center', color: '#64748b' }}>
                  <LogOut size={18} /> Logout
                </button>
              </>
            )}

            <button
              onClick={handleQuickExit}
              className="btn-primary mobile-btn"
              style={{ backgroundColor: '#ef4444', marginTop: '1rem' }}
            >
              <Shield size={18} /> QUICK EXIT
            </button>
          </div>
        </div>
      )}

      {/* Mobile Styles Injection */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
          .mobile-link { padding: 0.75rem 0; border-bottom: 1px solid #f8fafc; display: flex; align-items: center; gap: 0.5rem; }
          .mobile-btn { width: 100%; text-align: center; margin-top: 0.5rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
        }
      `}</style>
    </nav>
  );
};

export default Navigation;