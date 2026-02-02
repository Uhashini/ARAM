import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import aramLogo from '../assets/aram-hero-logo.png';

const Hero = ({ onScrollToRoles }) => {
  const [offset, setOffset] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="hero" style={{ backgroundPositionY: offset * 0.5 + 'px' }}>
      <div className="container hero-container">
        <motion.div
          className="hero-logo-wrapper"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img src={aramLogo} alt="ARAM Logo" className="hero-logo-img" />
        </motion.div>

        <div className="hero-content">
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Recognize. Report. Recover.
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Empowering communities and healthcare professionals to identify, report and respond to abuse safely.
            Your safety is our priority.
          </motion.p>
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button className="btn-primary" onClick={onScrollToRoles}>
              Get Started
            </button>
            <button className="btn-outline" onClick={() => navigate('/healthcare')}>
              I'm a Healthcare Worker
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
