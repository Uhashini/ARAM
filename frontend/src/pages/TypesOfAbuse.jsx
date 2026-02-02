import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, Zap, DollarSign, Smartphone, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import '../App.css';

const TypesOfAbuse = () => {
    const navigate = useNavigate();

    const types = [
        {
            title: "Physical Abuse",
            description: "Hitting, slapping, choking, use of weapons, or any physical force intended to hurt or control.",
            icon: <ShieldAlert size={28} color="#ef4444" />,
            color: "rgba(239, 68, 68, 0.05)"
        },
        {
            title: "Emotional Abuse",
            description: "Constant criticism, humiliation, manipulation, gaslighting, or threats to make you feel worthless.",
            icon: <AlertCircle size={28} color="var(--secondary-color)" />,
            color: "rgba(198, 142, 242, 0.05)"
        },
        {
            title: "Financial Abuse",
            description: "Controlling your access to money, preventing you from working, or making you ask for every rupee.",
            icon: <DollarSign size={28} color="#059669" />,
            color: "rgba(5, 150, 105, 0.05)"
        },
        {
            title: "Sexual Abuse",
            description: "Forcing or coercing any sexual act or behavior without consent, including marital rape.",
            icon: <Zap size={28} color="#f59e0b" />,
            color: "rgba(245, 158, 11, 0.05)"
        },
        {
            title: "Digital Abuse",
            description: "Monitoring your phone, demanding passwords, using GPS to track you, or harassment via social media.",
            icon: <Smartphone size={28} color="var(--primary-color)" />,
            color: "rgba(37, 99, 235, 0.05)"
        }
    ];

    return (
        <div className="app-container">
            <Navigation />

            <div className="container" style={{ padding: '3rem 1.5rem', minHeight: '85vh' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '2rem', fontSize: '1rem' }}
                >
                    <ArrowLeft size={18} /> Back to Home
                </button>

                <header style={{ marginBottom: '4rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Types of Abuse</h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
                        Abuse manifests in many forms. Recognizing these patterns is crucial for safety.
                    </p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {types.map((type, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -5 }}
                            style={{
                                background: 'var(--white)',
                                padding: '2.5rem',
                                borderRadius: '1.25rem',
                                boxShadow: 'var(--shadow-md)',
                                backgroundColor: type.color,
                                border: '1px solid rgba(0,0,0,0.02)'
                            }}
                        >
                            <div style={{ marginBottom: '1.5rem' }}>{type.icon}</div>
                            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--text-main)' }}>{type.title}</h3>
                            <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                                {type.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TypesOfAbuse;
