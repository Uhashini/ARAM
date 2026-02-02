import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, AlertTriangle, MessageCircle, HeartHandshake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import '../App.css';

const RecognizeWitness = () => {
    const navigate = useNavigate();

    const signs = [
        {
            title: "Behavioral Changes",
            content: "Does your friend seem anxious, quiet, or withdrawn? Do they cancel plans last minute or seem afraid of their partner's reaction?",
            icon: <AlertTriangle size={24} color="#f59e0b" />
        },
        {
            title: "Constant Monitoring",
            content: "Does their partner call or text them constantly? Do they seem stressed about having to respond immediately or 'get home on time'?",
            icon: <Users size={24} color="var(--primary-color)" />
        },
        {
            title: "Physical Changes",
            content: "Have you noticed unexplained bruises or injuries? Do they wear long sleeves in hot weather to hide marks?",
            icon: <AlertTriangle size={24} color="#ef4444" />
        },
        {
            title: "Excuses and Defensiveness",
            content: "Do they constantly apologize for their partner's behavior or make excuses for why they are acting that way?",
            icon: <MessageCircle size={24} color="var(--secondary-color)" />
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
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>How to Help a Friend</h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
                        Being a witness means observing signs that something isn't right. Your support can be a lifeline.
                    </p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {signs.map((sign, idx) => (
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
                                backgroundColor: idx % 2 === 0 ? 'rgba(37, 99, 235, 0.02)' : 'rgba(198, 142, 242, 0.02)'
                            }}
                        >
                            <div style={{ marginBottom: '1.5rem' }}>{sign.icon}</div>
                            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>{sign.title}</h3>
                            <p style={{ lineHeight: '1.7', color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
                                {sign.content}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <div style={{ marginTop: '5rem', padding: '3.5rem', background: 'var(--primary-color)', borderRadius: '2rem', color: 'white', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <HeartHandshake size={64} />
                    </div>
                    <h2 style={{ marginBottom: '1rem' }}>Your intervention matters.</h2>
                    <p style={{ fontSize: '1.2rem', marginBottom: '2.5rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                        You can report concerns anonymously or learn safe intervention techniques in our Witness Center.
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={() => navigate('/witness')} className="btn-primary" style={{ background: 'white', color: 'var(--primary-color)', padding: '1rem 3rem', fontSize: '1.1rem' }}>
                            Go to Witness Center
                        </button>
                        <button onClick={() => navigate('/helplines')} className="btn-outline" style={{ borderColor: 'white', color: 'white', padding: '1rem 3rem', fontSize: '1.1rem' }}>
                            Get Emergency Info
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecognizeWitness;
