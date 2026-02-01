import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './ContentPage.css';

const HelpingOthers = () => {
  const helpingSteps = [
    {
      title: "Listen Without Judgment",
      description: "Create a safe space for them to share their experiences. Avoid asking 'why' questions that might seem blaming.",
      tips: [
        "Say: 'I believe you' and 'This isn't your fault'",
        "Listen more than you speak",
        "Don't pressure them to leave or take specific actions",
        "Respect their decisions, even if you disagree"
      ]
    },
    {
      title: "Learn the Warning Signs",
      description: "Understanding the signs of abuse can help you recognize when someone needs support.",
      tips: [
        "Physical injuries that don't match explanations",
        "Changes in behavior, personality, or appearance",
        "Isolation from friends and family",
        "Fear of their partner or excessive concern about pleasing them"
      ]
    },
    {
      title: "Offer Practical Support",
      description: "Small gestures can make a big difference in someone's life.",
      tips: [
        "Help them create a safety plan",
        "Offer to accompany them to appointments or court",
        "Help them document incidents (photos, dates, details)",
        "Provide a safe place to store important documents"
      ]
    },
    {
      title: "Connect Them to Resources",
      description: "Help them find professional support and services in their area.",
      tips: [
        "Research local domestic violence organizations",
        "Help them contact the National Domestic Violence Hotline",
        "Assist with finding legal aid or counseling services",
        "Help them understand their options without pressuring"
      ]
    },
    {
      title: "Stay Connected",
      description: "Maintain the relationship even if they're not ready to leave.",
      tips: [
        "Check in regularly through safe communication methods",
        "Respect their privacy and safety concerns",
        "Be patient - leaving an abusive relationship takes time",
        "Continue to be supportive even if they return to the abuser"
      ]
    },
    {
      title: "Take Care of Yourself",
      description: "Supporting someone in an abusive relationship can be emotionally draining.",
      tips: [
        "Set healthy boundaries for yourself",
        "Seek support from friends, family, or counselors",
        "Remember you can't 'save' someone - they must make their own choices",
        "Don't neglect your own mental health and well-being"
      ]
    }
  ];

  const dosDonts = {
    dos: [
      "Believe them and validate their feelings",
      "Respect their autonomy and decisions",
      "Help them develop a safety plan",
      "Document evidence if they want to",
      "Connect them with professional resources",
      "Be patient and supportive",
      "Keep information confidential",
      "Learn about domestic violence"
    ],
    donts: [
      "Don't judge or blame them",
      "Don't pressure them to leave",
      "Don't confront the abuser",
      "Don't give ultimatums",
      "Don't make decisions for them",
      "Don't promise to keep secrets about immediate danger",
      "Don't investigate or spy on the abuser",
      "Don't take control of the situation"
    ]
  };

  return (
    <div className="content-page">
      <motion.div 
        className="content-header"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Helping a Family Member or Friend</h1>
        <p>Simple, safe ways to support someone you think might be experiencing abuse</p>
      </motion.div>

      <div className="content-container">
        <motion.div 
          className="intro-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2>How to Help Someone You Care About</h2>
          <p>
            If you suspect someone you care about is being abused, your support can make a life-changing difference. 
            However, it's important to approach the situation carefully and safely. Here's how you can help while 
            respecting their autonomy and keeping everyone safe.
          </p>
        </motion.div>

        <div className="warning-box">
          <h3>⚠️ Safety First</h3>
          <p>
            Never confront the abuser directly. This can escalate the violence and put both you and the victim in danger. 
            Always prioritize safety over everything else.
          </p>
        </div>

        <div className="steps-section">
          <h2>Steps to Help Safely</h2>
          <ol className="steps-list">
            {helpingSteps.map((step, index) => (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
              >
                <h4>{step.title}</h4>
                <p>{step.description}</p>
                <ul>
                  {step.tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </motion.li>
            ))}
          </ol>
        </div>

        <motion.div 
          className="dos-donts-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2>Do's and Don'ts</h2>
          <div className="dos-donts-grid">
            <div className="dos-section">
              <div className="success-box">
                <h3>✅ DO</h3>
                <ul>
                  {dosDonts.dos.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="donts-section">
              <div className="warning-box">
                <h3>❌ DON'T</h3>
                <ul>
                  {dosDonts.donts.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="resources-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <h2>Resources for Supporters</h2>
          <div className="resource-cards">
            <div className="resource-card">
              <h4>National Domestic Violence Hotline</h4>
              <p>24/7 confidential support for victims and those who want to help them.</p>
              <div className="contact-info">
                <strong>Phone:</strong> 1-800-799-7233<br/>
                <strong>Text:</strong> START to 88788<br/>
                <strong>Chat:</strong> thehotline.org
              </div>
            </div>
            <div className="resource-card">
              <h4>RAINN National Sexual Assault Hotline</h4>
              <p>Support for sexual assault survivors and their loved ones.</p>
              <div className="contact-info">
                <strong>Phone:</strong> 1-800-656-4673<br/>
                <strong>Chat:</strong> rainn.org
              </div>
            </div>
            <div className="resource-card">
              <h4>Crisis Text Line</h4>
              <p>Free, 24/7 crisis support via text message.</p>
              <div className="contact-info">
                <strong>Text:</strong> HOME to 741741
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="help-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <h2>Need More Guidance?</h2>
          <p>Supporting someone through abuse can be challenging. Don't hesitate to seek guidance for yourself.</p>
          <div className="help-buttons">
            <Link to="/support-types" className="help-btn primary">Find Support Services</Link>
            <Link to="/helplines" className="help-btn secondary">Crisis Resources</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HelpingOthers;