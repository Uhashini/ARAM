import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './WitnessReport.css';
import '../App.css';
import aramLogo from '../assets/aram-hero-logo.png';

const WitnessReportEdit = () => {
    const { id } = useParams();
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReport();
    }, [id]);

    const fetchReport = async () => {
        try {
            const userInfo = localStorage.getItem('userInfo');
            if (!userInfo) {
                navigate('/login');
                return;
            }

            const { token } = JSON.parse(userInfo);
            const response = await fetch(`http://127.0.0.1:5001/api/witness/report/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                // Format dateTime for datetime-local input
                if (data.dateTime) {
                    const date = new Date(data.dateTime);
                    data.dateTime = date.toISOString().slice(0, 16);
                }
                setFormData(data);
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to fetch report');
            }
        } catch (err) {
            console.error('Error fetching report:', err);
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

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
            const userInfo = localStorage.getItem('userInfo');
            const { token } = JSON.parse(userInfo);

            const response = await fetch(`http://127.0.0.1:5001/api/witness/report/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Report updated successfully!');
                navigate(`/witness/report/${id}`);
            } else {
                const data = await response.json();
                alert(`Error: ${data.message || 'Failed to update report'}`);
            }
        } catch (error) {
            console.error("Update error:", error);
            alert('Failed to connect to the server. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="witness-report page-wrapper">
                <nav className="navbar">
                    <div className="container nav-content">
                        <div className="logo">
                            <Link to="/">
                                <img src={aramLogo} alt="ARAM Logo" style={{ height: '40px' }} />
                            </Link>
                        </div>
                    </div>
                </nav>
                <div className="container" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
                    <p>Loading report...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="witness-report page-wrapper">
                <nav className="navbar">
                    <div className="container nav-content">
                        <div className="logo">
                            <Link to="/">
                                <img src={aramLogo} alt="ARAM Logo" style={{ height: '40px' }} />
                            </Link>
                        </div>
                    </div>
                </nav>
                <div className="container" style={{ padding: '3rem 1.5rem' }}>
                    <button
                        onClick={() => navigate('/witness')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '2rem', color: 'var(--text-secondary)' }}
                    >
                        <ArrowLeft size={20} /> Back to Dashboard
                    </button>
                    <div style={{ textAlign: 'center', padding: '3rem', background: '#fee2e2', borderRadius: '0.75rem' }}>
                        <h2 style={{ color: '#dc2626' }}>Error</h2>
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

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
                <button onClick={() => navigate(`/witness/report/${id}`)} className="back-button" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                    <ArrowLeft size={20} /> Back to Report
                </button>

                <div className="witness-report__header">
                    <h1>Edit Witness Report</h1>
                    <p>Update the details of your incident report. All information remains confidential.</p>
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
                            {isSubmitting ? 'Updating...' : 'Update Report'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate(`/witness/report/${id}`)}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WitnessReportEdit;
