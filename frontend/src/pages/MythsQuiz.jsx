import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './ContentPage.css';

const MythsQuiz = () => {
  return (
    <div className="content-page">
      <motion.div 
        className="content-header"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Dispelling Myths</h1>
        <p>A short quiz to challenge common myths about domestic abuse</p>
      </motion.div>

      <div className="content-container">
        <motion.div 
          className="intro-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2>Myth-Busting Quiz</h2>
          <p>
            This interactive quiz is currently under development. It will help challenge common 
            misconceptions about domestic violence and intimate partner abuse.
          </p>
        </motion.div>

        <motion.div 
          className="help-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2>Learn More</h2>
          <p>While we develop this quiz, explore other educational resources.</p>
          <div className="help-buttons">
            <Link to="/forms-of-abuse" className="help-btn primary">Forms of Abuse</Link>
            <Link to="/warning-signs" className="help-btn secondary">Warning Signs</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MythsQuiz;