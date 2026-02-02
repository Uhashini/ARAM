import React from 'react';
import { motion } from 'framer-motion';
import { Info, ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import '../App.css';

const WhatIsIPV = () => {
    const navigate = useNavigate();

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
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>What is IPV?</h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
                        Understanding the definition and scope of Intimate Partner Violence.
                    </p>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ background: 'var(--white)', padding: '3rem', borderRadius: '1.5rem', boxShadow: 'var(--shadow-lg)', maxWidth: '800px', margin: '0 auto' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ background: 'rgba(37, 99, 235, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                            <Info size={32} color="var(--primary-color)" />
                        </div>
                        <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>The Definition</h2>
                    </div>

                    <div style={{ lineHeight: '1.8', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        <p style={{ marginBottom: '1.5rem' }}>
                            <strong>Intimate Partner Violence (IPV)</strong> is a serious public health problem. It describes physical, sexual, or psychological harm by a current or former partner or spouse. This type of violence can occur among heterosexual or same-sex couples and does not require sexual intimacy.
                        </p>

                        <h3 style={{ color: 'var(--text-main)', marginBottom: '1rem', marginTop: '2rem' }}>Key Facts</h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '1rem', display: 'flex', gap: '0.75rem' }}>
                                <Shield size={20} color="var(--success)" style={{ flexShrink: 0, marginTop: '5px' }} />
                                <span>It can happen to anyone, regardless of age, gender, race, or economic status.</span>
                            </li>
                            <li style={{ marginBottom: '1rem', display: 'flex', gap: '0.75rem' }}>
                                <Shield size={20} color="var(--success)" style={{ flexShrink: 0, marginTop: '5px' }} />
                                <span>It includes stalking and psychological aggression, not just physical touch.</span>
                            </li>
                            <li style={{ marginBottom: '1rem', display: 'flex', gap: '0.75rem' }}>
                                <Shield size={20} color="var(--success)" style={{ flexShrink: 0, marginTop: '5px' }} />
                                <span>IPV often starts with small controlling behaviors that escalate over time.</span>
                            </li>
                        </ul>

                        <p style={{ marginTop: '2rem' }}>
                            Understanding that IPV is not just "a private family matter" but a violation of human rights is the first step toward seeking help or supporting others.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default WhatIsIPV;
