import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './ContentPage.css';

const Resources = () => {
  return (
    <div className="content-page">
      <motion.div 
        className="content-header"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Resources</h1>
        <p>Extra reading, legal information and wellbeing resources</p>
      </motion.div>

      <div className="content-container">
        <motion.div 
          className="intro-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2>Additional Resources</h2>
          <p>
            Our comprehensive resource library is currently under development. We're compiling 
            legal information, educational materials, and wellbeing resources for survivors.
          </p>
        </motion.div>

        <motion.div 
          className="help-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2>Explore Available Resources</h2>
          <p>While we develop this section, explore our other educational content.</p>
          <div className="help-buttons">
            <Link to="/forms-of-abuse" className="help-btn primary">Forms of Abuse</Link>
            <Link to="/online-safety" className="help-btn secondary">Online Safety</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Resources;