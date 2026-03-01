import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    Package,
    MessageSquare,
    MapPin,
    Phone,
    ChevronRight,
    ChevronLeft,
    CheckCircle,
    Download,
    AlertCircle
} from 'lucide-react';
import Navigation from '../components/Navigation';
import '../App.css';

const SafetyPlanner = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [planData, setPlanData] = useState({
        goBag: [],
        safeCodeWord: '',
        safeContacts: [{ name: '', phone: '' }],
        safePlace: '',
        escapeRoute: ''
    });

    const steps = [
        {
            title: "Digital Go-Bag",
            icon: <Package size={24} />,
            description: "Identify essential items you need to take if you have to leave quickly.",
            fields: [
                { id: 'gb1', label: 'Important Documents (ID, Passport, Birth Certificates)', type: 'checkbox' },
                { id: 'gb2', label: 'Extra Keys (House, Car)', type: 'checkbox' },
                { id: 'gb3', label: 'Emergency Cash / Credit Cards', type: 'checkbox' },
                { id: 'gb4', label: 'Medications and Prescriptions', type: 'checkbox' },
                { id: 'gb5', label: 'Phone Charger / Power Bank', type: 'checkbox' },
                { id: 'gb6', label: 'Photos of Injuries / Evidence', type: 'checkbox' }
            ]
        },
        {
            title: "Safe Communication",
            icon: <MessageSquare size={24} />,
            description: "Establish a code word with trusted friends or family.",
            fields: [
                { id: 'safeCodeWord', label: 'Your Secret Code Word (meaning "Help, I need to leave")', type: 'text', placeholder: 'e.g., "The weather is very cold today"' },
                { id: 'codeInstructions', label: 'Who knows this word?', type: 'textarea', placeholder: 'List the names of trusted people...' }
            ]
        },
        {
            title: "Emergency Contacts",
            icon: <Phone size={24} />,
            description: "Add people who can help in an emergency.",
            isDynamic: true // We'll handle this manually in the render
        },
        {
            title: "Safe Destination",
            icon: <MapPin size={24} />,
            description: "Plan where you will go and how you will get there.",
            fields: [
                { id: 'safePlace', label: 'Primary Safe Destination', type: 'text', placeholder: 'e.g., A specific friend\'s house, a 24-hour café, etc.' },
                { id: 'escapeRoute', label: 'Planned Escape Route', type: 'textarea', placeholder: 'Describe how you will exit the house safely...' }
            ]
        }
    ];

    const handleCheckboxChange = (label) => {
        setPlanData(prev => ({
            ...prev,
            goBag: prev.goBag.includes(label)
                ? prev.goBag.filter(item => item !== label)
                : [...prev.goBag, label]
        }));
    };

    const handleInputChange = (id, value) => {
        setPlanData(prev => ({ ...prev, [id]: value }));
    };

    const handleContactChange = (index, field, value) => {
        const newContacts = [...planData.safeContacts];
        newContacts[index][field] = value;
        setPlanData(prev => ({ ...prev, safeContacts: newContacts }));
    };

    const addContact = () => {
        setPlanData(prev => ({
            ...prev,
            safeContacts: [...prev.safeContacts, { name: '', phone: '' }]
        }));
    };

    const downloadPlan = () => {
        const docContent = `
PERSONAL SAFETY PLAN
Generated on: ${new Date().toLocaleDateString()}

1. GO-BAG CHECKLIST:
${planData.goBag.length > 0 ? planData.goBag.map(item => `[x] ${item}`).join('\n') : 'No items selected.'}

2. SAFE COMMUNICATION:
Code Word: ${planData.safeCodeWord || 'Not set'}

3. EMERGENCY CONTACTS:
${planData.safeContacts.map(c => `- ${c.name}: ${c.phone}`).join('\n')}

4. SAFE DESTINATION:
Place: ${planData.safePlace || 'Not set'}
Route: ${planData.escapeRoute || 'Not set'}

STAY SAFE. CALL 181 OR 100 IN IMMEDIATE DANGER.
        `;
        const element = document.createElement("a");
        const file = new Blob([docContent], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "Personal_Safety_Note.txt";
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div className="app-container">
            <Navigation />
            <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '800px' }}>

                <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <Shield size={48} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
                    <h1 style={{ fontSize: '2.5rem' }}>Interactive Safety Planner</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Create a personalized plan to stay safe. Your data is not stored permanently on this server unless you choose to save it.</p>
                </header>

                {/* Progress Bar */}
                <div style={{ marginBottom: '3rem', position: 'relative' }}>
                    <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', position: 'relative' }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                            style={{ height: '100%', background: 'var(--primary-color)', borderRadius: '4px' }}
                        />
                    </div>
                </div>

                <div className="dashboard-card" style={{ background: 'white', padding: '2.5rem', borderRadius: '1.5rem', boxShadow: 'var(--shadow-lg)' }}>
                    <AnimatePresence mode="wait">
                        {typeof currentStep === 'number' && (
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                    <div style={{ padding: '0.75rem', background: 'var(--primary-light)', borderRadius: '1rem', color: 'var(--primary-color)' }}>
                                        {steps[currentStep].icon}
                                    </div>
                                    <h2 style={{ fontSize: '1.8rem' }}>{steps[currentStep].title}</h2>
                                </div>
                                <p style={{ marginBottom: '2.5rem', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>{steps[currentStep].description}</p>

                                {/* Dynamic Fields Rendering */}
                                {currentStep === 2 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        {planData.safeContacts.map((contact, idx) => (
                                            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Name</label>
                                                    <input
                                                        type="text"
                                                        value={contact.name}
                                                        onChange={(e) => handleContactChange(idx, 'name', e.target.value)}
                                                        placeholder="Contact Name"
                                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-light)' }}
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Phone</label>
                                                    <input
                                                        type="text"
                                                        value={contact.phone}
                                                        onChange={(e) => handleContactChange(idx, 'phone', e.target.value)}
                                                        placeholder="Phone Number"
                                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-light)' }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        <button onClick={addContact} className="btn-ghost" style={{ alignSelf: 'flex-start' }}>+ Add Another Contact</button>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        {steps[currentStep].fields?.map((field) => (
                                            <div key={field.id}>
                                                {field.type === 'checkbox' ? (
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', padding: '1rem', border: '1px solid #f1f5f9', borderRadius: '0.75rem', background: planData.goBag.includes(field.label) ? 'var(--primary-light)' : 'transparent', transition: 'all 0.2s' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={planData.goBag.includes(field.label)}
                                                            onChange={() => handleCheckboxChange(field.label)}
                                                            style={{ width: '20px', height: '20px', accentColor: 'var(--primary-color)' }}
                                                        />
                                                        <span style={{ fontSize: '1.05rem', fontWeight: planData.goBag.includes(field.label) ? '600' : 'normal' }}>{field.label}</span>
                                                    </label>
                                                ) : field.type === 'textarea' ? (
                                                    <>
                                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>{field.label}</label>
                                                        <textarea
                                                            value={planData[field.id]}
                                                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                                                            placeholder={field.placeholder}
                                                            style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-light)', minHeight: '100px' }}
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>{field.label}</label>
                                                        <input
                                                            type="text"
                                                            value={planData[field.id]}
                                                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                                                            placeholder={field.placeholder}
                                                            style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-light)' }}
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4rem', pt: '2rem', borderTop: '1px solid #f1f5f9' }}>
                                    <button
                                        onClick={() => setCurrentStep(prev => prev - 1)}
                                        disabled={currentStep === 0}
                                        className="btn-outline"
                                        style={{ visibility: currentStep === 0 ? 'hidden' : 'visible' }}
                                    >
                                        <ChevronLeft size={20} /> Previous
                                    </button>

                                    {currentStep === steps.length - 1 ? (
                                        <button onClick={() => setCurrentStep('complete')} className="btn-primary" style={{ padding: '0.75rem 2.5rem' }}>
                                            Preview Plan <CheckCircle size={20} />
                                        </button>
                                    ) : (
                                        <button onClick={() => setCurrentStep(prev => prev + 1)} className="btn-primary" style={{ padding: '0.75rem 2.5rem' }}>
                                            Continue <ChevronRight size={20} />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Completion Modal / View */}
                {currentStep === 'complete' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
                    >
                        <div style={{ background: 'white', width: '100%', maxWidth: '600px', borderRadius: '2rem', padding: '3rem', position: 'relative' }}>
                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <div style={{ width: '80px', height: '80px', background: 'var(--success-bg)', color: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                    <Shield size={40} />
                                </div>
                                <h2>Your Safety Plan is Ready</h2>
                                <p style={{ color: 'var(--text-secondary)' }}>You can now download this plan. Tip: Save it as a generic text file or keep it in your "Evidence Locker".</p>
                            </div>

                            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2.5rem', maxHeight: '300px', overflowY: 'auto', border: '1px solid #e2e8f0' }}>
                                <pre style={{ fontFamily: 'monospace', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                                    {`
1. GO-BAG: ${planData.goBag.join(', ') || 'N/A'}
2. CODE WORD: ${planData.safeCodeWord || 'N/A'}
3. CONTACTS: ${planData.safeContacts.map(c => c.name).join(', ')}
4. DESTINATION: ${planData.safePlace || 'N/A'}
                                    `}
                                </pre>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button onClick={downloadPlan} className="btn-primary" style={{ flex: 1 }}>
                                    Download as Text <Download size={20} />
                                </button>
                                <button onClick={() => setCurrentStep(0)} className="btn-outline" style={{ flex: 1 }}>
                                    Edit Plan
                                </button>
                            </div>

                            <button
                                onClick={() => navigate('/victim-dashboard')}
                                className="btn-ghost"
                                style={{ width: '100%', marginTop: '1.5rem', color: '#64748b' }}
                            >
                                Done, return to Dashboard
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Safety Warning */}
                <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#fffbeb', borderRadius: '1rem', border: '1px solid #fef3c7', display: 'flex', gap: '1rem', color: '#92400e' }}>
                    <AlertCircle size={24} />
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                        <strong>Digital Safety Warning:</strong> Browsing history can be monitored. Always use a safe computer or device that your partner cannot access. Clear your browser history after using this planner.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SafetyPlanner;
