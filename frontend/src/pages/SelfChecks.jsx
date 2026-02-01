import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './ContentPage.css';

const SelfChecks = () => {
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [responses, setResponses] = useState({});
  const [showResults, setShowResults] = useState(false);

  const assessments = [
    {
      id: 'relationship',
      title: 'Relationship Health Assessment',
      description: 'Evaluate the health and safety of your current or past relationship',
      questions: [
        {
          id: 'q1',
          text: 'Does your partner get angry when you spend time with friends or family?',
          weight: 2
        },
        {
          id: 'q2',
          text: 'Are you afraid of your partner\'s temper?',
          weight: 3
        },
        {
          id: 'q3',
          text: 'Does your partner control your money or prevent you from working?',
          weight: 2
        },
        {
          id: 'q4',
          text: 'Has your partner ever threatened to hurt you or someone you care about?',
          weight: 3
        },
        {
          id: 'q5',
          text: 'Does your partner check up on you constantly or follow you?',
          weight: 2
        },
        {
          id: 'q6',
          text: 'Has your partner ever forced you to do sexual things you didn\'t want to do?',
          weight: 3
        },
        {
          id: 'q7',
          text: 'Do you feel like you\'re walking on eggshells around your partner?',
          weight: 2
        },
        {
          id: 'q8',
          text: 'Has your partner ever hit, slapped, pushed, or physically hurt you?',
          weight: 3
        },
        {
          id: 'q9',
          text: 'Does your partner put you down or make you feel bad about yourself?',
          weight: 2
        },
        {
          id: 'q10',
          text: 'Do you feel isolated from friends and family because of your relationship?',
          weight: 2
        }
      ]
    },
    {
      id: 'safety',
      title: 'Personal Safety Assessment',
      description: 'Assess your current safety situation and risk factors',
      questions: [
        {
          id: 's1',
          text: 'Do you have a safe place to go if you need to leave quickly?',
          weight: -2,
          reverse: true
        },
        {
          id: 's2',
          text: 'Are you able to contact friends or family without your partner monitoring?',
          weight: -1,
          reverse: true
        },
        {
          id: 's3',
          text: 'Has the violence or threats increased in frequency or severity?',
          weight: 3
        },
        {
          id: 's4',
          text: 'Does your partner have access to weapons?',
          weight: 3
        },
        {
          id: 's5',
          text: 'Has your partner threatened to kill you, your children, or pets?',
          weight: 4
        },
        {
          id: 's6',
          text: 'Do you have access to important documents (ID, passport, etc.)?',
          weight: -1,
          reverse: true
        },
        {
          id: 's7',
          text: 'Has your partner ever tried to strangle or choke you?',
          weight: 4
        },
        {
          id: 's8',
          text: 'Are you able to make decisions about your daily activities?',
          weight: -1,
          reverse: true
        }
      ]
    }
  ];

  const handleAssessmentSelect = (assessment) => {
    setCurrentAssessment(assessment);
    setResponses({});
    setShowResults(false);
  };

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const calculateScore = () => {
    let totalScore = 0;
    let maxScore = 0;

    currentAssessment.questions.forEach(question => {
      const response = responses[question.id];
      maxScore += Math.abs(question.weight);
      
      if (response !== undefined) {
        if (question.reverse) {
          // For reverse questions, "No" adds to safety (negative score is good)
          totalScore += response === 'no' ? question.weight : -question.weight;
        } else {
          // For regular questions, "Yes" adds to risk
          totalScore += response === 'yes' ? question.weight : 0;
        }
      }
    });

    return { totalScore, maxScore };
  };

  const getResultsInterpretation = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    
    if (percentage >= 70) {
      return {
        level: 'High Risk',
        color: 'danger',
        message: 'Your responses indicate you may be in a high-risk situation. Please consider reaching out for help immediately.',
        recommendations: [
          'Contact the National Domestic Violence Hotline: 1-800-799-7233',
          'Develop a safety plan with a trained advocate',
          'Consider staying with trusted friends or family',
          'Keep important documents and emergency supplies ready',
          'Trust your instincts - if you feel unsafe, seek help'
        ]
      };
    } else if (percentage >= 40) {
      return {
        level: 'Moderate Risk',
        color: 'warning',
        message: 'Your responses suggest some concerning patterns in your relationship that warrant attention.',
        recommendations: [
          'Talk to a trusted friend, family member, or counselor',
          'Learn more about healthy relationship patterns',
          'Consider calling a domestic violence hotline for guidance',
          'Start thinking about your safety and support options',
          'Keep important phone numbers and resources handy'
        ]
      };
    } else {
      return {
        level: 'Lower Risk',
        color: 'success',
        message: 'Your responses suggest fewer immediate risk factors, but it\'s always good to stay informed about healthy relationships.',
        recommendations: [
          'Continue to maintain healthy boundaries in relationships',
          'Stay connected with friends and family',
          'Learn about the warning signs of abuse to help others',
          'Trust your instincts if something ever feels wrong',
          'Remember that help is always available if needed'
        ]
      };
    }
  };

  const submitAssessment = () => {
    setShowResults(true);
  };

  const resetAssessment = () => {
    setCurrentAssessment(null);
    setResponses({});
    setShowResults(false);
  };

  if (showResults) {
    const { totalScore, maxScore } = calculateScore();
    const results = getResultsInterpretation(totalScore, maxScore);

    return (
      <div className="content-page">
        <div className="content-header">
          <Link to="/" className="back-link">← Back to Home</Link>
          <h1>Assessment Results</h1>
        </div>

        <div className="content-container">
          <motion.div 
            className="results-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className={`results-card ${results.color}`}>
              <h2>Risk Level: {results.level}</h2>
              <p>{results.message}</p>
              
              <h3>Recommendations:</h3>
              <ul>
                {results.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>

            <div className="disclaimer-box">
              <h3>⚠️ Important Disclaimer</h3>
              <p>
                This assessment is for educational purposes only and is not a substitute for professional advice. 
                If you are in immediate danger, call 911. For confidential support, contact the National Domestic 
                Violence Hotline at 1-800-799-7233.
              </p>
            </div>

            <div className="results-actions">
              <button onClick={resetAssessment} className="help-btn secondary">
                Take Another Assessment
              </button>
              <Link to="/victim-dashboard" className="help-btn primary">
                Get Support Resources
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (currentAssessment) {
    const allQuestionsAnswered = currentAssessment.questions.every(q => responses[q.id] !== undefined);

    return (
      <div className="content-page">
        <div className="content-header">
          <button onClick={resetAssessment} className="back-link">← Back to Assessments</button>
          <h1>{currentAssessment.title}</h1>
          <p>{currentAssessment.description}</p>
        </div>

        <div className="content-container">
          <div className="assessment-form">
            {currentAssessment.questions.map((question, index) => (
              <motion.div
                key={question.id}
                className="question-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3>Question {index + 1}</h3>
                <p>{question.text}</p>
                <div className="response-options">
                  <label>
                    <input
                      type="radio"
                      name={question.id}
                      value="yes"
                      checked={responses[question.id] === 'yes'}
                      onChange={(e) => handleResponseChange(question.id, e.target.value)}
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={question.id}
                      value="no"
                      checked={responses[question.id] === 'no'}
                      onChange={(e) => handleResponseChange(question.id, e.target.value)}
                    />
                    No
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={question.id}
                      value="unsure"
                      checked={responses[question.id] === 'unsure'}
                      onChange={(e) => handleResponseChange(question.id, e.target.value)}
                    />
                    Unsure
                  </label>
                </div>
              </motion.div>
            ))}

            {allQuestionsAnswered && (
              <motion.button
                className="submit-assessment-btn"
                onClick={submitAssessment}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Results
              </motion.button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-page">
      <motion.div 
        className="content-header"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Self Checks</h1>
        <p>Use short checklists and screenings to reflect on your situation or someone else's</p>
      </motion.div>

      <div className="content-container">
        <motion.div 
          className="intro-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2>Self-Assessment Tools</h2>
          <p>
            These confidential self-assessments can help you reflect on your relationship and safety situation. 
            Your responses are not stored or shared with anyone. Take your time and answer honestly.
          </p>
        </motion.div>

        <div className="warning-box">
          <h3>🔒 Privacy Notice</h3>
          <p>
            These assessments are completely confidential and anonymous. Your responses are not saved or tracked. 
            If you're concerned about your browsing history being monitored, consider using a private browser 
            or a computer that your partner doesn't have access to.
          </p>
        </div>

        <div className="assessments-grid">
          {assessments.map((assessment, index) => (
            <motion.div
              key={assessment.id}
              className="assessment-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 + 0.3 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(74, 50, 103, 0.15)" }}
            >
              <h3>{assessment.title}</h3>
              <p>{assessment.description}</p>
              <div className="assessment-info">
                <span className="question-count">{assessment.questions.length} questions</span>
                <span className="time-estimate">~5 minutes</span>
              </div>
              <button
                className="start-assessment-btn"
                onClick={() => handleAssessmentSelect(assessment)}
              >
                Start Assessment
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="info-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <div className="info-box">
            <h3>💡 How to Use These Assessments</h3>
            <ul>
              <li>Find a private, safe space where you won't be interrupted</li>
              <li>Answer questions based on your current or most recent relationship</li>
              <li>Be honest with yourself - there are no right or wrong answers</li>
              <li>Remember that these tools are for reflection, not diagnosis</li>
              <li>Consider discussing results with a trusted friend or professional</li>
            </ul>
          </div>
        </motion.div>

        <motion.div 
          className="resources-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <h2>Need to Talk to Someone?</h2>
          <div className="resource-cards">
            <div className="resource-card">
              <h4>National Domestic Violence Hotline</h4>
              <p>Confidential support and safety planning available 24/7.</p>
              <div className="contact-info">
                <strong>Phone:</strong> 1-800-799-7233<br/>
                <strong>Text:</strong> START to 88788
              </div>
            </div>
            <div className="resource-card">
              <h4>Crisis Text Line</h4>
              <p>Free, confidential crisis support via text message.</p>
              <div className="contact-info">
                <strong>Text:</strong> HOME to 741741
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SelfChecks;