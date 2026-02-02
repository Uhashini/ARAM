import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Info, Heart, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import '../App.css';

const UnderstandAbusePage = () => {
    const navigate = useNavigate();

    const sections = [
        {
            title: "The Cycle of Abuse",
            icon: <Info size={24} color="var(--primary-color)" />,
            content: "Abuse often follows a predictable pattern. It starts with a 'Tension Building' phase where things feel 'on edge.' This leads to an 'Incident' (verbal, physical, or sexual abuse). Afterward comes the 'Honeymoon' phase where the abuser apologizes or promises to change, creating a false sense of hope.",
            color: "rgba(37, 99, 235, 0.05)"
        },
        {
            title: "Power and Control",
            icon: <Shield size={24} color="var(--secondary-color)" />,
            content: "Domestic violence is not about losing control; it's about gaining control. Abusers use various tactics—isolation from friends, controlling finances, monitoring phones, and emotional manipulation—to maintain a position of power over their partner.",
            color: "rgba(198, 142, 242, 0.05)"
        },
        {
            title: "Types of Abuse",
            icon: <AlertCircle size={24} color="#ef4444" />,
            content: "Abuse isn't always physical. It can be Emotional (insults, constant criticism), Financial (taking money, preventing work), Digital (spyware, password demands), or Sexual (coercion). All forms are serious violations of safety.",
            color: "rgba(239, 68, 68, 0.05)"
        },
        {
            title: "Why Leaving is Hard",
            icon: <Heart size={24} color="var(--accent-color)" />,
            content: "Leaving is the most dangerous time for a victim. Barriers include fear of retaliation, financial dependence, concern for children, and the emotional 'trauma bond' created by the cycle of abuse. Support and safety planning are essential.",
            color: "rgba(139, 92, 246, 0.05)"
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
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Understanding Abuse</h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
                        Knowledge is the first step toward safety. Learn about the mechanics of intimate partner violence.
                    </p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {sections.map((section, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            style={{
                                background: 'var(--white)',
                                padding: '2.5rem',
                                borderRadius: '1.25rem',
                                boxShadow: 'var(--shadow-md)',
                                backgroundColor: section.color,
                                border: '1px solid rgba(0,0,0,0.03)'
                            }}
                        >
                            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                {section.icon}
                                <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)' }}>{section.title}</h3>
                            </div>
                            <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
                                {section.content}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <div style={{ marginTop: '4rem', padding: '3rem', background: 'var(--primary-color)', borderRadius: '1.5rem', color: 'white', textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '1rem' }}>You are not alone.</h2>
                    <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}>
                        If this resonates with your situation, we have tools to help you plan your safety.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button onClick={() => navigate('/self-screen')} className="btn-primary" style={{ background: 'white', color: 'var(--primary-color)', padding: '1rem 2rem' }}>
                            Take a Safety Check
                        </button>
                        <button onClick={() => navigate('/helplines')} className="btn-outline" style={{ borderColor: 'white', color: 'white', padding: '1rem 2rem' }}>
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnderstandAbusePage;
