import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Shield, Lock, Phone, MapPin, Briefcase, FileText,
    CheckCircle, AlertTriangle, ChevronRight, LogOut,
    Plus, Trash2, Save, Info, ArrowLeft, Heart, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './SafetyPlanner.css';
import aramLogo from '../assets/aram-hero-logo.png';

const API_BASE = 'http://127.0.0.1:5001';

const SafetyPlanner = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('checklists');
    const [plan, setPlan] = useState({
        emergencyContacts: [],
        safeLocations: [],
        emergencyBag: [
            { item: 'Cash and credit cards', category: 'money', isPacked: false },
            { item: 'Identity cards (Adhaar, Passport)', category: 'documents', isPacked: false },
            { item: 'House and car keys', category: 'keys', isPacked: false },
            { item: 'Change of clothes (for you and children)', category: 'clothing', isPacked: false },
            { item: 'Prescription medications', category: 'medications', isPacked: false },
            { item: 'Mobile charger and power bank', category: 'electronics', isPacked: false },
            { item: 'Children\'s favorite toys or blankets', category: 'children-items', isPacked: false },
        ],
        importantDocuments: [
            { documentType: 'identification', location: '', copies: 'digital-copy' },
            { documentType: 'bank-records', location: '', copies: 'none' },
            { documentType: 'medical-records', location: '', copies: 'none' },
            { documentType: 'property-papers', location: '', copies: 'none' },
        ],
        safetySteps: {
            beforeIncident: [
                { step: 'Keep my phone charged at all times', priority: 'high' },
                { step: 'Park my car facing out for a quick exit', priority: 'medium' },
                { step: 'Tell a trusted neighbor about the situation', priority: 'high' }
            ],
            duringIncident: [
                { step: 'Stay out of rooms with no exit (e.g. bathroom)', priority: 'critical' },
                { step: 'Avoid rooms with weapons (e.g. kitchen)', priority: 'critical' },
                { step: 'Teach children how to dial emergency services', priority: 'critical' }
            ],
            afterIncident: [
                { step: 'Go to my pre-planned safe location', priority: 'high' },
                { step: 'Seek medical attention and document injuries', priority: 'high' },
                { step: 'Change all passwords and social media privacy', priority: 'medium' }
            ]
        }
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchPlan = async () => {
            const userInfo = localStorage.getItem('userInfo');
            if (!userInfo) {
                navigate('/login');
                return;
            }

            try {
                const { token } = JSON.parse(userInfo);
                const response = await fetch(`${API_BASE}/api/victim/safety-plan`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.plan) {
                    setPlan(data.plan);
                }
            } catch (err) {
                console.error('Failed to fetch safety plan:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlan();
    }, [navigate]);

    const handleSave = async () => {
        setSaving(true);
        const userInfo = localStorage.getItem('userInfo');
        const { token } = JSON.parse(userInfo);

        try {
            const response = await fetch(`${API_BASE}/api/victim/safety-plan`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(plan)
            });

            if (response.ok) {
                setSuccessMsg('Safety Plan saved securely.');
                setTimeout(() => setSuccessMsg(''), 3000);
            }
        } catch (err) {
            console.error('Failed to save plan:', err);
        } finally {
            setSaving(false);
        }
    };

    const toggleBagItem = (index) => {
        const newBag = [...plan.emergencyBag];
        newBag[index].isPacked = !newBag[index].isPacked;
        setPlan({ ...plan, emergencyBag: newBag });
    };

    const handleQuickExit = () => {
        localStorage.removeItem('userInfo');
        window.location.href = 'https://weather.com';
    };

    if (loading) {
        return (
            <div className="loader-container">
                <Shield size={48} className="animate-pulse" color="var(--brand-primary)" />
                <span>Initializing your safety planner...</span>
            </div>
        );
    }

    return (
        <div className="planner-container">
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
                            <span className="breadcrumb-active">Safety Planner</span>
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

            <main className="planner-content animate-fade-in">
                <header className="planner-header">
                    <div className="header-icon-badge">
                        <Shield size={32} />
                    </div>
                    <h1>Personalized Safety Plan</h1>
                    <p>A safety plan is a personalized, practical tool that can help you identify things you can do to be better prepared and stay safe while you are in a relationship, planning to leave, or after you leave.</p>
                </header>

                <div className="planner-tabs">
                    <button className={activeTab === 'checklists' ? 'active' : ''} onClick={() => setActiveTab('checklists')}>
                        <Briefcase size={18} /> Checklists
                    </button>
                    <button className={activeTab === 'steps' ? 'active' : ''} onClick={() => setActiveTab('steps')}>
                        <AlertTriangle size={18} /> Safety Steps
                    </button>
                    <button className={activeTab === 'contacts' ? 'active' : ''} onClick={() => setActiveTab('contacts')}>
                        <Phone size={18} /> Safe Contacts
                    </button>
                </div>

                <div className="tab-pane">
                    <AnimatePresence mode="wait">
                        {activeTab === 'checklists' && (
                            <motion.div
                                key="checklists"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="checklist-section"
                            >
                                <div className="card-column">
                                    <div className="planner-card">
                                        <h3><Briefcase size={20} /> Emergency Bag</h3>
                                        <p className="sub-hint">Items to keep packed and hidden in a safe place.</p>
                                        <div className="items-list">
                                            {plan.emergencyBag.map((item, idx) => (
                                                <div key={idx} className={`checklist-item ${item.isPacked ? 'packed' : ''}`} onClick={() => toggleBagItem(idx)}>
                                                    <div className="check-box">
                                                        {item.isPacked && <CheckCircle size={16} />}
                                                    </div>
                                                    <span>{item.item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="card-column">
                                    <div className="planner-card">
                                        <h3><FileText size={20} /> Critical Documents</h3>
                                        <p className="sub-hint">Ensure you have copies of these important records.</p>
                                        <div className="doc-grid">
                                            {plan.importantDocuments.map((doc, idx) => (
                                                <div key={idx} className="doc-item">
                                                    <span className="doc-type">{doc.documentType.replace('-', ' ')}</span>
                                                    <select
                                                        value={doc.copies}
                                                        onChange={(e) => {
                                                            const newDocs = [...plan.importantDocuments];
                                                            newDocs[idx].copies = e.target.value;
                                                            setPlan({ ...plan, importantDocuments: newDocs });
                                                        }}
                                                    >
                                                        <option value="none">Not Ready</option>
                                                        <option value="physical-copy">Physical Copy</option>
                                                        <option value="digital-copy">Digital Copy</option>
                                                        <option value="both">Both Copies</option>
                                                    </select>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'steps' && (
                            <motion.div
                                key="steps"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="steps-section"
                            >
                                <div className="steps-container">
                                    <div className="step-group">
                                        <div className="step-group-header">
                                            <div className="step-badge before">1</div>
                                            <h4>Safe at Home</h4>
                                        </div>
                                        <div className="steps-list">
                                            {plan.safetySteps.beforeIncident.map((s, i) => (
                                                <div key={i} className="step-item">
                                                    <ArrowLeft size={14} className="step-arrow" />
                                                    {s.step}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="step-group">
                                        <div className="step-group-header">
                                            <div className="step-badge during">2</div>
                                            <h4>In an Incident</h4>
                                        </div>
                                        <div className="steps-list">
                                            {plan.safetySteps.duringIncident.map((s, i) => (
                                                <div key={i} className="step-item critical">
                                                    <AlertTriangle size={14} />
                                                    {s.step}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="step-group">
                                        <div className="step-group-header">
                                            <div className="step-badge after">3</div>
                                            <h4>Planning for Future</h4>
                                        </div>
                                        <div className="steps-list">
                                            {plan.safetySteps.afterIncident.map((s, i) => (
                                                <div key={i} className="step-item">
                                                    <CheckCircle size={14} />
                                                    {s.step}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'contacts' && (
                            <motion.div
                                key="contacts"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="contacts-section"
                            >
                                <div className="planner-card wide">
                                    <div className="card-header-row">
                                        <h3><Phone size={20} /> Safe Emergency Contacts</h3>
                                        <button className="btn-add-mini"><Plus size={16} /> Add Contact</button>
                                    </div>
                                    <div className="contacts-list">
                                        {plan.emergencyContacts.length === 0 ? (
                                            <div className="empty-contacts">
                                                <Info size={24} />
                                                <p>No contacts saved to your safety plan yet.
                                                    Adding safe contacts helps pre-program the panic button.</p>
                                            </div>
                                        ) : (
                                            plan.emergencyContacts.map((c, i) => (
                                                <div key={i} className="contact-row">
                                                    <div className="contact-info">
                                                        <strong>{c.name}</strong>
                                                        <span>{c.phone} • {c.relationship}</span>
                                                    </div>
                                                    <button className="btn-del-mini"><Trash2 size={16} /></button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div className="planner-card wide" style={{ marginTop: 24 }}>
                                    <h3><MapPin size={20} /> Safe Locations</h3>
                                    <div className="locations-grid">
                                        <div className="location-box add-new">
                                            <Plus size={24} />
                                            <span>Add Location</span>
                                        </div>
                                        {plan.safeLocations.map((loc, i) => (
                                            <div key={i} className="location-box">
                                                <strong>{loc.name}</strong>
                                                <p>{loc.address}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <footer className="planner-footer">
                    <div className="save-status">
                        <motion.div animate={{ opacity: successMsg ? 1 : 0 }}>
                            <CheckCircle size={16} color="#10b981" /> {successMsg}
                        </motion.div>
                    </div>
                    <button className="btn-save-plan" onClick={handleSave} disabled={saving}>
                        {saving ? 'Securing...' : <><Save size={18} /> Save Safety Plan</>}
                    </button>
                </footer>
            </main>

            <div className="safe-tip-banner">
                <div className="tip-icon"><Heart size={20} /></div>
                <div className="tip-text">
                    <strong>Safe Browsing Tip:</strong> If your abuser monitors your phone, you can use "Quick Exit" to immediately switch to a weather site and clear your session.
                </div>
            </div>
        </div>
    );
};

export default SafetyPlanner;
