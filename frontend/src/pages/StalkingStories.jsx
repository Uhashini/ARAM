import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './ContentPage.css';

const StalkingStories = () => {
  return (
    <div className="content-page">
      <motion.div 
        className="content-header"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Stories of Stalking and Harassment</h1>
        <p>Learn about stalking, harassment and your legal options</p>
      </motion.div>

      <div className="content-container">
        <motion.div 
          className="intro-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2>Understanding Stalking and Harassment</h2>
          <p>
            This page is currently under development. We're working to provide comprehensive information 
            about stalking behaviors, survivor stories, and legal options available to victims.
          </p>
        </motion.div>

        <motion.div 
          className="help-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2>Need Immediate Help?</h2>
          <p>If you're experiencing stalking or harassment, support is available now.</p>
          <div className="help-buttons">
            <Link to="/victim-dashboard" className="help-btn primary">Get Support</Link>
            <Link to="/helplines" className="help-btn secondary">Crisis Helplines</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StalkingStories;