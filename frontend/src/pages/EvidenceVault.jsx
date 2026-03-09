import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Shield, Lock, FileText, Camera, Mic, Video,
    Download, ChevronRight, LogOut, Search,
    Calendar, Inbox, ArrowRight
} from 'lucide-react';
/* eslint-disable no-unused-vars */
import { motion} from 'framer-motion';
/* eslint-enable no-unused-vars */
import './EvidenceVault.css';
import './VictimDashboard.css';
import aramLogo from '../assets/aram-hero-logo.png';

const EvidenceVault = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        const fetchReports = async () => {
            const userInfo = localStorage.getItem('userInfo');
            if (!userInfo) {
                navigate('/login');
                return;
            }

            try {
                const { token } = JSON.parse(userInfo);
                const response = await fetch('https://aram-ira2.onrender.com/api/victim/my-reports', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok) {
                    setReports(data.reports || []);
                }
            } catch (err) {
                console.error('Failed to fetch reports:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [navigate]);

    const handleQuickExit = () => {
        localStorage.removeItem('userInfo');
        window.location.href = 'https://weather.com';
    };

    const getFileTypeIcon = (mimetype) => {
        if (!mimetype) return <FileText size={14} />;
        if (mimetype.startsWith('image/')) return <Camera size={14} />;
        if (mimetype.startsWith('video/')) return <Video size={14} />;
        if (mimetype.startsWith('audio/')) return <Mic size={14} />;
        return <FileText size={14} />;
    };

    const filteredReports = reports.filter(report => {
        const matchesSearch = report.reportId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.incidentDetails.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || report.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, background: '#f8fafc' }}>
                <Shield size={48} className="animate-pulse" style={{ opacity: 0.4, color: 'var(--brand-primary)' }} />
                <span style={{ color: '#64748b', fontWeight: 600 }}>Accessing your secure vault...</span>
            </div>
        );
    }

    return (
        <div className="vault-container">
            {/* ── NAVBAR ── */}
            <nav className="navbar-fluid">
                <div className="nav-inner-fluid">
                    <div className="nav-left-zone">
                        <Link to="/">
                            <img src={aramLogo} alt="ARAM" style={{ height: 26 }} />
                        </Link>
                        <div className="nav-divider" />
                        <div className="breadcrumb-fluid">
                            <Link to="/victim-dashboard">Dashboard</Link>
                            <ChevronRight size={13} style={{ color: '#cbd5e1' }} />
                            <span className="breadcrumb-active">Evidence Vault</span>
                        </div>
                    </div>
                    <div className="nav-right-zone">
                        <div className="trust-badge">
                            <Lock size={11} /> E2E ENCRYPTED
                        </div>
                        <button className="quick-exit-btn" onClick={handleQuickExit}>
                            <LogOut size={13} /> Quick Exit
                        </button>
                    </div>
                </div>
            </nav>

            <main className="vault-content animate-fade-in">
                <header className="vault-header">
                    <div className="header-icon-badge">
                        <Lock size={32} />
                    </div>
                    <h1>Secure Evidence Vault</h1>
                    <p>All your reports and evidence are cryptographically signed and stored in a tamper-proof vault for your future safety and legal needs.</p>
                </header>

                {/* Filters Row */}
                <div className="vault-filters">
                    <div className="search-wrapper">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            className="vault-search-input"
                            placeholder="Search by Report ID or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="vault-select"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">Filter by Status</option>
                        <option value="submitted">Submitted</option>
                        <option value="processing">Processing</option>
                        <option value="action_taken">Action Taken</option>
                    </select>
                </div>

                {filteredReports.length === 0 ? (
                    <div className="vault-empty-state">
                        <div className="empty-icon-circle">
                            <Inbox size={32} />
                        </div>
                        <h3>No evidence found</h3>
                        <p>{searchTerm ? 'Try adjusting your search or filters to find what you\'re looking for.' : 'You haven\'t submitted any reports yet. Your evidence vault will populate once you file a report.'}</p>
                        {!searchTerm && (
                            <button className="btn-primary" onClick={() => navigate('/report-victim')}>
                                Start First Report <ArrowRight size={16} />
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="vault-grid">
                        {filteredReports.map(report => (
                            <motion.div
                                key={report._id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="evidence-card"
                            >
                                <div className="card-top">
                                    <span className="report-id-tag">{report.reportId}</span>
                                    <span className={`risk-badge ${report.riskAssessment.score.toLowerCase()}`}>
                                        {report.riskAssessment.score} RISK
                                    </span>
                                </div>

                                <div className="abuse-tags">
                                    {report.incidentDetails.abuseTypes.map(type => (
                                        <span key={type} className="abuse-tag">{type}</span>
                                    ))}
                                </div>

                                <h3>Report Overview</h3>
                                <p className="card-description">
                                    {report.incidentDetails.description}
                                </p>

                                <div className="card-date-info">
                                    <Calendar size={14} />
                                    <span>Filed on {new Date(report.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                                </div>

                                {report.evidence && report.evidence.length > 0 && (
                                    <div className="evidence-files-section">
                                        <div className="evidence-files-header">Attached Evidence ({report.evidence.length})</div>
                                        <div className="files-track">
                                            {report.evidence.map((file, idx) => (
                                                <a
                                                    key={idx}
                                                    href={`https://aram-ira2.onrender.com/${file.fileUrl.replace(/\\/g, '/')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="file-link"
                                                    title={file.fileType}
                                                >
                                                    {getFileTypeIcon(file.fileType)}
                                                    File {idx + 1}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="card-footer">
                                    <div className="status-indicator">
                                        <div className={`status-dot ${report.status}`} />
                                        <span className="status-text">{report.status.replace('_', ' ')}</span>
                                    </div>
                                    <button className="btn-ghost" style={{ padding: '8px' }} title="Secure Download">
                                        <Download size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default EvidenceVault;
