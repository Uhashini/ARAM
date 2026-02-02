import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, ArrowLeft, AlertTriangle, Zap, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import '../App.css';

const CycleOfViolence = () => {
    const navigate = useNavigate();

    const stages = [
        {
            title: "1. Tension Building",
            items: ["Partner becomes moody/silent", "Walking on eggshells", "You feel afraid of doing something 'wrong'"],
            icon: <AlertTriangle size={24} color="#f59e0b" />,
            color: "rgba(245, 158, 11, 0.05)"
        },
        {
            title: "2. The Incident",
            items: ["Verbal, physical, or sexual abuse occurs", "Intense control/humiliation", "Threats of harm"],
            icon: <Zap size={24} color="#ef4444" />,
            color: "rgba(239, 68, 68, 0.05)"
        },
        {
            title: "3. Reconciliation / Honeymoon",
            items: ["Partner apologizes and promises to change", "Blaming the victim ('You made me do it')", "Giving gifts or extra affection"],
            icon: <Heart size={24} color="var(--secondary-color)" />,
            color: "rgba(198, 142, 242, 0.05)"
        },
        {
            title: "4. Calm",
            items: ["Abuse stops for a while", "Victim starts to believe the partner is 'back to normal'", "Cycle begins again when friction arises"],
            icon: <RefreshCw size={24} color="var(--primary-color)" />,
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
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>The Cycle of Violence</h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
                        Abuse is rarely constant; it usually follows a pattern that keeps the victim trapped.
                    </p>
                </header>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '800px', margin: '0 auto' }}>
                    {stages.map((stage, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            style={{
                                background: 'var(--white)',
                                padding: '2.5rem',
                                borderRadius: '1.5rem',
                                boxShadow: 'var(--shadow-md)',
                                backgroundColor: stage.color,
                                display: 'grid',
                                gridTemplateColumns: 'min-content 1fr',
                                gap: '1.5rem',
                                alignItems: 'start'
                            }}
                        >
                            <div style={{ background: 'white', padding: '1rem', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                {stage.icon}
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem', color: 'var(--text-main)' }}>{stage.title}</h3>
                                <ul style={{ paddingLeft: '1.2rem', margin: 0, color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                                    {stage.items.map((item, i) => (
                                        <li key={i} style={{ marginBottom: '0.5rem' }}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div style={{ marginTop: '5rem', textAlign: 'center', padding: '3rem', borderRadius: '1.5rem', border: '2px dashed #cbd5e1' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>How to break the cycle?</h2>
                    <p style={{ maxWidth: '600px', margin: '0 auto 2rem', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        Breaking the cycle is incredibly difficult and often requires outside support. We are here to help you plan your next steps safely.
                    </p>
                    <button onClick={() => navigate('/self-screen')} className="btn-primary" style={{ padding: '1rem 3rem' }}>
                        Secure Self Screening
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CycleOfViolence;
