import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './ContentPage.css';

const OnlineSafety = () => {
  const safetyTips = [
    {
      category: "Device Security",
      icon: "📱",
      tips: [
        "Use strong, unique passwords for all accounts",
        "Enable two-factor authentication when available",
        "Keep your devices locked with PINs or biometric security",
        "Regularly update your operating system and apps",
        "Use private browsing mode when researching sensitive topics",
        "Clear your browser history and cache regularly"
      ]
    },
    {
      category: "Social Media Privacy",
      icon: "🔒",
      tips: [
        "Review and adjust privacy settings on all social media accounts",
        "Limit who can see your posts, photos, and personal information",
        "Turn off location sharing and geotagging",
        "Be cautious about checking in at locations",
        "Remove or limit personal information in your profiles",
        "Block or unfriend people who make you uncomfortable"
      ]
    },
    {
      category: "Communication Safety",
      icon: "💬",
      tips: [
        "Use secure messaging apps with end-to-end encryption",
        "Create separate email accounts for sensitive communications",
        "Be aware that texts and emails can be monitored",
        "Use code words with trusted friends and family",
        "Consider using public computers for sensitive research",
        "Delete sensitive messages after reading them"
      ]
    },
    {
      category: "Financial Security",
      icon: "💳",
      tips: [
        "Monitor your bank and credit card statements regularly",
        "Set up account alerts for transactions",
        "Use different passwords for financial accounts",
        "Consider opening a separate, private bank account",
        "Check your credit report for unauthorized accounts",
        "Keep important financial documents in a safe place"
      ]
    }
  ];

  const digitalAbuseWarnings = [
    "Partner demands passwords to your accounts",
    "Excessive monitoring of your online activities",
    "Receiving threatening messages or emails",
    "Finding spyware or tracking apps on your devices",
    "Partner controls your access to technology",
    "Harassment through social media or dating apps",
    "Sharing intimate images without consent",
    "Using GPS to track your location without permission"
  ];

  const emergencySteps = [
    {
      title: "If You Think Your Device is Compromised",
      steps: [
        "Use a different device or computer to research help",
        "Change passwords from a safe location",
        "Check for unknown apps or software on your device",
        "Consider getting a new phone or email account",
        "Document evidence of digital abuse if safe to do so"
      ]
    },
    {
      title: "Creating a Safety Plan",
      steps: [
        "Identify safe devices and locations to use",
        "Create secure communication methods with trusted contacts",
        "Keep important documents and information in a safe place",
        "Plan how to quickly delete browsing history if needed",
        "Know how to quickly contact emergency services"
      ]
    }
  ];

  return (
    <div className="content-page">
      <motion.div 
        className="content-header"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Online Safety</h1>
        <p>Tips to protect your devices, accounts, and online activity</p>
      </motion.div>

      <div className="content-container">
        <motion.div 
          className="intro-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2>Digital Safety and Privacy</h2>
          <p>
            In today's connected world, abusers often use technology to monitor, control, and harass their victims. 
            Digital abuse can include monitoring your online activities, stealing passwords, tracking your location, 
            or using technology to threaten or intimidate you. Here are ways to protect yourself online.
          </p>
        </motion.div>

        <div className="warning-box">
          <h3>⚠️ Important Safety Note</h3>
          <p>
            If you think your devices are being monitored, use a computer or device that your abuser doesn't have 
            access to, such as one at a library, friend's house, or workplace. Consider clearing your browser 
            history after visiting this site.
          </p>
        </div>

        <div className="safety-tips-section">
          <h2>Digital Safety Tips</h2>
          <div className="safety-tips-grid">
            {safetyTips.map((category, index) => (
              <motion.div
                key={category.category}
                className="safety-tip-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(74, 50, 103, 0.15)" }}
              >
                <div className="category-header">
                  <span className="category-icon">{category.icon}</span>
                  <h3>{category.category}</h3>
                </div>
                <ul>
                  {category.tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
          className="digital-abuse-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <h2>Signs of Digital Abuse</h2>
          <div className="info-box">
            <h3>🚨 Warning Signs</h3>
            <p>You might be experiencing digital abuse if you notice any of these signs:</p>
            <ul>
              {digitalAbuseWarnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div 
          className="emergency-steps-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <h2>Emergency Digital Safety Steps</h2>
          <div className="emergency-steps-grid">
            {emergencySteps.map((section, index) => (
              <div key={section.title} className="emergency-step-card">
                <h3>{section.title}</h3>
                <ol>
                  {section.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="resources-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <h2>Digital Safety Resources</h2>
          <div className="resource-cards">
            <div className="resource-card">
              <h4>Safety Net Project</h4>
              <p>Technology safety resources and training for survivors of domestic violence.</p>
              <div className="contact-info">
                <strong>Website:</strong> nnedv.org/content/technology-safety/
              </div>
            </div>
            <div className="resource-card">
              <h4>Cyber Civil Rights Initiative</h4>
              <p>Resources for victims of non-consensual intimate image sharing and online abuse.</p>
              <div className="contact-info">
                <strong>Website:</strong> cybercivilrights.org<br/>
                <strong>Helpline:</strong> 844-878-2274
              </div>
            </div>
            <div className="resource-card">
              <h4>Digital Security Helpline</h4>
              <p>Free, confidential digital security help for civil society organizations and activists.</p>
              <div className="contact-info">
                <strong>Website:</strong> digitalsecurityhelpline.org
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="help-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          <h2>Need Help with Digital Safety?</h2>
          <p>If you're experiencing digital abuse or need help securing your devices and accounts.</p>
          <div className="help-buttons">
            <Link to="/victim-dashboard" className="help-btn primary">Get Support</Link>
            <Link to="/helplines" className="help-btn secondary">Crisis Helplines</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OnlineSafety;