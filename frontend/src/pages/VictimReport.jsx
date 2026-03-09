import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, User, Heart, FileText, Upload,
    CheckCircle, ArrowLeft, ArrowRight, Lock, Phone,
    MapPin, X, Zap, Clock, AlertTriangle, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './WitnessReport.css'; // Reusing the same styles for consistency
import EmergencyOverlay from '../components/EmergencyOverlay';

const VictimReport = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const totalSteps = 7;
    const [user, setUser] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionResult, setSubmissionResult] = useState(null);
    const [emergencyActive, setEmergencyActive] = useState(false);
    const [evidenceFiles, setEvidenceFiles] = useState([]);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) setUser(JSON.parse(userInfo));

        // Quick Exit Shortcut
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                // Double tap escape logic could be here, or just single
                window.location.href = 'https://weather.com';
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const [formData, setFormData] = useState({
        personalDetails: {
            name: '', age: '', gender: '', phone: '', email: '', address: '',
            preferredLanguage: 'English',
            safeContact: { name: '', phone: '', relation: '', safeTimeToCall: '' },
            disabilityStatus: { hasDisability: false, details: '' }
        },
        incidentDetails: {
            abuseTypes: [],
            frequency: 'one-time',
            startDate: '',
            lastIncidentDate: '',
            description: ''
        },
        perpetrator: {
            name: '', relationship: '', livesWithVictim: false, substanceAbuse: false, hasWeaponAccess: false
        },
        medical: {
            hasInjuries: false, injuryDescription: '', needImmediateHelp: false, isPregnant: false,
            hospitalVisit: { visited: false, hospitalName: '' }
        },
        children: {
            hasChildren: false, count: 0,
            details: [] // {age, gender, isAlsoAbused}
        },
        riskAssessment: {
            indicators: {
                threatToKill: false,
                strangulationIndex: false,
                weaponUse: false,
                escalatingViolence: false,
                suicideThreats: false
            }
        }
    });

    const handleInputChange = (e, section, subSection = null) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === 'checkbox' ? checked : value;

        setFormData(prev => {
            if (subSection) {
                return {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [subSection]: {
                            ...prev[section][subSection],
                            [name]: finalValue
                        }
                    }
                };
            }
            return {
                ...prev,
                [section]: {
                    ...prev[section],
                    [name]: finalValue
                }
            };
        });
    };

    const handleMultiSelect = (value, field, section) => {
        setFormData(prev => {
            const current = [...prev[section][field]];
            const index = current.indexOf(value);
            if (index === -1) current.push(value);
            else current.splice(index, 1);
            return { ...prev, [section]: { ...prev[section], [field]: current } };
        });
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        // Basic validation
        const validFiles = files.filter(f => f.size < 20 * 1024 * 1024);
        setEvidenceFiles(prev => [...prev, ...validFiles]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('reportData', JSON.stringify(formData));
            evidenceFiles.forEach(file => formDataToSend.append('evidence', file));

            const headers = {};
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                const { token } = JSON.parse(userInfo);
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch('http://127.0.0.1:5001/api/victim/report', {
                method: 'POST',
                headers: headers, // Do NOT set Content-Type for FormData
                body: formDataToSend
            });

            const data = await response.json();
            if (response.ok) {
                setSubmissionResult(data);
                setStep(8); // Success step
            } else {
                alert('Error submitting report: ' + data.message);
            }
        } catch (err) {
            console.error(err);
            alert('Failed to connect to server');
        } finally {
            setIsSubmitting(false);
        }
    };

    const steps = [
        { title: 'Safety', icon: Shield },
        { title: 'You', icon: User },
        { title: 'Incident', icon: FileText },
        { title: 'Perpetrator', icon: Zap },
        { title: 'Medical', icon: Heart },
        { title: 'Evidence', icon: Upload },
        { title: 'Review', icon: CheckCircle }
    ];

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="form-step-container">
                        <div className="step-guidance">
                            <h2><Shield size={28} /> Safety Check</h2>
                            <p className="reassurance-microcopy">
                                Your safety is our priority. If you are in immediate danger, please call emergency services (112 or 100) now.
                            </p>
                        </div>

                        <div className="form-section-fluid">
                            <label className="section-title">Are you currently in a safe place?</label>
                            <div className="guided-chip-grid">
                                <div className="guided-card" onClick={() => setStep(2)}>
                                    <div className="card-icon-zone"><CheckCircle size={20} /></div>
                                    <div className="card-text-zone">
                                        <span className="card-lbl">Yes, I am safe</span>
                                        <span className="card-sub">I can fill this form securely</span>
                                    </div>
                                </div>
                                <div className="guided-card" style={{ border: '2px solid #fee2e2' }} onClick={() => setEmergencyActive(true)}>
                                    <div className="card-icon-zone" style={{ color: '#dc2626' }}><AlertTriangle size={20} /></div>
                                    <div className="card-text-zone">
                                        <span className="card-lbl" style={{ color: '#dc2626' }}>🚨 I'm Right Now in Danger</span>
                                        <span className="card-sub">Activate Emergency Protocol — alerts, location, contacts</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="risk-banner" style={{ background: '#fee2e2', padding: '16px', borderRadius: '12px', marginTop: '24px' }}>
                            <div style={{ display: 'flex', gap: '12px', color: '#991b1b' }}>
                                <Lock size={20} />
                                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>This form has a "Quick Exit" feature. Press ESC twice to leave immediately.</span>
                            </div>
                        </div>
                    </motion.div>
                );

            case 2:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="form-step-container">
                        <div className="step-guidance">
                            <h2><User size={28} /> Personal Details</h2>
                            <p className="reassurance-microcopy">
                                We need this to contact you safely. We will <strong>ONLY</strong> call you at your specified safe time.
                            </p>
                        </div>

                        <div className="form-grid-2">
                            <div className="input-group-fluid">
                                <label>Full Name</label>
                                <input type="text" name="name" value={formData.personalDetails.name} onChange={(e) => handleInputChange(e, 'personalDetails')} placeholder="Your name" />
                            </div>
                            <div className="input-group-fluid">
                                <label>Age</label>
                                <input type="number" name="age" value={formData.personalDetails.age} onChange={(e) => handleInputChange(e, 'personalDetails')} />
                            </div>
                        </div>

                        <div className="form-section-fluid">
                            <label className="section-title">Safe Contact Information</label>
                            <div className="form-grid-2">
                                <div className="input-group-fluid">
                                    <label>Your Phone Number</label>
                                    <input type="tel" name="phone" value={formData.personalDetails.phone} onChange={(e) => handleInputChange(e, 'personalDetails')} />
                                </div>
                                <div className="input-group-fluid">
                                    <label>Safe Contact (Friend/Relative)</label>
                                    <input type="text" name="name" value={formData.personalDetails.safeContact.name} onChange={(e) => handleInputChange(e, 'personalDetails', 'safeContact')} placeholder="Name" />
                                </div>
                            </div>
                            <div className="input-group-fluid">
                                <label>Safe Time to Call</label>
                                <input type="text" name="safeTimeToCall" value={formData.personalDetails.safeContact.safeTimeToCall} onChange={(e) => handleInputChange(e, 'personalDetails', 'safeContact')} placeholder="e.g., Weekdays 10 AM - 2 PM" />
                            </div>
                        </div>
                    </motion.div>
                );

            case 3:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="form-step-container">
                        <div className="step-guidance">
                            <h2><FileText size={28} /> Incident Details</h2>
                            <p className="reassurance-microcopy">Tell us what happened. This helps us understand the support you need.</p>
                        </div>

                        <div className="form-section-fluid">
                            <label className="section-title">Type of Abuse</label>
                            <div className="guided-chip-grid">
                                {['physical', 'emotional', 'sexual', 'financial', 'verbal', 'digital'].map(type => (
                                    <div key={type}
                                        className={`guided-card ${formData.incidentDetails.abuseTypes.includes(type) ? 'active' : ''}`}
                                        onClick={() => handleMultiSelect(type, 'abuseTypes', 'incidentDetails')}>
                                        <div className="card-text-zone"><span className="card-lbl" style={{ textTransform: 'capitalize' }}>{type} Abuse</span></div>
                                        {formData.incidentDetails.abuseTypes.includes(type) && <CheckCircle className="card-check-icon" size={16} />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="input-group-fluid">
                            <label>Description of Incident(s)</label>
                            <textarea name="description" rows="5" value={formData.incidentDetails.description} onChange={(e) => handleInputChange(e, 'incidentDetails')} placeholder="Please describe what happened..." />
                        </div>
                    </motion.div>
                );

            case 4:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="form-step-container">
                        <div className="step-guidance">
                            <h2><Zap size={28} /> Perpetrator & Risk</h2>
                            <p className="reassurance-microcopy">Information about the person causing harm helps us assess your risk level.</p>
                        </div>

                        <div className="form-grid-2">
                            <div className="input-group-fluid">
                                <label>Name of Perpetrator</label>
                                <input type="text" name="name" value={formData.perpetrator.name} onChange={(e) => handleInputChange(e, 'perpetrator')} />
                            </div>
                            <div className="input-group-fluid">
                                <label>Relationship to You</label>
                                <select name="relationship" value={formData.perpetrator.relationship} onChange={(e) => handleInputChange(e, 'perpetrator')}>
                                    <option value="">Select...</option>
                                    <option value="husband">Husband</option>
                                    <option value="partner">Partner</option>
                                    <option value="in-laws">In-laws</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <label className="risk-card-check">
                            <input type="checkbox" checked={formData.perpetrator.livesWithVictim} onChange={(e) => setFormData(p => ({ ...p, perpetrator: { ...p.perpetrator, livesWithVictim: e.target.checked } }))} />
                            <div className="risk-card-content">Only they live with you?</div>
                        </label>

                        <label className="section-title" style={{ marginTop: '24px' }}>Risk Indicators (Check all that apply)</label>
                        <div className="risk-question-stack">
                            {[
                                { k: 'threatToKill', l: 'Has he threatened to kill you?' },
                                { k: 'weaponUse', l: 'Has he used or threatened with a weapon?' },
                                { k: 'strangulationIndex', l: 'Has he ever tried to choke/strangle you?' },
                                { k: 'escalatingViolence', l: 'is the violence getting worse or more frequent?' }
                            ].map(item => (
                                <label key={item.k} className={`risk-card-check ${formData.riskAssessment.indicators[item.k] ? 'checked' : ''}`}>
                                    <input type="checkbox" checked={formData.riskAssessment.indicators[item.k]}
                                        onChange={(e) => setFormData(p => ({ ...p, riskAssessment: { ...p.riskAssessment, indicators: { ...p.riskAssessment.indicators, [item.k]: e.target.checked } } }))} />
                                    <div className="risk-card-content">
                                        <AlertTriangle size={18} color={formData.riskAssessment.indicators[item.k] ? '#dc2626' : '#64748b'} />
                                        {item.l}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </motion.div>
                );

            case 5:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="form-step-container">
                        <div className="step-guidance">
                            <h2><Heart size={28} /> Medical & Children</h2>
                        </div>

                        <div className="form-section-fluid">
                            <label className="section-title">Children</label>
                            <label className="risk-card-check">
                                <input type="checkbox" checked={formData.children.hasChildren} onChange={(e) => setFormData(p => ({ ...p, children: { ...p.children, hasChildren: e.target.checked } }))} />
                                <div className="risk-card-content">Do you have children?</div>
                            </label>

                            {formData.children.hasChildren && (
                                <div className="input-group-fluid" style={{ marginTop: '12px', marginLeft: '36px' }}>
                                    <label>Number of Children</label>
                                    <input type="number" style={{ maxWidth: '100px' }} value={formData.children.count} onChange={(e) => setFormData(p => ({ ...p, children: { ...p.children, count: e.target.value } }))} />
                                </div>
                            )}
                        </div>

                        <div className="form-section-fluid">
                            <label className="section-title">Injuries</label>
                            <label className="risk-card-check">
                                <input type="checkbox" checked={formData.medical.hasInjuries} onChange={(e) => setFormData(p => ({ ...p, medical: { ...p.medical, hasInjuries: e.target.checked } }))} />
                                <div className="risk-card-content">Do you have physical injuries?</div>
                            </label>

                            <label className="risk-card-check" style={{ marginTop: '8px' }}>
                                <input type="checkbox" checked={formData.medical.needImmediateHelp} onChange={(e) => setFormData(p => ({ ...p, medical: { ...p.medical, needImmediateHelp: e.target.checked } }))} />
                                <div className="risk-card-content" style={{ color: '#dc2626' }}>Do you need immediate medical attention?</div>
                            </label>
                        </div>
                    </motion.div>
                );

            case 6:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="form-step-container">
                        <div className="step-guidance">
                            <h2><Upload size={28} /> Evidence Upload</h2>
                            <p className="reassurance-microcopy">Photos, audio recordings, or videos can differntiate "he said/she said". We store these securely.</p>
                        </div>

                        <div className="upload-placeholder" onClick={() => document.getElementById('file-upload').click()}>
                            <Upload size={40} color="var(--primary-color)" />
                            <div className="upload-txt">
                                <strong>Tap to Upload Evidence</strong>
                                <span>Photos, Videos, PDF Reports</span>
                            </div>
                            <input id="file-upload" type="file" multiple style={{ display: 'none' }} onChange={handleFileUpload} />
                        </div>

                        {evidenceFiles.length > 0 && (
                            <div style={{ marginTop: '24px' }}>
                                {evidenceFiles.map((f, i) => (
                                    <div key={i} style={{ padding: '8px', background: 'white', borderRadius: '8px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{f.name}</span>
                                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{(f.size / 1024).toFixed(1)} KB</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                );

            case 7:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="form-step-container">
                        <div className="step-guidance">
                            <h2><CheckCircle size={28} /> Review & Submit</h2>
                            <p className="reassurance-microcopy">Please review your details. Once submitted, we will prioritize your safety and route this to the right team.</p>
                        </div>

                        <div className="review-card">
                            <h4>Personal</h4>
                            <p>Name: {formData.personalDetails.name}</p>
                            <p>Safe Contact: {formData.personalDetails.safeContact.phone}</p>
                        </div>
                        <div className="review-card" style={{ marginTop: '16px' }}>
                            <h4>Incident</h4>
                            <p>Type: {formData.incidentDetails.abuseTypes.join(', ')}</p>
                            <p>Perpetrator: {formData.perpetrator.name} ({formData.perpetrator.relationship})</p>
                        </div>

                        <div className="form-footer-nav" style={{ border: 'none' }}>
                            <button className="btn-nav-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1.1rem' }} onClick={handleSubmit} disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit Securely'}
                            </button>
                        </div>
                    </motion.div>
                );

            case 8: // Success State
                return (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="success-feedback-fluid">
                        <div className="success-pulse"><CheckCircle size={48} /></div>
                        <h2>Report Received</h2>
                        <p className="success-msg">Your report (ID: {submissionResult?.reportId}) has been securely logged.</p>

                        <div className="next-steps-info">
                            <h4>Recommended Actions:</h4>
                            {submissionResult?.routing?.destinations?.map(dest => (
                                <div key={dest} style={{ marginBottom: '12px', padding: '12px', background: 'white', borderRadius: '8px', borderLeft: '4px solid var(--primary-color)' }}>
                                    <strong>{dest}</strong>
                                    <p style={{ fontSize: '0.9rem', margin: 0 }}>Our system has flagged this for {dest} intervention.</p>
                                </div>
                            ))}
                        </div>

                        <div className="success-nav">
                            <button className="btn-nav-primary" onClick={() => navigate('/victim-dashboard')}>Go to My Dashboard</button>
                        </div>
                    </motion.div>
                );

            default: return null;
        }
    };

    return (
        <>
            {/* Emergency Overlay — renders above everything when triggered */}
            {emergencyActive && (
                <EmergencyOverlay onSessionEnd={() => setEmergencyActive(false)} />
            )}
            <div className="witness-report-dashboard-flow">
                <div className="report-flow-layout">
                    <div className="report-main-column">
                        {/* Header / Stepper */}
                        {step < 8 && (
                            <div className="stepper-track-fluid">
                                <div className="stepper-fill" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
                                {steps.map((s, i) => (
                                    <div key={i} className={`step-node ${step > i + 1 ? 'done' : ''} ${step === i + 1 ? 'active' : ''}`}>
                                        <div className="node-circle">{i + 1}</div>
                                        <div className="node-lbl">{s.title}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="form-card-fluid">
                            <AnimatePresence mode='wait'>
                                {renderStep()}
                            </AnimatePresence>

                            {step > 1 && step < 7 && (
                                <div className="form-footer-nav">
                                    <div className="nav-button-group">
                                        <button className="btn-nav-outline" onClick={() => setStep(s => s - 1)}><ArrowLeft size={18} /> Back</button>
                                        <button className="btn-nav-primary" onClick={() => setStep(s => s + 1)}>Next <ArrowRight size={18} /></button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VictimReport;
