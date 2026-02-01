import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './ContentPage.css';

const FormsOfAbuse = () => {
  const abuseTypes = [
    {
      title: "Physical Abuse",
      description: "Any intentional use of physical force with the potential for causing death, disability, injury, or harm.",
      examples: [
        "Hitting, slapping, punching, or kicking",
        "Throwing objects or using weapons",
        "Restraining or confining against will",
        "Denying medical care or medication"
      ],
      warningSigns: [
        "Unexplained injuries or bruises",
        "Frequent 'accidents' or injuries",
        "Wearing clothing to hide injuries",
        "Fear of going home"
      ]
    },
    {
      title: "Emotional/Psychological Abuse",
      description: "A pattern of behavior that attacks a person's emotional development and sense of self-worth.",
      examples: [
        "Constant criticism, name-calling, or humiliation",
        "Threats of violence or abandonment",
        "Isolation from friends and family",
        "Extreme jealousy and possessiveness"
      ],
      warningSigns: [
        "Low self-esteem or depression",
        "Anxiety or fearfulness",
        "Withdrawal from social activities",
        "Changes in personality or behavior"
      ]
    },
    {
      title: "Sexual Abuse",
      description: "Any sexual activity without consent, including within marriage or intimate relationships.",
      examples: [
        "Forced sexual activity",
        "Sexual contact without consent",
        "Reproductive coercion",
        "Sexual humiliation or degradation"
      ],
      warningSigns: [
        "Fear of intimacy or sexual contact",
        "Unexplained sexually transmitted infections",
        "Torn or bloody undergarments",
        "Withdrawal from physical contact"
      ]
    },
    {
      title: "Financial Abuse",
      description: "Controlling a person's ability to acquire, use, and maintain financial resources.",
      examples: [
        "Preventing access to bank accounts",
        "Stealing money or benefits",
        "Forbidding employment or education",
        "Running up debt in partner's name"
      ],
      warningSigns: [
        "Lack of access to money or credit cards",
        "Unexplained financial problems",
        "Partner controls all finances",
        "Unable to work or attend school"
      ]
    },
    {
      title: "Digital Abuse",
      description: "Use of technology to harass, stalk, intimidate, or control a partner.",
      examples: [
        "Monitoring online activities and communications",
        "Sending threatening messages or emails",
        "Posting embarrassing photos without consent",
        "Using GPS to track location"
      ],
      warningSigns: [
        "Partner demands passwords to accounts",
        "Excessive monitoring of online activity",
        "Receiving threatening digital messages",
        "Feeling afraid to use technology freely"
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
        <h1>Forms of Abuse</h1>
        <p>Understanding different types of intimate partner violence and their warning signs</p>
      </motion.div>

      <div className="content-container">
        <motion.div 
          className="intro-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2>What is Intimate Partner Violence?</h2>
          <p>
            Intimate partner violence (IPV) is a pattern of behaviors used by one person to maintain power and control 
            over a current or former intimate partner. It can happen to anyone regardless of age, race, gender, 
            sexuality, religion, education, or economic status.
          </p>
        </motion.div>

        <div className="abuse-types-grid">
          {abuseTypes.map((type, index) => (
            <motion.div
              key={type.title}
              className="abuse-type-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(74, 50, 103, 0.15)" }}
            >
              <h3>{type.title}</h3>
              <p className="description">{type.description}</p>
              
              <div className="examples-section">
                <h4>Examples Include:</h4>
                <ul>
                  {type.examples.map((example, idx) => (
                    <li key={idx}>{example}</li>
                  ))}
                </ul>
              </div>

              <div className="warning-signs-section">
                <h4>Warning Signs:</h4>
                <ul>
                  {type.warningSigns.map((sign, idx) => (
                    <li key={idx}>{sign}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="help-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2>Need Help?</h2>
          <p>If you or someone you know is experiencing abuse, help is available.</p>
          <div className="help-buttons">
            <Link to="/victim-dashboard" className="help-btn primary">Get Support</Link>
            <Link to="/helplines" className="help-btn secondary">Crisis Helplines</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FormsOfAbuse;