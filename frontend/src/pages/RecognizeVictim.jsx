import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Eye, Lock, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import '../App.css';

const RecognizeVictim = () => {
    const navigate = useNavigate();

    const signals = [
        {
            title: "Control over Daily Life",
            content: "Does your partner monitor your phone, tell you what to wear, or check your mileage or location constantly?",
            icon: <Lock size={24} color="var(--primary-color)" />
        },
        {
            title: "Fear and Anxiety",
            content: "Do you feel like you are 'walking on eggshells'? Are you afraid of how they will react to minor disagreements?",
            icon: <Eye size={24} color="#ef4444" />
        },
        {
            title: "Isolation",
            content: "Has your partner made it difficult for you to see your family or friends? Do they discourage you from working?",
            icon: <User size={24} color="var(--secondary-color)" />
        },
        {
            title: "Self-Doubt",
            content: "Do you find yourself constantly apologizing or feeling like everything is your fault?",
            icon: <HelpCircle size={24} color="#f59e0b" />
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
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Is This Happening to You?</h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
                        Recognizing that you might be in an abusive relationship is an incredibly difficult first step.
                    </p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {signals.map((signal, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            style={{
                                background: 'white',
                                padding: '2.5rem',
                                borderRadius: '1.25rem',
                                boxShadow: 'var(--shadow-md)',
                                borderLeft: `5px solid ${idx % 2 === 0 ? 'var(--primary-color)' : 'var(--secondary-color)'}`
                            }}
                        >
                            <div style={{ marginBottom: '1.5rem' }}>{signal.icon}</div>
                            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>{signal.title}</h3>
                            <p style={{ lineHeight: '1.7', color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
                                {signal.content}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <div style={{ marginTop: '5rem', padding: '3.5rem', background: 'white', borderRadius: '2rem', boxShadow: 'var(--shadow-lg)', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>You deserve to live without fear.</h2>
                    <p style={{ fontSize: '1.2rem', marginBottom: '2.5rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                        We have a private, secure screening tool that can help you assess your risk more clearly.
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={() => navigate('/self-screen')} className="btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
                            Take a Safety Check
                        </button>
                        <button onClick={() => navigate('/helplines')} className="btn-outline" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
                            Find Support Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecognizeVictim;
