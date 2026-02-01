import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './ContentPage.css';

const FinancialHelp = () => {
  return (
    <div className="content-page">
      <motion.div 
        className="content-header"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Financial Independence</h1>
        <p>Information about financial abuse and building financial stability</p>
      </motion.div>

      <div className="content-container">
        <motion.div 
          className="intro-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2>Building Financial Independence</h2>
          <p>
            This resource on financial independence and recovering from financial abuse 
            is currently under development. We're creating comprehensive guidance for survivors.
          </p>
        </motion.div>

        <motion.div 
          className="help-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2>Need Financial Support?</h2>
          <p>Connect with resources that can help with financial assistance and planning.</p>
          <div className="help-buttons">
            <Link to="/local-services" className="help-btn primary">Find Local Services</Link>
            <Link to="/victim-dashboard" className="help-btn secondary">Get Support</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FinancialHelp;