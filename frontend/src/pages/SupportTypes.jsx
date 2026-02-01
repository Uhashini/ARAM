import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './ContentPage.css';

const SupportTypes = () => {
  return (
    <div className="content-page">
      <motion.div 
        className="content-header"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Types of Support</h1>
        <p>Learn about shelters, counselling, legal support and other services</p>
      </motion.div>

      <div className="content-container">
        <motion.div 
          className="intro-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2>Available Support Services</h2>
          <p>
            This comprehensive guide to support services is currently under development. 
            We're working to provide detailed information about different types of help available.
          </p>
        </motion.div>

        <motion.div 
          className="help-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2>Need Support Now?</h2>
          <p>Connect with support services and resources immediately.</p>
          <div className="help-buttons">
            <Link to="/victim-dashboard" className="help-btn primary">Get Support</Link>
            <Link to="/helplines" className="help-btn secondary">Crisis Helplines</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SupportTypes;