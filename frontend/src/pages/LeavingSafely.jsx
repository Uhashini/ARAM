import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './ContentPage.css';

const LeavingSafely = () => {
  const safetyPlanSteps = [
    {
      title: "Plan Your Exit Strategy",
      description: "Prepare for leaving safely when the time is right",
      steps: [
        "Identify the safest time to leave (when your partner is away)",
        "Plan your route and transportation in advance",
        "Have a backup plan if your first option doesn't work",
        "Practice your exit plan so you can act quickly if needed",
        "Keep your plans confidential - only tell trusted people",
        "Consider leaving during a normal routine to avoid suspicion"
      ]
    },
    {
      title: "Gather Important Documents",
      description: "Collect essential paperwork before you leave",
      steps: [
        "Birth certificates (yours and your children's)",
        "Social Security cards",
        "Driver's license or state ID",
        "Passport or immigration documents",
        "Insurance policies and cards",
        "Bank account information and credit cards",
        "Lease agreements or mortgage papers",
        "Medical records and prescription information",
        "School records for children",
        "Legal documents (restraining orders, custody papers)"
      ]
    },
    {
      title: "Secure Financial Resources",
      description: "Ensure you have access to money and financial independence",
      steps: [
        "Open a separate bank account in your name only",
        "Save money gradually in a safe place",
        "Keep cash hidden in a secure location",
        "Make copies of financial documents",
        "Know your partner's Social Security number for legal proceedings",
        "Document any financial abuse or control",
        "Research financial assistance programs",
        "Consider having trusted friends hold money for you"
      ]
    },
    {
      title: "Prepare Emergency Supplies",
      description: "Pack essential items you'll need immediately after leaving",
      steps: [
        "Several changes of clothes for you and your children",
        "Medications and medical supplies",
        "Keys to house, car, and work",
        "Cell phone and charger",
        "Emergency contact list",
        "Comfort items for children (toys, blankets)",
        "Personal hygiene items",
        "Important phone numbers written down"
      ]
    },
    {
      title: "Establish Safe Communication",
      description: "Set up secure ways to communicate and get help",
      steps: [
        "Memorize important phone numbers",
        "Create code words with trusted friends/family",
        "Set up a separate email account your partner doesn't know about",
        "Use a phone your partner doesn't have access to",
        "Let trusted people know your situation and plans",
        "Establish check-in times with your support network",
        "Know how to quickly contact emergency services"
      ]
    },
    {
      title: "Find Safe Housing",
      description: "Arrange a safe place to stay after leaving",
      steps: [
        "Contact local domestic violence shelters",
        "Arrange to stay with trusted friends or family",
        "Research transitional housing programs",
        "Look into temporary housing assistance",
        "Consider staying in a different city if necessary",
        "Have multiple housing options as backup plans",
        "Ensure your location will remain confidential"
      ]
    }
  ];

  const immediateSteps = [
    "Call 911 if you're in immediate danger",
    "Go to a safe location (friend's house, shelter, public place)",
    "Seek medical attention if you're injured",
    "Contact the National Domestic Violence Hotline: 1-800-799-7233",
    "File a police report if you choose to",
    "Apply for a restraining order or protection order",
    "Change locks if you're staying in your home",
    "Inform trusted people about your situation"
  ];

  const childrenConsiderations = [
    "Talk to children about safety in age-appropriate ways",
    "Teach children how to call 911",
    "Identify safe adults children can go to for help",
    "Pack comfort items and favorite toys",
    "Gather school and medical records",
    "Consider the impact of changing schools",
    "Plan for childcare during legal proceedings",
    "Seek counseling support for children"
  ];

  const legalSteps = [
    "Document all incidents of abuse with dates and details",
    "Take photos of injuries and property damage",
    "Save threatening messages, emails, or voicemails",
    "Get copies of police reports",
    "Apply for a restraining order or protection order",
    "Consult with a domestic violence attorney",
    "File for divorce or separation if married",
    "Establish custody arrangements for children",
    "Change your will and beneficiaries",
    "Update emergency contacts at work and school"
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
        <h1>Leaving an Abusive Relationship</h1>
        <p>Step-by-step planning and safety tips if you are thinking about leaving</p>
      </motion.div>

      <div className="content-container">
        <motion.div 
          className="intro-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2>Planning to Leave Safely</h2>
          <p>
            Leaving an abusive relationship is often the most dangerous time for survivors. Careful planning 
            can help increase your safety and the likelihood of successfully leaving. Remember, you know your 
            situation best - trust your instincts about timing and safety.
          </p>
        </motion.div>

        <div className="warning-box">
          <h3>⚠️ Safety First</h3>
          <p>
            The period during and after leaving an abusive relationship can be the most dangerous time. 
            Statistics show that the risk of serious injury or death increases significantly when leaving. 
            Please work with domestic violence professionals to create a comprehensive safety plan.
          </p>
        </div>

        <div className="safety-plan-section">
          <h2>Creating Your Safety Plan</h2>
          <div className="safety-plan-grid">
            {safetyPlanSteps.map((step, index) => (
              <motion.div
                key={step.title}
                className="safety-plan-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(74, 50, 103, 0.15)" }}
              >
                <div className="step-number">{index + 1}</div>
                <h3>{step.title}</h3>
                <p className="step-description">{step.description}</p>
                <ul className="step-list">
                  {step.steps.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
          className="immediate-steps-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2>Immediate Steps After Leaving</h2>
          <div className="success-box">
            <h3>✅ First 24-48 Hours</h3>
            <p>Once you've left, these steps can help ensure your continued safety:</p>
            <ol className="immediate-steps-list">
              {immediateSteps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        </motion.div>

        <motion.div 
          className="children-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <h2>Special Considerations for Children</h2>
          <div className="info-box">
            <h3>👶 Protecting Your Children</h3>
            <p>If you have children, additional planning is needed to ensure their safety:</p>
            <ul>
              {childrenConsiderations.map((consideration, index) => (
                <li key={index}>{consideration}</li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div 
          className="legal-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <h2>Legal Protection Steps</h2>
          <div className="legal-steps-grid">
            <div className="legal-card">
              <h3>Documentation and Evidence</h3>
              <ul>
                {legalSteps.slice(0, 4).map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
            <div className="legal-card">
              <h3>Legal Actions</h3>
              <ul>
                {legalSteps.slice(4).map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="resources-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <h2>Resources for Leaving Safely</h2>
          <div className="resource-cards">
            <div className="resource-card">
              <h4>National Domestic Violence Hotline</h4>
              <p>24/7 confidential support and safety planning assistance.</p>
              <div className="contact-info">
                <strong>Phone:</strong> 1-800-799-7233<br/>
                <strong>Text:</strong> START to 88788<br/>
                <strong>Chat:</strong> thehotline.org
              </div>
            </div>
            <div className="resource-card">
              <h4>National Sexual Assault Hotline</h4>
              <p>Support for survivors of sexual violence.</p>
              <div className="contact-info">
                <strong>Phone:</strong> 1-800-656-4673<br/>
                <strong>Chat:</strong> rainn.org
              </div>
            </div>
            <div className="resource-card">
              <h4>Legal Aid</h4>
              <p>Find free or low-cost legal assistance in your area.</p>
              <div className="contact-info">
                <strong>Website:</strong> lawhelp.org<br/>
                <strong>Phone:</strong> Contact local legal aid society
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="help-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          <h2>Ready to Create Your Safety Plan?</h2>
          <p>Professional advocates can help you create a personalized safety plan for your situation.</p>
          <div className="help-buttons">
            <Link to="/victim-dashboard" className="help-btn primary">Get Professional Help</Link>
            <Link to="/local-services" className="help-btn secondary">Find Local Services</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LeavingSafely;