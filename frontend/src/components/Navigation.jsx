import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Shield, Home, ChevronDown } from 'lucide-react';
import aramLogo from '../assets/aram-hero-logo.png';
import './Navigation.css';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location]);


  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/');
  };

  const handleQuickExit = () => {
    window.location.replace("https://www.google.com/search?q=weather+today");
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

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  return (
    <>
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>

      <nav className="navbar" role="navigation" aria-label="Main navigation">
        <div className="container nav-content">
          <div className="logo">
            <Link to="/" aria-label="ARAM Home">
              <img src={aramLogo} alt="ARAM Logo" className="logo-img" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="nav-links desktop-nav" ref={dropdownRef}>
            <Link to="/" className="nav-link" aria-label="Home">
              <Home size={18} />
              <span>Home</span>
            </Link>

            {/* Understand Abuse Dropdown */}
            <div className="nav-dropdown">
              <button
                className="nav-link dropdown-trigger"
                onClick={() => toggleDropdown('understand')}
                aria-expanded={activeDropdown === 'understand'}
                aria-haspopup="true"
              >
                <span>Understand Abuse</span>
                <ChevronDown size={16} className={`chevron ${activeDropdown === 'understand' ? 'rotate' : ''}`} />
              </button>
              {activeDropdown === 'understand' && (
                <div className="dropdown-menu" role="menu">
                  <Link to="/understand-abuse/what-is-ipv" className="dropdown-item" role="menuitem">
                    What is IPV?
                  </Link>
                  <Link to="/understand-abuse/types" className="dropdown-item" role="menuitem">
                    Types of Abuse
                  </Link>
                  <Link to="/understand-abuse/cycle" className="dropdown-item" role="menuitem">
                    Cycle of Violence
                  </Link>
                </div>
              )}
            </div>

            {/* Recognize Signs Dropdown */}
            <div className="nav-dropdown">
              <button
                className="nav-link dropdown-trigger"
                onClick={() => toggleDropdown('recognize')}
                aria-expanded={activeDropdown === 'recognize'}
                aria-haspopup="true"
              >
                <span>Recognize Signs</span>
                <ChevronDown size={16} className={`chevron ${activeDropdown === 'recognize' ? 'rotate' : ''}`} />
              </button>
              {activeDropdown === 'recognize' && (
                <div className="dropdown-menu" role="menu">
                  <Link to="/recognize-signs/victims" className="dropdown-item" role="menuitem">
                    For Victims
                  </Link>
                  <Link to="/recognize-signs/witnesses" className="dropdown-item" role="menuitem">
                    For Witnesses
                  </Link>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div className="nav-dropdown">
              <button
                className="nav-link dropdown-trigger"
                onClick={() => toggleDropdown('resources')}
                aria-expanded={activeDropdown === 'resources'}
                aria-haspopup="true"
              >
                <span>Resources</span>
                <ChevronDown size={16} className={`chevron ${activeDropdown === 'resources' ? 'rotate' : ''}`} />
              </button>
              {activeDropdown === 'resources' && (
                <div className="dropdown-menu" role="menu">
                  <Link to="/witness#safe-intervention-tools" className="dropdown-item" role="menuitem">
                    Safe Intervention Tools
                  </Link>
                  <Link to="/resources/legal" className="dropdown-item" role="menuitem">
                    Legal Resources
                  </Link>
                  <Link to="/resources/shelters" className="dropdown-item" role="menuitem">
                    Safe Shelters
                  </Link>
                  <Link to="/helplines" className="dropdown-item" role="menuitem">
                    Helplines
                  </Link>
                </div>
              )}
            </div>

            {!user ? (
              <Link to="/login" className="btn-outline">
                Log In
              </Link>
            ) : (
              <>
                <div className="nav-divider"></div>
                <Link to={getDashboardLink()} className="nav-link" aria-label="Dashboard">
                  Dashboard
                </Link>
                {user.role === 'victim' && (
                  <>
                    <Link to="/self-screen" className="nav-link">Self Screen</Link>
                    <Link to="/journal" className="nav-link">Journal</Link>
                  </>
                )}
                {user.role === 'witness' && (
                  <Link to="/report-incident" className="nav-link">Report</Link>
                )}
                <button
                  onClick={handleLogout}
                  className="btn-ghost"
                  aria-label="Logout"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            )}

            <button
              onClick={handleQuickExit}
              className="btn-quick-exit"
              title="Quick Exit (Ctrl+E) - Immediately leave this page for your safety"
              aria-label="Quick Exit"
            >
              <Shield size={16} />
              <span>Quick Exit</span>
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="mobile-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
          <div className="mobile-menu-content">
            <Link to="/" className="mobile-link">
              <Home size={18} />
              <span>Home</span>
            </Link>

            {/* Mobile Understand Abuse Section */}
            <div className="mobile-section">
              <div className="mobile-section-title">Understand Abuse</div>
              <Link to="/understand-abuse/what-is-ipv" className="mobile-link indent">
                What is IPV?
              </Link>
              <Link to="/understand-abuse/types" className="mobile-link indent">
                Types of Abuse
              </Link>
              <Link to="/understand-abuse/cycle" className="mobile-link indent">
                Cycle of Violence
              </Link>
            </div>

            {/* Mobile Recognize Signs Section */}
            <div className="mobile-section">
              <div className="mobile-section-title">Recognize Signs</div>
              <Link to="/recognize-signs/victims" className="mobile-link indent">
                For Victims
              </Link>
              <Link to="/recognize-signs/witnesses" className="mobile-link indent">
                For Witnesses
              </Link>
            </div>

            {/* Mobile Resources Section */}
            <div className="mobile-section">
              <div className="mobile-section-title">Resources</div>
              <Link to="/witness#safe-intervention-tools" className="mobile-link indent">
                Safe Intervention Tools
              </Link>
              <Link to="/resources/legal" className="mobile-link indent">
                Legal Resources
              </Link>
              <Link to="/resources/shelters" className="mobile-link indent">
                Safe Shelters
              </Link>
              <Link to="/helplines" className="mobile-link indent">
                Helplines
              </Link>
            </div>

            {!user ? (
              <Link to="/login" className="btn-outline mobile-btn">
                Log In
              </Link>
            ) : (
              <>
                <div className="mobile-divider"></div>
                <Link to={getDashboardLink()} className="mobile-link">
                  Dashboard
                </Link>
                {user.role === 'victim' && (
                  <>
                    <Link to="/self-screen" className="mobile-link">Self Screen Tool</Link>
                    <Link to="/journal" className="mobile-link">Private Journal</Link>
                  </>
                )}
                {user.role === 'witness' && (
                  <Link to="/report-incident" className="mobile-link">Report Incident</Link>
                )}
                <button onClick={handleLogout} className="btn-ghost mobile-btn">
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            )}

            <button
              onClick={handleQuickExit}
              className="btn-quick-exit mobile-btn"
            >
              <Shield size={18} />
              <span>QUICK EXIT</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Backdrop */}
        {isOpen && <div className="mobile-backdrop" onClick={() => setIsOpen(false)}></div>}
      </nav>
    </>
  );
};

export default Navigation;