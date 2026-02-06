import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, User, AlertTriangle, Edit, Trash2 } from 'lucide-react';
import '../App.css';
import aramLogo from '../assets/aram-hero-logo.png';

const WitnessReportDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
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
                setReport(data);
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

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
            return;
        }

        try {
            const userInfo = localStorage.getItem('userInfo');
            const { token } = JSON.parse(userInfo);

            const response = await fetch(`http://127.0.0.1:5001/api/witness/report/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert('Report deleted successfully');
                navigate('/witness');
            } else {
                const data = await response.json();
                alert(`Error: ${data.message || 'Failed to delete report'}`);
            }
        } catch (err) {
            console.error('Error deleting report:', err);
            alert('Failed to connect to server');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: '#f59e0b',
            reviewed: '#3b82f6',
            action_taken: '#10b981',
            closed: '#6b7280'
        };
        return colors[status] || '#6b7280';
    };

    const getSeverityLabel = (level) => {
        const labels = {
            1: 'Verbal Argument',
            2: 'Threatening Behavior',
            3: 'Minor Physical Contact',
            4: 'Physical Violence',
            5: 'Severe Physical Violence'
        };
        return labels[level] || `Level ${level}`;
    };

    if (loading) {
        return (
            <div className="app-container">
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

    if (error || !report) {
        return (
            <div className="app-container">
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
                        <p>{error || 'Report not found'}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <nav className="navbar">
                <div className="container nav-content">
                    <div className="logo">
                        <Link to="/">
                            <img src={aramLogo} alt="ARAM Logo" style={{ height: '40px' }} />
                        </Link>
                    </div>
                    <div className="nav-links">
                        <Link to="/witness" className="nav-link">Dashboard</Link>
                    </div>
                </div>
            </nav>

            <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '900px', margin: '0 auto' }}>
                <button
                    onClick={() => navigate('/witness')}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '2rem', color: 'var(--text-secondary)' }}
                >
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>

                <div style={{ background: 'white', borderRadius: '1rem', padding: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
                    {/* Header with Status and Actions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Witness Report Details</h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                <span style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '2rem',
                                    background: getStatusColor(report.status) + '20',
                                    color: getStatusColor(report.status),
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem'
                                }}>
                                    {report.status.replace('_', ' ').toUpperCase()}
                                </span>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    <Calendar size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                                    Submitted: {new Date(report.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={() => navigate(`/witness/report/${id}/edit`)}
                                className="btn-outline"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
                            >
                                <Edit size={18} /> Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.75rem 1.5rem',
                                    background: '#dc2626',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}
                            >
                                <Trash2 size={18} /> Delete
                            </button>
                        </div>
                    </div>

                    {/* Incident Description */}
                    <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '0.75rem' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>Incident Description</h3>
                        <p style={{ lineHeight: '1.7', color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>
                            {report.incidentDescription}
                        </p>
                    </div>

                    {/* Details Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                        {report.location && (
                            <div style={{ padding: '1.25rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                    <MapPin size={18} />
                                    <strong>Location</strong>
                                </div>
                                <p style={{ margin: 0, color: 'var(--text-main)' }}>{report.location}</p>
                            </div>
                        )}

                        {report.dateTime && (
                            <div style={{ padding: '1.25rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                    <Calendar size={18} />
                                    <strong>Date & Time</strong>
                                </div>
                                <p style={{ margin: 0, color: 'var(--text-main)' }}>
                                    {new Date(report.dateTime).toLocaleString()}
                                </p>
                            </div>
                        )}

                        {report.witnessRelationship && (
                            <div style={{ padding: '1.25rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                    <User size={18} />
                                    <strong>Relationship</strong>
                                </div>
                                <p style={{ margin: 0, color: 'var(--text-main)', textTransform: 'capitalize' }}>
                                    {report.witnessRelationship}
                                </p>
                            </div>
                        )}

                        <div style={{ padding: '1.25rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                <AlertTriangle size={18} />
                                <strong>Severity Level</strong>
                            </div>
                            <p style={{ margin: 0, color: 'var(--text-main)' }}>
                                {getSeverityLabel(report.severityLevel)}
                            </p>
                        </div>
                    </div>

                    {/* Risk Assessment */}
                    {(report.immediateRisk || report.actionsTaken) && (
                        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: report.immediateRisk ? '#fef2f2' : '#f8fafc', borderRadius: '0.75rem', border: report.immediateRisk ? '2px solid #dc2626' : '1px solid #e2e8f0' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: report.immediateRisk ? '#dc2626' : 'var(--primary-color)' }}>
                                Risk Assessment
                            </h3>
                            {report.immediateRisk && (
                                <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#dc2626', color: 'white', borderRadius: '0.5rem', fontWeight: 'bold' }}>
                                    ⚠️ IMMEDIATE DANGER REPORTED
                                </div>
                            )}
                            {report.actionsTaken && (
                                <div>
                                    <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Actions Taken:</strong>
                                    <p style={{ margin: 0, lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{report.actionsTaken}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Contact Information */}
                    {report.provideContact && report.optionalContact && (
                        <div style={{ padding: '1.5rem', background: '#f0fdf4', borderRadius: '0.75rem', border: '1px solid #86efac' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#16a34a' }}>Contact Information Provided</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                {report.optionalContact.name && (
                                    <div>
                                        <strong style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>Name:</strong>
                                        <p style={{ margin: 0 }}>{report.optionalContact.name}</p>
                                    </div>
                                )}
                                {report.optionalContact.phone && (
                                    <div>
                                        <strong style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>Phone:</strong>
                                        <p style={{ margin: 0 }}>{report.optionalContact.phone}</p>
                                    </div>
                                )}
                                {report.optionalContact.email && (
                                    <div>
                                        <strong style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>Email:</strong>
                                        <p style={{ margin: 0 }}>{report.optionalContact.email}</p>
                                    </div>
                                )}
                                {report.optionalContact.preferredContact && (
                                    <div>
                                        <strong style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>Preferred Contact:</strong>
                                        <p style={{ margin: 0, textTransform: 'capitalize' }}>{report.optionalContact.preferredContact}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WitnessReportDetail;
