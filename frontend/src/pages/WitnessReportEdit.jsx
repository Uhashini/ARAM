import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft, ShieldCheck, Lock, Activity, Clock, User,
    MapPin, AlertTriangle, MessageSquare, Check, X,
    ChevronRight, Smartphone, AlertCircle, Info, ShieldAlert, Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './WitnessReportEdit.css';
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

// Map Component Helpers
const LocationPicker = ({ position, setPosition, onAddressFound }) => {
    useMapEvents({
        async click(e) {
            setPosition(e.latlng);
            if (onAddressFound) {
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${e.latlng.lat}&lon=${e.latlng.lng}`);
                    const data = await response.json();
                    onAddressFound(data.display_name);
                } catch (err) {
                    console.error('Reverse geocoding failed:', err);
                }
            }
        },
    });
    return position ? <Marker position={position} /> : null;
};

const MapFocus = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        if (position) map.setView(position, map.getZoom());
    }, [position, map]);
    return null;
};

const WitnessReportEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        reportId: '',
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
        provideContact: false,
        status: 'pending',
        createdAt: null,
        locationCoordinates: {
            type: 'Point',
            coordinates: [78.9629, 20.5937]
        }
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

        if (!window.confirm("Are you sure you want to update this testimony? These changes will be saved to the official case file.")) {
            return;
        }

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

    const getSeverityLabel = (level) => {
        const labels = {
            1: 'Verbal Conflict',
            2: 'Emotional Harm',
            3: 'Repeated Abuse',
            4: 'Physical Threat',
            5: 'Physical Violence'
        };
        return labels[level] || 'Verbal Conflict';
    };

    if (loading) {
        return (
            <div className="edit-report-page">
                <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
                    <div className="loader-fluid">Syncing Case Portal...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="edit-report-page">
                <div className="container" style={{ padding: '3rem' }}>
                    <button onClick={() => navigate('/witness')} className="btn-nav-outline">
                        <ArrowLeft size={18} /> Back to Dashboard
                    </button>
                    <div className="error-card-fluid">
                        <h2>Access Error</h2>
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="edit-report-page">
            {/* Secure Navigation */}
            <nav className="navbar-fluid">
                <div className="nav-container-fluid">
                    <div className="nav-left-zone">
                        <Link to="/"><img src={aramLogo} alt="ARAM" className="nav-logo-fluid" /></Link>
                        <div className="nav-divider-v"></div>
                        <div className="breadcrumb-fluid">
                            <Link to="/witness">Dashboard</Link>
                            <ChevronRight size={14} />
                            <Link to={`/witness/report/${id}`}>Case File</Link>
                            <ChevronRight size={14} />
                            <span className="active">Refine Testimony</span>
                        </div>
                    </div>
                    <div className="nav-right-zone">
                        <button className="quick-exit-trigger" onClick={() => window.location.href = 'https://www.google.com/search?q=weather+today'}>
                            Quick Exit
                        </button>
                    </div>
                </div>
            </nav>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="edit-page-layout"
            >
                <header className="edit-header">
                    <h1>Refine Testimony</h1>
                    <div className="edit-meta-strip">
                        <span className="meta-chip">CASE: {formData.reportId || id.slice(-8).toUpperCase()}</span>
                        <span className="meta-chip">SUBMITTED: {new Date(formData.createdAt).toLocaleDateString()}</span>
                        <span className="meta-chip">STATUS: {formData.status?.toUpperCase()}</span>
                    </div>
                    <p className="confidentiality-note">
                        <Lock size={14} />
                        <span>Edits remain confidential and are logged securely.</span>
                    </p>
                </header>

                <form onSubmit={handleSubmit}>
                    {/* Section: Incident Details */}
                    <section className="edit-section">
                        <div className="section-label">
                            <Activity size={18} />
                            <span>Incident Details</span>
                        </div>

                        <div className="form-stack">
                            <div className="input-group-edit">
                                <label className="lbl-main" htmlFor="incidentDescription">Describe what you witnessed</label>
                                <p className="lbl-hint">Provide additional clarity if details have changed or new information is available.</p>
                                <textarea
                                    id="incidentDescription"
                                    name="incidentDescription"
                                    className="edit-textarea"
                                    value={formData.incidentDescription}
                                    onChange={handleChange}
                                    placeholder="Tell us about the incident..."
                                    required
                                />
                            </div>

                            <div className="form-grid-2">
                                <div className="input-group-edit">
                                    <label className="lbl-main" htmlFor="location">General Location</label>
                                    <p className="lbl-hint">Landmarks help responders verify incidents.</p>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        className="edit-input"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="Near City Park, XYZ Mall area"
                                    />
                                </div>
                                <div className="input-group-edit">
                                    <label className="lbl-main" htmlFor="dateTime">Incident Timestamp</label>
                                    <p className="lbl-hint">Approximate time is acceptable.</p>
                                    <input
                                        type="datetime-local"
                                        id="dateTime"
                                        name="dateTime"
                                        className="edit-input"
                                        value={formData.dateTime}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="input-group-edit">
                                <label className="lbl-main" htmlFor="witnessRelationship">Your Relationship to those involved</label>
                                <p className="lbl-hint">Helps authorities understand your perspective.</p>
                                <select
                                    id="witnessRelationship"
                                    name="witnessRelationship"
                                    className="edit-select"
                                    value={formData.witnessRelationship}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Category</option>
                                    <option value="neighbor">Neighbor</option>
                                    <option value="family">Family Member</option>
                                    <option value="colleague">Colleague / Coworker</option>
                                    <option value="friend">Friend</option>
                                    <option value="stranger">Stranger / Passerby</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="severity-control-wrap">
                                <div className="slider-header">
                                    <label className="lbl-main">Observed Severity Intensity</label>
                                    <span className="active-level-label">{getSeverityLabel(formData.severityLevel)}</span>
                                </div>
                                <input
                                    type="range"
                                    className="custom-slider"
                                    name="severityLevel"
                                    min="1"
                                    max="5"
                                    step="1"
                                    value={formData.severityLevel}
                                    onChange={handleChange}
                                />
                                <div className="slider-markers">
                                    <span>Level 1</span>
                                    <span>Level 2</span>
                                    <span>Level 3</span>
                                    <span>Level 4</span>
                                    <span>Level 5</span>
                                </div>
                            </div>

                            <div className="input-group-edit">
                                <label className="lbl-main">Map Pin Location</label>
                                <p className="lbl-hint">Click on the map to update the exact incident coordinates.</p>
                                <div className="map-selection-container" style={{ marginTop: '12px' }}>
                                    <MapContainer
                                        center={[formData.locationCoordinates?.coordinates[1] || 20.5937, formData.locationCoordinates?.coordinates[0] || 78.9629]}
                                        zoom={15}
                                        className="map-interaction-box"
                                        style={{ height: '300px' }}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; OpenStreetMap contributors'
                                        />
                                        <LocationPicker
                                            position={formData.locationCoordinates ? { lat: formData.locationCoordinates.coordinates[1], lng: formData.locationCoordinates.coordinates[0] } : null}
                                            setPosition={(latlng) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    locationCoordinates: {
                                                        ...prev.locationCoordinates,
                                                        coordinates: [latlng.lng, latlng.lat]
                                                    }
                                                }));
                                            }}
                                            onAddressFound={(address) => {
                                                setFormData(prev => ({ ...prev, location: address }));
                                            }}
                                        />
                                        <MapFocus position={formData.locationCoordinates ? { lat: formData.locationCoordinates.coordinates[1], lng: formData.locationCoordinates.coordinates[0] } : null} />
                                    </MapContainer>

                                    <button
                                        type="button"
                                        className="btn-locate-me"
                                        onClick={() => {
                                            if (navigator.geolocation) {
                                                navigator.geolocation.getCurrentPosition(async (pos) => {
                                                    const { latitude, longitude } = pos.coords;
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        locationCoordinates: {
                                                            ...prev.locationCoordinates,
                                                            coordinates: [longitude, latitude]
                                                        }
                                                    }));

                                                    try {
                                                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
                                                        const data = await response.json();
                                                        setFormData(prev => ({ ...prev, location: data.display_name }));
                                                    } catch (err) {
                                                        console.error('Locate me reverse geocode failed:', err);
                                                    }
                                                });
                                            }
                                        }}
                                    >
                                        <Navigation size={14} /> Detect My Location
                                    </button>

                                    <div className="map-coords-badge">
                                        <Activity size={14} />
                                        Point: {formData.locationCoordinates?.coordinates[1].toFixed(4)}, {formData.locationCoordinates?.coordinates[0].toFixed(4)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section: Risk Assessment */}
                    <section className="edit-section">
                        <div className="section-label">
                            <ShieldAlert size={18} />
                            <span>Risk Assessment</span>
                        </div>

                        <div className="form-stack">
                            <div
                                className={`risk-alert-toggle ${formData.immediateRisk ? 'active' : ''}`}
                                onClick={() => handleChange({ target: { name: 'immediateRisk', type: 'checkbox', checked: !formData.immediateRisk } })}
                            >
                                <div className="risk-check-proxy">
                                    {formData.immediateRisk && <Check size={16} />}
                                </div>
                                <div className="risk-alert-content">
                                    <span className="risk-alert-title">⚠ I believe the victim is in immediate danger</span>
                                    <p className="lbl-hint">Checking this flags the report for priority legal review.</p>
                                </div>
                            </div>

                            <AnimatePresence>
                                {formData.immediateRisk && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="risk-follow-up"
                                    >
                                        <div className="input-group-edit">
                                            <label className="lbl-main" htmlFor="actionsTaken">Intervention Actions Taken</label>
                                            <p className="lbl-hint">Examples: Called helpline, alerted authorities, spoke to victim, documented evidence.</p>
                                            <textarea
                                                id="actionsTaken"
                                                name="actionsTaken"
                                                className="edit-textarea"
                                                style={{ minHeight: '100px' }}
                                                value={formData.actionsTaken}
                                                onChange={handleChange}
                                                placeholder="What immediate steps were taken?"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </section>

                    {/* Section: Contact Disclosure */}
                    <section className="edit-section">
                        <div className="section-label">
                            <Smartphone size={18} />
                            <span>Contact Disclosure</span>
                        </div>

                        <div className="contact-consent-box">
                            <div
                                className="consent-toggle-row"
                                onClick={() => handleChange({ target: { name: 'provideContact', type: 'checkbox', checked: !formData.provideContact } })}
                            >
                                <div className="risk-check-proxy" style={{ borderColor: '#166534' }}>
                                    {formData.provideContact && <Check size={16} color="#166534" />}
                                </div>
                                <span>I am willing to be contacted for follow-up</span>
                            </div>
                            <p className="lbl-hint" style={{ marginTop: '10px', color: '#166534' }}>
                                Your identity remains confidential unless you explicitly consent to disclosure during the investigation.
                            </p>
                        </div>

                        <AnimatePresence>
                            {formData.provideContact && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="form-stack"
                                    style={{ overflow: 'hidden' }}
                                >
                                    <div className="form-grid-2">
                                        <div className="input-group-edit">
                                            <label className="lbl-main">Contact Name</label>
                                            <input
                                                type="text"
                                                name="optionalContact.name"
                                                className="edit-input"
                                                value={formData.optionalContact.name}
                                                onChange={handleChange}
                                                placeholder="Display Name"
                                            />
                                        </div>
                                        <div className="input-group-edit">
                                            <label className="lbl-main">Preferred Channel</label>
                                            <select
                                                name="optionalContact.preferredContact"
                                                className="edit-select"
                                                value={formData.optionalContact.preferredContact}
                                                onChange={handleChange}
                                            >
                                                <option value="phone">Phone Callback</option>
                                                <option value="email">Secure Email</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-grid-2">
                                        <div className="input-group-edit">
                                            <label className="lbl-main">Phone Number</label>
                                            <input
                                                type="tel"
                                                name="optionalContact.phone"
                                                className="edit-input"
                                                value={formData.optionalContact.phone}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="input-group-edit">
                                            <label className="lbl-main">Email Address</label>
                                            <input
                                                type="email"
                                                name="optionalContact.email"
                                                className="edit-input"
                                                value={formData.optionalContact.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </section>

                    <div className="edit-footer-actions">
                        <div className="footer-btn-row">
                            <button
                                type="submit"
                                className="btn-update"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Syncing Case...' : 'Update Testimony'}
                            </button>
                            <button
                                type="button"
                                className="btn-cancel-edit"
                                onClick={() => navigate(`/witness/report/${id}`)}
                            >
                                Discard Changes
                            </button>
                        </div>
                        <p className="footer-disclaimer">
                            <ShieldCheck size={14} style={{ display: 'inline', marginRight: '4px' }} />
                            Changes are logged in the secure case file and can be reviewed before FIR escalation.
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default WitnessReportEdit;
