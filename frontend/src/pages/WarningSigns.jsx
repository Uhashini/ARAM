import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './ContentPage.css';

const WarningSigns = () => {
  const warningCategories = [
    {
      title: "Behavioral Control",
      icon: "🎭",
      color: "warning",
      signs: [
        "Tells you what you can and cannot do",
        "Checks up on you constantly or follows you",
        "Prevents you from seeing friends or family",
        "Gets angry when you don't follow their 'rules'",
        "Makes all the decisions in the relationship",
        "Treats you like a possession rather than a person",
        "Demands to know where you are at all times",
        "Controls your daily activities and schedule"
      ]
    },
    {
      title: "Emotional Manipulation",
      icon: "💔",
      color: "danger",
      signs: [
        "Puts you down or makes you feel bad about yourself",
        "Calls you names or humiliates you",
        "Makes you feel like you're 'crazy' or imagining things",
        "Blames you for their abusive behavior",
        "Threatens to hurt you, themselves, or others",
        "Uses guilt trips to control your behavior",
        "Gives you the silent treatment as punishment",
        "Makes you feel like you can't do anything right"
      ]
    },
    {
      title: "Physical Warning Signs",
      icon: "🚨",
      color: "alert",
      signs: [
        "Pushes, hits, slaps, or physically hurts you",
        "Throws objects or punches walls when angry",
        "Restrains you or blocks your path",
        "Drives recklessly to scare you",
        "Destroys your belongings",
        "Hurts or threatens to hurt pets",
        "Uses their size or strength to intimidate you",
        "Prevents you from leaving during arguments"
      ]
    },
    {
      title: "Financial Control",
      icon: "💰",
      color: "info",
      signs: [
        "Controls all the money and financial decisions",
        "Prevents you from working or sabotages your job",
        "Steals your money or benefits",
        "Hides financial information from you",
        "Runs up debt in your name",
        "Refuses to let you have access to bank accounts",
        "Uses money to control your behavior",
        "Makes you account for every penny you spend"
      ]
    },
    {
      title: "Sexual Coercion",
      icon: "⚠️",
      color: "warning",
      signs: [
        "Pressures you into sexual activity",
        "Forces you to do sexual things you don't want to do",
        "Refuses to use protection or sabotages birth control",
        "Uses sex as a way to 'make up' after abuse",
        "Makes you feel guilty for saying no to sex",
        "Shares intimate photos without your consent",
        "Accuses you of cheating without reason",
        "Treats you like a sexual object rather than a person"
      ]
    },
    {
      title: "Digital Abuse",
      icon: "📱",
      color: "tech",
      signs: [
        "Monitors your phone, computer, or social media",
        "Demands passwords to all your accounts",
        "Sends you excessive texts or calls",
        "Uses GPS to track your location",
        "Posts embarrassing things about you online",
        "Threatens to share private information",
        "Creates fake accounts to harass you",
        "Controls your access to technology"
      ]
    }
  ];

  const escalationSigns = [
    "Violence is becoming more frequent or severe",
    "Partner talks about or threatens suicide",
    "Partner becomes increasingly jealous or possessive",
    "Partner begins stalking behaviors",
    "Partner threatens to kill you, your children, or pets",
    "Partner has access to weapons",
    "You feel like you're walking on eggshells constantly",
    "Partner isolates you from all support systems"
  ];

  const physicalInjuries = [
    {
      type: "Suspicious Injuries",
      examples: [
        "Bruises in the shape of fingers or hands",
        "Black eyes or facial injuries",
        "Injuries that don't match the explanation given",
        "Multiple injuries in different stages of healing",
        "Injuries to areas usually covered by clothing"
      ]
    },
    {
      type: "Behavioral Changes",
      examples: [
        "Wearing clothing to cover injuries",
        "Frequent 'accidents' or clumsiness",
        "Avoiding medical care or delaying treatment",
        "Partner always accompanies them to appointments",
        "Seems afraid or anxious around their partner"
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
        <h1>Warning Signs of Abuse</h1>
        <p>Learn about behavior patterns, injuries, and controlling actions that may signal abuse</p>
      </motion.div>

      <div className="content-container">
        <motion.div 
          className="intro-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2>Recognizing the Signs</h2>
          <p>
            Abuse often starts small and gradually escalates. It can be difficult to recognize, especially when 
            you're in the relationship. These warning signs can help you identify potentially abusive behavior 
            patterns, whether in your own relationship or someone else's.
          </p>
        </motion.div>

        <div className="warning-box">
          <h3>⚠️ Trust Your Instincts</h3>
          <p>
            If something feels wrong in your relationship, trust that feeling. You know your situation better 
            than anyone else. If you're afraid of your partner or feel like you're walking on eggshells, 
            these are serious warning signs.
          </p>
        </div>

        <div className="warning-signs-section">
          <h2>Types of Warning Signs</h2>
          <div className="warning-signs-grid">
            {warningCategories.map((category, index) => (
              <motion.div
                key={category.title}
                className={`warning-category-card ${category.color}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(74, 50, 103, 0.15)" }}
              >
                <div className="category-header">
                  <span className="category-icon">{category.icon}</span>
                  <h3>{category.title}</h3>
                </div>
                <ul className="warning-signs-list">
                  {category.signs.map((sign, idx) => (
                    <li key={idx}>{sign}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
          className="escalation-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2>Signs of Escalating Danger</h2>
          <div className="warning-box">
            <h3>🚨 Immediate Danger Signs</h3>
            <p>These signs indicate that violence may be escalating and immediate safety planning is crucial:</p>
            <ul>
              {escalationSigns.map((sign, index) => (
                <li key={index}>{sign}</li>
              ))}
            </ul>
            <p><strong>If you recognize these signs, please reach out for help immediately.</strong></p>
          </div>
        </motion.div>

        <motion.div 
          className="physical-signs-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <h2>Physical Signs to Watch For</h2>
          <div className="physical-signs-grid">
            {physicalInjuries.map((category, index) => (
              <div key={category.type} className="physical-signs-card">
                <h3>{category.type}</h3>
                <ul>
                  {category.examples.map((example, idx) => (
                    <li key={idx}>{example}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="cycle-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <h2>The Cycle of Abuse</h2>
          <div className="info-box">
            <h3>Understanding the Pattern</h3>
            <p>Abuse often follows a predictable cycle:</p>
            <ol className="cycle-list">
              <li><strong>Tension Building:</strong> Walking on eggshells, minor incidents, fear of triggering abuse</li>
              <li><strong>Acute Abuse:</strong> Physical, emotional, sexual, or psychological abuse occurs</li>
              <li><strong>Reconciliation:</strong> Apologies, promises to change, gifts, affection ("honeymoon phase")</li>
              <li><strong>Calm:</strong> Period of relative peace, victim may hope abuse won't happen again</li>
            </ol>
            <p>This cycle often repeats and typically escalates over time, with the abuse becoming more frequent and severe.</p>
          </div>
        </motion.div>

        <motion.div 
          className="resources-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <h2>Get Help Recognizing Abuse</h2>
          <div className="resource-cards">
            <div className="resource-card">
              <h4>National Domestic Violence Hotline</h4>
              <p>Confidential support and safety planning available 24/7.</p>
              <div className="contact-info">
                <strong>Phone:</strong> 1-800-799-7233<br/>
                <strong>Text:</strong> START to 88788<br/>
                <strong>Chat:</strong> thehotline.org
              </div>
            </div>
            <div className="resource-card">
              <h4>Love is Respect</h4>
              <p>Information about healthy vs. unhealthy relationship behaviors.</p>
              <div className="contact-info">
                <strong>Phone:</strong> 1-866-331-9474<br/>
                <strong>Text:</strong> LOVEIS to 22522<br/>
                <strong>Website:</strong> loveisrespect.org
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
          <h2>Concerned About Your Safety?</h2>
          <p>If you recognize these warning signs in your relationship, help and support are available.</p>
          <div className="help-buttons">
            <Link to="/self-checks" className="help-btn primary">Take Self Assessment</Link>
            <Link to="/victim-dashboard" className="help-btn secondary">Get Support</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WarningSigns;