import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './ContentPage.css';

const ConsentStories = () => {
  const consentPrinciples = [
    {
      title: "Consent is Ongoing",
      description: "Consent can be withdrawn at any time, even during intimate activity. It's not a one-time agreement.",
      example: "Sarah's Story: 'I learned that saying yes to one thing doesn't mean yes to everything. I have the right to change my mind at any moment.'"
    },
    {
      title: "Consent is Specific",
      description: "Agreeing to one activity doesn't mean agreeing to all activities. Each act requires its own consent.",
      example: "Maria's Story: 'My partner understood that consent to kissing didn't automatically mean consent to anything more. We talked about each step.'"
    },
    {
      title: "Consent is Enthusiastic",
      description: "True consent is given freely and enthusiastically, not reluctantly or under pressure.",
      example: "Alex's Story: 'I realized that 'I guess' or 'if you want to' weren't enthusiastic consent. Real consent feels good and excited.'"
    },
    {
      title: "Consent Cannot Be Given Under Influence",
      description: "Someone who is intoxicated, drugged, or impaired cannot give valid consent.",
      example: "Jamie's Story: 'I learned that being drunk meant I couldn't consent. A caring partner waits until both people are sober.'"
    }
  ];

  const survivorStories = [
    {
      name: "Emma",
      age: "28",
      story: "I thought that because we were married, I didn't have the right to say no. It took me years to understand that marriage doesn't mean automatic consent. My body is still mine, and I have the right to decide what happens to it.",
      lesson: "Marriage or relationship status doesn't eliminate the need for consent."
    },
    {
      name: "David",
      age: "24",
      story: "My girlfriend would pressure me by saying things like 'if you loved me, you would.' I felt guilty and confused. I learned that love doesn't mean you owe someone sexual activity. Real love respects boundaries.",
      lesson: "Emotional manipulation is not consent. Love includes respecting 'no.'"
    },
    {
      name: "Priya",
      age: "31",
      story: "I was afraid to say no because my partner would get angry or give me the silent treatment. I learned that fear-based compliance isn't consent. Healthy relationships don't punish you for having boundaries.",
      lesson: "Consent given out of fear is not true consent."
    },
    {
      name: "Michael",
      age: "26",
      story: "I thought that if someone didn't physically fight back, it meant they consented. I was wrong. Silence, freezing, or not resisting doesn't equal consent. Only an enthusiastic 'yes' means yes.",
      lesson: "Absence of 'no' doesn't mean 'yes.' Look for enthusiastic agreement."
    }
  ];

  const mythsAndFacts = [
    {
      myth: "If someone doesn't say 'no,' it means they consent.",
      fact: "Consent requires a clear 'yes.' Silence, lack of resistance, or being unable to respond doesn't equal consent."
    },
    {
      myth: "You can't withdraw consent once you've started.",
      fact: "Consent can be withdrawn at any time, even in the middle of sexual activity. Everyone has the right to stop."
    },
    {
      myth: "If you've consented before, you've consented for the future.",
      fact: "Past consent doesn't guarantee future consent. Each encounter requires fresh, ongoing consent."
    },
    {
      myth: "Consent isn't needed in committed relationships or marriage.",
      fact: "Consent is always required, regardless of relationship status. Marriage is not a contract for unlimited sexual access."
    },
    {
      myth: "If someone is dressed provocatively, they're consenting.",
      fact: "Clothing choices never indicate consent. How someone dresses has nothing to do with their willingness to engage in sexual activity."
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
        <h1>Stories of Sexual Consent</h1>
        <p>Understand consent and your rights through survivor stories</p>
      </motion.div>

      <div className="content-container">
        <motion.div 
          className="intro-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2>Understanding Sexual Consent</h2>
          <p>
            Sexual consent is an agreement between participants to engage in sexual activity. It must be freely given, 
            ongoing, and can be withdrawn at any time. These stories from survivors help illustrate what consent 
            looks like and what it doesn't look like in real relationships.
          </p>
        </motion.div>

        <div className="info-box">
          <h3>💙 What is Consent?</h3>
          <p>
            Consent is a clear, voluntary agreement to engage in sexual activity. It's about communication, respect, 
            and ensuring that everyone involved feels safe and comfortable. Consent is not just the absence of "no" 
            – it's the presence of an enthusiastic "yes."
          </p>
        </div>

        <div className="principles-section">
          <h2>Key Principles of Consent</h2>
          <div className="principles-grid">
            {consentPrinciples.map((principle, index) => (
              <motion.div
                key={principle.title}
                className="principle-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(74, 50, 103, 0.15)" }}
              >
                <h3>{principle.title}</h3>
                <p className="principle-description">{principle.description}</p>
                <div className="example-box">
                  <strong>Real Story:</strong>
                  <p>{principle.example}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
          className="survivor-stories-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <h2>Survivor Stories</h2>
          <p className="section-intro">
            These stories are shared by survivors to help others understand consent and recognize when boundaries are violated. 
            Names have been changed to protect privacy.
          </p>
          
          <div className="stories-grid">
            {survivorStories.map((story, index) => (
              <motion.div
                key={story.name}
                className="story-card"
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
              >
                <div className="story-header">
                  <h4>{story.name}, {story.age}</h4>
                </div>
                <blockquote>"{story.story}"</blockquote>
                <div className="lesson-learned">
                  <strong>Key Lesson:</strong> {story.lesson}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="myths-facts-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <h2>Myths vs. Facts About Consent</h2>
          <div className="myths-facts-grid">
            {mythsAndFacts.map((item, index) => (
              <motion.div
                key={index}
                className="myth-fact-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 + 1.0 }}
              >
                <div className="myth-section">
                  <h4>❌ Myth</h4>
                  <p>{item.myth}</p>
                </div>
                <div className="fact-section">
                  <h4>✅ Fact</h4>
                  <p>{item.fact}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="resources-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <h2>Resources for Sexual Assault Survivors</h2>
          <div className="resource-cards">
            <div className="resource-card">
              <h4>RAINN National Sexual Assault Hotline</h4>
              <p>Free, confidential support 24/7 for survivors of sexual assault.</p>
              <div className="contact-info">
                <strong>Phone:</strong> 1-800-656-4673<br/>
                <strong>Chat:</strong> rainn.org
              </div>
            </div>
            <div className="resource-card">
              <h4>National Sexual Violence Resource Center</h4>
              <p>Information and resources about sexual violence prevention and response.</p>
              <div className="contact-info">
                <strong>Website:</strong> nsvrc.org
              </div>
            </div>
            <div className="resource-card">
              <h4>Love is Respect</h4>
              <p>Resources about healthy relationships and consent for teens and young adults.</p>
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
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          <h2>Need Support?</h2>
          <p>If you've experienced sexual violence or have questions about consent, help is available.</p>
          <div className="help-buttons">
            <Link to="/victim-dashboard" className="help-btn primary">Get Support</Link>
            <Link to="/helplines" className="help-btn secondary">Crisis Resources</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ConsentStories;