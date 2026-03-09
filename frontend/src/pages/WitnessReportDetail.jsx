import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft, Calendar, MapPin, User, AlertTriangle, Edit, Trash2,
    ChevronRight, Lock, Activity, FileText, Phone, ShieldCheck,
    AlertCircle, Clock, CheckCircle2, UserCheck, ShieldAlert,
    Download, Eye, ExternalLink, FileSearch, Archive, History, Scale
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './WitnessReportDetail.css';
import '../App.css';
import aramLogo from '../assets/aram-hero-logo.png';

// Fix Leaflet marker icon issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

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

    const handleWithdraw = async () => {
        if (!window.confirm('Are you sure you want to withdraw this report? This action will mark it as withdrawn and it will no longer be active for investigation.')) {
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
                alert('Report withdrawn successfully');
                navigate('/witness');
            } else {
                const data = await response.json();
                alert(`Error: ${data.message || 'Failed to withdraw report'}`);
            }
        } catch (err) {
            console.error('Error withdrawing report:', err);
            alert('Failed to connect to server');
        }
    };

    const getStatusData = (status) => {
        const statuses = {
            pending: { label: 'Pending Review', class: 'status-pending', icon: Clock },
            reviewed: { label: 'Under Investigation', class: 'status-investigation', icon: FileSearch },
            action_taken: { label: 'Escalated to Police', class: 'status-escalated', icon: AlertCircle },
            counselor: { label: 'Counselor Assigned', class: 'status-counselor', icon: User }, // Note: assuming counselor status might exist or mapping reviewed to it
            closed: { label: 'Closed', class: 'status-closed', icon: CheckCircle2 }
        };
        return statuses[status] || statuses.pending;
    };

    const getRiskData = (score) => {
        const risks = {
            'LOW': { label: 'Low', class: 'risk-low' },
            'MEDIUM': { label: 'Moderate', class: 'risk-moderate' },
            'HIGH': { label: 'High', class: 'risk-high' },
            'EMERGENCY': { label: 'Critical', class: 'risk-critical' }
        };
        return risks[score] || null;
    };

    if (loading) {
        return (
            <div className="case-file-page">
                <nav className="navbar-fluid">
                    <div className="container nav-content">
                        <Link to="/"><img src={aramLogo} alt="Logo" style={{ height: '32px' }} /></Link>
                    </div>
                </nav>
                <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>
                    <div className="loader-fluid">Analyzing Case File...</div>
                </div>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="case-file-page">
                <div className="container" style={{ padding: '3rem' }}>
                    <button onClick={() => navigate('/witness')} className="btn-nav-outline">
                        <ArrowLeft size={18} /> Back to Dashboard
                    </button>
                    <div className="error-card-fluid">
                        <h2>Access Denied or Error</h2>
                        <p>{error || 'Report not found'}</p>
                    </div>
                </div>
            </div>
        );
    }

    const statusData = getStatusData(report.status);
    const riskData = report.riskAssessment ? getRiskData(report.riskAssessment.riskScore) : null;

    return (
        <div className="case-file-page">
            {/* Shared Dashboard Navbar */}
            <nav className="navbar-fluid">
                <div className="nav-container-fluid">
                    <div className="nav-left-zone">
                        <Link to="/"><img src={aramLogo} alt="ARAM" className="nav-logo-fluid" /></Link>
                        <div className="nav-divider-v"></div>
                        <div className="breadcrumb-fluid">
                            <Link to="/witness">Dashboard</Link>
                            <ChevronRight size={14} />
                            <span className="active">Case File</span>
                        </div>
                    </div>
                    <div className="nav-right-zone">
                        <div className="secure-badge-fluid">
                            <Lock size={14} />
                            <span>Secure Case Portal</span>
                        </div>
                    </div>
                </div>
            </nav>

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="case-file-layout"
            >
                <div className="case-main-content">
                    <header className="case-header-section">
                        <span className="case-id-badge">INTERNAL FILE: {report.reportId}</span>
                        <div className="case-title-row">
                            <h1>Witness Report Details</h1>
                            <div className={`status-chip-large ${statusData.class}`}>
                                <statusData.icon size={20} />
                                <span>{statusData.label}</span>
                            </div>
                        </div>

                        <div className="meta-grid-horizontal">
                            <div className="meta-item">
                                <span className="meta-lbl">Submission Date</span>
                                <span className="meta-val">{new Date(report.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-lbl">Last Updated</span>
                                <span className="meta-val">{new Date(report.updatedAt || report.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-lbl">Jurisdiction</span>
                                <span className="meta-val">{report.location || 'Pending Mapping'}</span>
                            </div>
                        </div>
                    </header>

                    <div className="confidential-alert-banner">
                        <Lock size={16} />
                        <span>🔒 This report is encrypted and accessible only to authorized intervention personnel.</span>
                    </div>

                    <div className="case-content-card">
                        <div className="content-block">
                            <div className="block-header">
                                <Activity size={18} />
                                <span>Incident Summary</span>
                            </div>
                            <div className="block-body">
                                {report.incidentDescription}
                            </div>
                        </div>

                        <div className="divider-soft"></div>

                        <div className="detail-info-grid">
                            <div className="info-pill">
                                <span className="pill-lbl">Abuse Type(s)</span>
                                <span className="pill-val" style={{ textTransform: 'capitalize' }}>
                                    {report.abuseType?.length > 0 ? report.abuseType.join(', ') : 'Not Specified'}
                                </span>
                            </div>
                            <div className="info-pill">
                                <span className="pill-lbl">Frequency</span>
                                <span className="pill-val" style={{ textTransform: 'capitalize' }}>
                                    {report.frequency?.replace('-', ' ') || 'Single Incident'}
                                </span>
                            </div>
                            <div className="info-pill">
                                <span className="pill-lbl">Date & Time</span>
                                <span className="pill-val">
                                    {report.dateTime ? new Date(report.dateTime).toLocaleString() : 'Not Provided'}
                                </span>
                            </div>
                        </div>

                        <div className="risk-indicator-row">
                            <span className="pill-lbl" style={{ marginBottom: 0 }}>Severity Assessment:</span>
                            {riskData ? (
                                <div className={`risk-badge ${riskData.class}`}>
                                    {riskData.label} Risk Detected
                                </div>
                            ) : (
                                <span className="meta-val" style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>
                                    Pending automated risk evaluation
                                </span>
                            )}
                        </div>
                    </div>

                    {report.locationCoordinates && report.locationCoordinates.coordinates && (
                        <div className="case-content-card" style={{ padding: '0', overflow: 'hidden' }}>
                            <div className="block-header" style={{ padding: '24px 32px 12px' }}>
                                <MapPin size={18} />
                                <span>Accurate Scene Location</span>
                            </div>
                            <div className="map-display-view" style={{ height: '350px', width: '100%', borderTop: '1px solid var(--divider-soft)' }}>
                                <MapContainer
                                    center={[report.locationCoordinates.coordinates[1], report.locationCoordinates.coordinates[0]]}
                                    zoom={15}
                                    scrollWheelZoom={false}
                                    style={{ height: '100%', width: '100%', zIndex: 1 }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; OpenStreetMap'
                                    />
                                    <Marker position={[report.locationCoordinates.coordinates[1], report.locationCoordinates.coordinates[0]]} />
                                </MapContainer>
                            </div>
                            <div className="map-footer-coords" style={{ padding: '12px 32px', fontSize: '0.75rem', color: 'var(--text-tertiary)', background: '#FDFBFF' }}>
                                GPS: {report.locationCoordinates.coordinates[1].toFixed(6)}, {report.locationCoordinates.coordinates[0].toFixed(6)}
                            </div>
                        </div>
                    )}

                    {report.assignedPoliceStation && (
                        <div className="case-content-card" style={{ background: '#F0F9FF', border: '1.5px solid #BAE6FD' }}>
                            <div className="block-header">
                                <MapPin size={18} style={{ color: '#0369A1' }} />
                                <span style={{ color: '#0C4A6E' }}>Assigned Police Station</span>
                            </div>
                            <div className="block-body">
                                <div className="info-pill" style={{ background: 'white', marginBottom: '12px' }}>
                                    <span className="pill-lbl">Station Name</span>
                                    <span className="pill-val" style={{ fontWeight: 700, color: '#0C4A6E' }}>
                                        {report.assignedPoliceStation.name}
                                    </span>
                                </div>
                                <div className="info-pill" style={{ background: 'white', marginBottom: '12px' }}>
                                    <span className="pill-lbl">Address</span>
                                    <span className="pill-val">{report.assignedPoliceStation.address}</span>
                                </div>
                                {report.assignedPoliceStation.distance && (
                                    <div className="info-pill" style={{ background: 'white', marginBottom: '12px' }}>
                                        <span className="pill-lbl">Distance from Incident</span>
                                        <span className="pill-val" style={{ color: '#0369A1', fontWeight: 600 }}>
                                            {report.assignedPoliceStation.distance} km
                                        </span>
                                    </div>
                                )}
                                {report.assignedPoliceStation.phone && (
                                    <div className="info-pill" style={{ background: 'white' }}>
                                        <span className="pill-lbl">Contact Number</span>
                                        <span className="pill-val">{report.assignedPoliceStation.phone}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="case-content-card">
                        <div className="content-block">
                            <div className="block-header">
                                <User size={18} />
                                <span>Affected Persons (Locked Access)</span>
                            </div>
                            <div className="form-grid-2">
                                <div className="info-pill">
                                    <span className="pill-lbl">Victim Name</span>
                                    <span className="pill-val">{report.victim?.name || 'Anonymous in system'}</span>
                                </div>
                                <div className="info-pill">
                                    <span className="pill-lbl">Accused Name</span>
                                    <span className="pill-val">{report.accused?.name || 'Unknown / Not Provided'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {report.evidence?.length > 0 && (
                        <div className="case-content-card">
                            <div className="block-header">
                                <Archive size={18} />
                                <span>Digital Evidence Registry</span>
                            </div>
                            <div className="evidence-grid-mini">
                                {report.evidence.map((file, idx) => (
                                    <div key={idx} className="evidence-file-card">
                                        <FileSearch size={24} />
                                        <span className="file-name">{file.fileType || 'Attachment'}</span>
                                        <button className="pill-val" style={{ border: 'none', background: 'none', color: 'var(--primary-color)', fontSize: '0.75rem', cursor: 'pointer' }}>View Hash</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="case-actions-drawer">
                        <button
                            onClick={() => navigate(`/witness/report/${id}/edit`)}
                            className="btn-nav-outline"
                        >
                            <Edit size={18} />
                            <span>Edit Record</span>
                        </button>
                        <button
                            onClick={handleWithdraw}
                            className="btn-withdraw"
                        >
                            <Trash2 size={18} />
                            <span>Withdraw Case</span>
                        </button>
                        {report.status === 'closed' && (
                            <button className="btn-nav-primary">
                                <Download size={18} />
                                <span>Download FIR Packet</span>
                            </button>
                        )}
                    </div>

                    <div style={{ marginTop: '24px', display: 'flex', gap: '20px' }}>
                        <Link to="/witness" className="link-standard" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                            <History size={16} /> Back to Activity History
                        </Link>
                        <Link to="/report-incident" className="link-standard" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                            <Activity size={16} /> Report Related Incident
                        </Link>
                    </div>
                </div>

                <aside className="sidebar-panel">
                    <div className="panel-card">
                        <div className="panel-title">
                            <History size={18} />
                            <span>Intervention Timeline</span>
                        </div>
                        <div className="timeline-track">
                            <div className={`timeline-node done`}>
                                <div className="node-dot"><CheckCircle2 size={14} /></div>
                                <div className="node-content">
                                    <span className="node-label">Report Submitted</span>
                                    <span className="node-meta">{new Date(report.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className={`timeline-node ${report.riskAssessment ? 'done' : 'active'}`}>
                                <div className="node-dot">{report.riskAssessment ? <CheckCircle2 size={14} /> : <Activity size={14} />}</div>
                                <div className="node-content">
                                    <span className="node-label">Risk Assessment</span>
                                    <span className="node-meta">{report.riskAssessment ? 'Automated Analysis Complete' : 'In Progress'}</span>
                                </div>
                            </div>

                            <div className={`timeline-node ${report.status === 'action_taken' || report.status === 'closed' ? 'done' : report.status === 'reviewed' ? 'active' : ''}`}>
                                <div className="node-dot"><Clock size={14} /></div>
                                <div className="node-content">
                                    <span className="node-label">Authority Review</span>
                                    <span className="node-meta">{report.status === 'pending' ? 'Pending Queue' : 'Case Manager Assigned'}</span>
                                </div>
                            </div>

                            <div className={`timeline-node ${report.status === 'action_taken' || report.status === 'closed' ? 'done' : ''}`}>
                                <div className="node-dot"><AlertTriangle size={14} /></div>
                                <div className="node-content">
                                    <span className="node-label">Police Notification</span>
                                    <span className="node-meta">Legal Intervention Stage</span>
                                </div>
                            </div>

                            <div className={`timeline-node ${report.status === 'closed' ? 'done' : ''}`}>
                                <div className="node-dot"><Scale size={14} /></div>
                                <div className="node-content">
                                    <span className="node-label">Case Resolved</span>
                                    <span className="node-meta">FIR Generated</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="panel-card" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                        <div className="privacy-reassurance">
                            <ShieldCheck size={18} />
                            <span>Identity Protection Active</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#166534', marginTop: '10px', lineHeight: '1.5' }}>
                            {report.privacyMode === 'anonymous'
                                ? 'Your personal details are not stored with this case file.'
                                : report.privacyMode === 'confidential'
                                    ? 'Your identity is restricted to authorized legal counselors only.'
                                    : 'Identified mode: Your details are included for legal evidence.'}
                        </p>
                    </div>
                </aside>
            </motion.div>
        </div>
    );
};

export default WitnessReportDetail;
