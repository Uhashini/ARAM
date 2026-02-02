import React from 'react';
import { motion } from 'framer-motion';
import { Eye, AlertTriangle, UserX, Smartphone, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import '../App.css';

const RecognizeAbusePage = () => {
    const navigate = useNavigate();

    const redFlags = [
        {
            title: "Behavioral Warning Signs",
            icon: <UserX size={24} color="#f59e0b" />,
            items: [
                "Extreme jealousy or possessiveness",
                "Constant put-downs or public humiliation",
                "Explosive temper triggered by minor things",
                "Pressure to isolate from friends and family",
                "Blaming you for their own abusive behavior"
            ],
            color: "rgba(245, 158, 11, 0.05)"
        },
        {
            title: "Digital & Tech Abuse",
            icon: <Smartphone size={24} color="var(--primary-color)" />,
            items: [
                "Demanding passwords to your social media/email",
                "Checking your phone log constantly",
                "Using GPS or trackers to follow you",
                "Sending constant threatening texts",
                "Posting private photos without consent"
            ],
            color: "rgba(37, 99, 235, 0.05)"
        },
        {
            title: "Physical Indicators",
            icon: <AlertTriangle size={24} color="#ef4444" />,
            items: [
                "Unexplained bruises or 'accidents'",
                "Wearing concealing clothes out of season",
                "Being prevented from sleeping or eating",
                "Partner grabbing or shoving 'playfully' but hard",
                "Property destruction (breaking your things)"
            ],
            color: "rgba(239, 68, 68, 0.05)"
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
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Recognizing the Signs</h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
                        Abuse can be subtle and doesn't always leave a mark. Trust your instincts.
                    </p>
                </header>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
                    {redFlags.map((section, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            style={{
                                background: 'var(--white)',
                                padding: '2rem',
                                borderRadius: '1.25rem',
                                boxShadow: 'var(--shadow-sm)',
                                backgroundColor: section.color,
                                display: 'grid',
                                gridTemplateColumns: '80px 1fr',
                                gap: '1rem'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '0.5rem' }}>
                                <div style={{ background: 'white', padding: '1rem', borderRadius: '50%', height: 'fit-content', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                    {section.icon}
                                </div>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>{section.title}</h3>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {section.items.map((item, i) => (
                                        <li key={i} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
                                            <div style={{ minWidth: '8px', height: '8px', borderRadius: '50%', background: 'currentColor', marginTop: '10px', opacity: 0.5 }}></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div style={{ marginTop: '4rem', textAlign: 'center', padding: '3rem', border: '2px dashed #cbd5e1', borderRadius: '1.5rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Seeing these signs in someone else?</h2>
                    <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                        Being a supportive witness can save a life. Learn how to intervene safely.
                    </p>
                    <button onClick={() => navigate('/witness')} className="btn-secondary" style={{ padding: '1rem 3rem' }}>
                        Go to Witness Center
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecognizeAbusePage;
