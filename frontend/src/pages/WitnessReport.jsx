import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './WitnessReport.css';
import '../App.css'; // Ensure main styles are available
import aramLogo from '../assets/aram-hero-logo.png';

const WitnessReport = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    incidentDescription: '',
    location: '',
    dateTime: '',
    witnessRelationship: '',
    severityLevel: '1',
    immediateRisk: false,
    actionsTaken: '',
    optionalContact: {
      name: '',
      phone: '',
      email: '',
      preferredContact: 'phone'
    },
    provideContact: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('optionalContact.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        optionalContact: {
          ...prev.optionalContact,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5001/api/witness/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Report submitted successfully. Thank you for your help.');
        navigate('/witness'); // Redirect back to dashboard
      } else {
        const data = await response.json();
        alert(`Error: ${data.message || 'Failed to submit report'}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert('Failed to connect to the server. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="witness-report page-wrapper">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container nav-content">
          <div className="logo">
            <Link to="/">
              <img src={aramLogo} alt="ARAM Logo" style={{ height: '40px' }} />
            </Link>
          </div>
          <div className="nav-links">
            <Link to="/witness" className="nav-link">Back to Dashboard</Link>
          </div>
        </div>
      </nav>

      <div className="witness-report__container container" style={{ marginTop: '2rem' }}>
        <button onClick={() => navigate('/witness')} className="back-button" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          <ArrowLeft size={20} /> Back
        </button>

        <div className="witness-report__header">
          <h1>Anonymous Incident Report</h1>
          <p>Your report helps us identify and respond to intimate partner violence. All information is confidential.</p>
        </div>

        <form onSubmit={handleSubmit} className="witness-report__form">
          <div className="form-section">
            <h2>Incident Details</h2>

            <div className="form-group">
              <label htmlFor="incidentDescription">
                Describe what you witnessed *
              </label>
              <textarea
                id="incidentDescription"
                name="incidentDescription"
                value={formData.incidentDescription}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Please describe the incident you witnessed..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location">Location of incident</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="General area (no specific addresses)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="dateTime">Date and time</label>
                <input
                  type="datetime-local"
                  id="dateTime"
                  name="dateTime"
                  value={formData.dateTime}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="witnessRelationship">
                Your relationship to those involved
              </label>
              <select
                id="witnessRelationship"
                name="witnessRelationship"
                value={formData.witnessRelationship}
                onChange={handleChange}
              >
                <option value="">Select relationship</option>
                <option value="neighbor">Neighbor</option>
                <option value="friend">Friend</option>
                <option value="family">Family member</option>
                <option value="coworker">Coworker</option>
                <option value="stranger">Stranger/Passerby</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="severityLevel">
                Severity level (1 = verbal argument, 5 = physical violence)
              </label>
              <input
                type="range"
                id="severityLevel"
                name="severityLevel"
                min="1"
                max="5"
                value={formData.severityLevel}
                onChange={handleChange}
              />
              <div className="severity-labels">
                <span>Verbal (1)</span>
                <span>Current: {formData.severityLevel}</span>
                <span>Physical (5)</span>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Risk Assessment</h2>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="immediateRisk"
                  checked={formData.immediateRisk}
                  onChange={handleChange}
                />
                I believe there is immediate danger to the victim
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="actionsTaken">
                Actions you took (if any)
              </label>
              <textarea
                id="actionsTaken"
                name="actionsTaken"
                value={formData.actionsTaken}
                onChange={handleChange}
                rows="3"
                placeholder="Did you call police, speak to the victim, etc.?"
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Contact Information (Optional)</h2>
            <p className="section-note">
              Providing contact information is completely optional. It may help us follow up if needed.
            </p>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="provideContact"
                  checked={formData.provideContact}
                  onChange={handleChange}
                />
                I'm willing to be contacted for follow-up
              </label>
            </div>

            {formData.provideContact && (
              <div className="contact-fields">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="optionalContact.name">Name</label>
                    <input
                      type="text"
                      id="optionalContact.name"
                      name="optionalContact.name"
                      value={formData.optionalContact.name}
                      onChange={handleChange}
                      placeholder="Your name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="optionalContact.preferredContact">
                      Preferred contact method
                    </label>
                    <select
                      id="optionalContact.preferredContact"
                      name="optionalContact.preferredContact"
                      value={formData.optionalContact.preferredContact}
                      onChange={handleChange}
                    >
                      <option value="phone">Phone</option>
                      <option value="email">Email</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="optionalContact.phone">Phone number</label>
                    <input
                      type="tel"
                      id="optionalContact.phone"
                      name="optionalContact.phone"
                      value={formData.optionalContact.phone}
                      onChange={handleChange}
                      placeholder="Your phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="optionalContact.email">Email address</label>
                    <input
                      type="email"
                      id="optionalContact.email"
                      name="optionalContact.email"
                      value={formData.optionalContact.email}
                      onChange={handleChange}
                      placeholder="Your email address"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/witness')}>
              Cancel
            </button>
          </div>
        </form>

        <div className="witness-report__footer">
          <div className="emergency-notice">
            <h3>🚨 Emergency Situation?</h3>
            <p>If someone is in immediate danger, call emergency services immediately.</p>
            <div className="emergency-contacts">
              <strong>Emergency: 911</strong> |
              <strong>National Domestic Violence Hotline: 1-800-799-7233</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WitnessReport;