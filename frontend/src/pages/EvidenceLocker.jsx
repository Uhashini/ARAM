import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FolderLock,
    Upload,
    FileText,
    Image as ImageIcon,
    File,
    Trash2,
    Eye,
    Plus,
    X,
    AlertCircle,
    Download
} from 'lucide-react';
import Navigation from '../components/Navigation';
import '../App.css';

const EvidenceLocker = () => {
    const navigate = useNavigate();
    const [evidence, setEvidence] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadTitle, setUploadTitle] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Pin Management States
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [hasPin, setHasPin] = useState(null); // null = checking, true/false
    const [pin, setPin] = useState('');
    const [pinError, setPinError] = useState('');
    const [verifying, setVerifying] = useState(false);

    const API_BASE = 'http://127.0.0.1:5001';

    const fetchEvidence = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const response = await fetch(`${API_BASE}/api/evidence`, {
                headers: { 'Authorization': `Bearer ${userInfo.token}` }
            });
            const data = await response.json();
            if (Array.isArray(data)) {
                setEvidence(data);
            } else {
                setEvidence([]); // Fallback to empty array
            }
        } catch (error) {
            console.error('Failed to fetch evidence', error);
        } finally {
            setLoading(false);
        }
    };

    const checkLockerStatus = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const response = await fetch(`${API_BASE}/api/evidence/check-pin`, {
                headers: { 'Authorization': `Bearer ${userInfo.token}` }
            });
            const data = await response.json();
            setHasPin(data.hasPin);

            // If user has no pin, they must set one first, but we show the setup screen
            // If they have a pin, we show the unlock screen
        } catch (error) {
            console.error('Failed to check locker status', error);
        }
    };

    useEffect(() => {
        checkLockerStatus();
    }, []);

    useEffect(() => {
        if (isUnlocked) {
            fetchEvidence();
        }
    }, [isUnlocked]);

    const handleVerifyPin = async (e) => {
        e.preventDefault();
        setVerifying(true);
        setPinError('');

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const response = await fetch(`${API_BASE}/api/evidence/verify-pin`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ pin })
            });
            const data = await response.json();

            if (response.ok) {
                setIsUnlocked(true);
            } else {
                setPinError(data.message || 'Incorrect PIN');
            }
        } catch (error) {
            setPinError('Error verifying PIN');
        } finally {
            setVerifying(false);
        }
    };

    const handleSetPin = async (e) => {
        e.preventDefault();
        if (pin.length < 4) {
            setPinError('PIN must be at least 4 digits');
            return;
        }

        setVerifying(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const response = await fetch(`${API_BASE}/api/evidence/set-pin`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ pin })
            });

            if (response.ok) {
                setHasPin(true);
                setIsUnlocked(true);
            }
        } catch (error) {
            setPinError('Error setting PIN');
        } finally {
            setVerifying(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('title', uploadTitle || selectedFile.name);

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const response = await fetch(`${API_BASE}/api/evidence`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${userInfo.token}` },
                body: formData
            });

            if (response.ok) {
                setShowUploadModal(false);
                setUploadTitle('');
                setSelectedFile(null);
                fetchEvidence();
            }
        } catch (error) {
            console.error('Upload failed', error);
        } finally {
            setUploading(false);
        }
    };

    const getFileIcon = (type) => {
        if (type.startsWith('image/')) return <ImageIcon size={24} color="#10b981" />;
        if (type === 'application/pdf') return <FileText size={24} color="#ef4444" />;
        return <File size={24} color="#64748b" />;
    };

    if (hasPin === null) {
        return (
            <div className="app-container">
                <Navigation />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                    <div className="loader">Checking security status...</div>
                </div>
            </div>
        );
    }

    if (!isUnlocked) {
        return (
            <div className="app-container">
                <Navigation />
                <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="dashboard-card"
                        style={{ maxWidth: '400px', width: '100%', padding: '3rem', textAlign: 'center' }}
                    >
                        <div style={{
                            width: '80px',
                            height: '80px',
                            background: 'var(--primary-light)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 2rem'
                        }}>
                            <FolderLock size={40} color="var(--primary-color)" />
                        </div>

                        <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>
                            {hasPin ? 'Locker Locked' : 'Secure Your Locker'}
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
                            {hasPin
                                ? 'Enter your 4-digit PIN to access your secure evidence.'
                                : 'Choose a 4-digit PIN to secure your evidence. This PIN will be required every time you access the locker.'}
                        </p>

                        <form onSubmit={hasPin ? handleVerifyPin : handleSetPin}>
                            <input
                                type="password"
                                value={pin}
                                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                placeholder="Enter 4-digit PIN"
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    fontSize: '1.5rem',
                                    textAlign: 'center',
                                    letterSpacing: '0.5rem',
                                    borderRadius: '0.75rem',
                                    border: `2px solid ${pinError ? '#ef4444' : '#e2e8f0'}`,
                                    marginBottom: '1rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                autoFocus
                            />

                            {pinError && (
                                <p style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                                    <AlertCircle size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                                    {pinError}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={pin.length < 4 || verifying}
                                className="btn-primary"
                                style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
                            >
                                {verifying ? 'Verifying...' : (hasPin ? 'Unlock Locker' : 'Set PIN & Unlock')}
                            </button>
                        </form>
                    </motion.div>

                    <p style={{ marginTop: '2rem', color: '#94a3b8', fontSize: '0.875rem', maxWidth: '300px', textAlign: 'center' }}>
                        <strong>Note:</strong> This PIN is separate from your account password for an extra layer of stealth security.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <Navigation />
            <div className="container" style={{ padding: '3rem 1.5rem', minHeight: '85vh' }}>

                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <FolderLock size={32} color="var(--primary-color)" />
                            <h1 style={{ fontSize: '2rem', margin: 0 }}>Secure Evidence Locker</h1>
                        </div>
                        <p style={{ color: 'var(--text-secondary)' }}>A safe space to store photos, documents, and proof of incidents. All files are private.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => setIsUnlocked(false)} className="btn-outline" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            Lock Locker
                        </button>
                        <button onClick={() => setShowUploadModal(true)} className="btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <Plus size={20} /> Upload New
                        </button>
                    </div>
                </header>

                <div style={{ marginTop: '2rem' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading Evidence...</div>
                    ) : evidence.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '6rem 2rem',
                            background: 'white',
                            borderRadius: '1.5rem',
                            border: '2px dashed #e2e8f0',
                            color: '#94a3b8'
                        }}>
                            <FolderLock size={64} style={{ marginBottom: '1.5rem', opacity: 0.3 }} />
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No evidence found</h3>
                            <p>Upload files that you want to keep secure and accessible only to you.</p>
                            <button onClick={() => setShowUploadModal(true)} className="btn-outline" style={{ marginTop: '1.5rem' }}>Start First Upload</button>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            {evidence.map((item) => (
                                <motion.div
                                    key={item._id}
                                    whileHover={{ y: -5 }}
                                    className="dashboard-card"
                                    style={{ padding: '1.5rem', background: 'white', borderRadius: '1rem', border: '1px solid #f1f5f9' }}
                                >
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                        <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '0.75rem' }}>
                                            {getFileIcon(item.fileType)}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</h3>
                                            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{new Date(item.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    {item.fileType.startsWith('image/') && (
                                        <div style={{ height: '150px', borderRadius: '0.5rem', overflow: 'hidden', marginBottom: '1.5rem', background: '#f1f5f9' }}>
                                            <img
                                                src={`${API_BASE}/uploads/evidence/${item.fileName}`}
                                                alt={item.title}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <a
                                            href={`${API_BASE}/uploads/evidence/${item.fileName}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn-ghost"
                                            style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                        >
                                            <Eye size={16} /> View
                                        </a>
                                        <button className="btn-ghost" style={{ padding: '0.5rem', color: '#ef4444' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Safety Tip */}
                <div style={{ marginTop: '4rem', padding: '1.5rem', background: '#f0f9ff', borderRadius: '1rem', border: '1px solid #e0f2fe', display: 'flex', gap: '1rem', color: '#0369a1' }}>
                    <AlertCircle size={24} />
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                        <strong>Privacy Tip:</strong> These files are stored on our secure server and are not visible in your phone's photo gallery. Always log out after your session to keep this locker private.
                    </p>
                </div>

                {/* Upload Modal */}
                <AnimatePresence>
                    {showUploadModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                style={{ background: 'white', width: '100%', maxWidth: '500px', borderRadius: '1.5rem', padding: '2.5rem' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                    <h2 style={{ fontSize: '1.5rem' }}>Upload New Evidence</h2>
                                    <button onClick={() => setShowUploadModal(false)} className="btn-ghost" style={{ padding: '0.5rem' }}><X size={24} /></button>
                                </div>

                                <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Item Title</label>
                                        <input
                                            type="text"
                                            value={uploadTitle}
                                            onChange={(e) => setUploadTitle(e.target.value)}
                                            placeholder="e.g., Incident Photo - March 1st"
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-light)' }}
                                            required
                                        />
                                    </div>

                                    <div style={{
                                        border: '2px dashed #e2e8f0',
                                        borderRadius: '1rem',
                                        padding: '2rem',
                                        textAlign: 'center',
                                        background: selectedFile ? '#f0fdf4' : 'transparent',
                                        transition: 'all 0.2s'
                                    }}>
                                        <input
                                            type="file"
                                            id="file-upload"
                                            hidden
                                            onChange={(e) => setSelectedFile(e.target.files[0])}
                                            accept="image/*,application/pdf"
                                        />
                                        <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <Upload size={32} color={selectedFile ? '#10b981' : '#94a3b8'} style={{ marginBottom: '0.5rem' }} />
                                            {selectedFile ? (
                                                <div style={{ color: '#166534', fontWeight: 'bold' }}>{selectedFile.name}</div>
                                            ) : (
                                                <div style={{ color: '#64748b' }}>Click to select a photo or document</div>
                                            )}
                                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>Max file size: 5MB (JPG, PNG, PDF)</p>
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!selectedFile || uploading}
                                        className="btn-primary"
                                        style={{ width: '100%', padding: '1rem' }}
                                    >
                                        {uploading ? 'Uploading...' : 'Securely Upload'}
                                    </button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default EvidenceLocker;
