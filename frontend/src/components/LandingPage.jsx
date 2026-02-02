import { useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';
import Hero from './Hero';
import RoleSelection from './RoleSelection';
import UnderstandAbuse from './UnderstandAbuse';
import RecognizeAbuse from './RecognizeAbuse';
import SeekingSupport from './SeekingSupport';
import aramLogo from '../assets/aram-hero-logo.png';

const LandingPage = () => {
    const rolesRef = useRef(null);
    const navigate = useNavigate();

    const scrollToRoles = () => {
        rolesRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="app-container">
            {/* Emergency Banner */}
            <div className="emergency-banner">
                🚑 If you are in immediate danger, call 911 or your local emergency number immediately.
            </div>

            {/* Navigation */}
            <nav className="navbar">
                <div className="container nav-content">
                    <div className="logo">
                        <Link to="/">
                            <img src={aramLogo} alt="ARAM Logo" style={{ height: '40px' }} />
                        </Link>
                        ARAM
                    </div>
                    <div className="nav-links">
                        <a href="#about" className="nav-link">About</a>
                        <a href="#resources" className="nav-link">Resources</a>
                        <a href="#contact" className="nav-link">Contact</a>
                        <button className="btn-primary" onClick={scrollToRoles}>Get Started</button>
                    </div>
                </div>
            </nav>

            <Hero onScrollToRoles={scrollToRoles} />

            <div ref={rolesRef}>
                <RoleSelection />
            </div>

            <UnderstandAbuse />

            <RecognizeAbuse />

            <SeekingSupport />

            {/* Footer */}
            <footer className="footer">
                <div className="container footer-content">
                    <div className="footer-section">
                        <h4>ARAM</h4>
                        <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                            Empowering communities to end intimate partner violence through technology and support.
                        </p>
                    </div>
                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <Link to="/safety-planning" className="footer-link">Safety Planning</Link>
                        <Link to="/shelters" className="footer-link">Find a Shelter</Link>
                        <Link to="/legal" className="footer-link">Legal Resources</Link>
                    </div>
                    <div className="footer-section">
                        <h4>24/7 Hotlines</h4>
                        <a href="tel:18007997233" className="footer-link">National Domestic Violence Hotline</a>
                        <span className="footer-link">1-800-799-SAFE (7233)</span>
                    </div>
                </div>
                <div className="container" style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.8rem', color: '#6b7280' }}>
                    © 2024 ARAM Platform. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
