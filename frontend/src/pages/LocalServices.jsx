import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './ContentPage.css';

const LocalServices = () => {
  return (
    <div className="content-page">
      <motion.div 
        className="content-header"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Locate Support</h1>
        <p>Find local services, hospitals and community organisations near you</p>
      </motion.div>

      <div className="content-container">
        <motion.div 
          className="intro-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2>Local Support Services</h2>
          <p>
            Our local service directory is currently under development. We're working to provide 
            a comprehensive database of support services in your area.
          </p>
        </motion.div>

        <motion.div 
          className="help-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2>Need Help Finding Services?</h2>
          <p>Contact national helplines for referrals to local resources.</p>
          <div className="help-buttons">
            <Link to="/helplines" className="help-btn primary">National Helplines</Link>
            <Link to="/victim-dashboard" className="help-btn secondary">Get Support</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LocalServices;