import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Sun, CloudRain, Search, Menu, User, Settings, Bell } from 'lucide-react';

/**
 * StealthOverlay acts as a convincing camouflage for the application.
 * It mimics a modern weather/news portal.
 */
const StealthOverlay = ({ isVisible, onExit }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                backgroundColor: '#f1f5f9',
                fontFamily: 'sans-serif',
                color: '#1e293b',
                overflow: 'hidden'
            }}
        >
            {/* Top Bar */}
            <nav style={{
                height: '60px',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 2rem',
                borderBottom: '1px solid #e2e8f0'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Cloud color="#3b82f6" /> SkyCast News
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
                        <span>Local</span>
                        <span>National</span>
                        <span>World</span>
                        <span>Lifestyle</span>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: '#64748b' }}>
                    <Search size={20} />
                    <Bell size={20} />
                    <User size={20} />
                    <Menu size={20} />
                </div>
            </nav>

            <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

                    {/* Main Story */}
                    <article>
                        <div style={{
                            height: '400px',
                            background: 'linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%), url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '1.5rem',
                            padding: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            color: 'white'
                        }}>
                            <span style={{ background: '#3b82f6', alignSelf: 'flex-start', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '1rem' }}>FEATURED</span>
                            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>New High-Speed Rail Project Approved for Northern Districts</h1>
                            <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>The $12B infrastructure project promises to reduce commute times by 40% starting 2027.</p>
                        </div>

                        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                                <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=400&q=80" style={{ width: '100%', borderRadius: '0.5rem', height: '150px', objectFit: 'cover', marginBottom: '1rem' }} alt="Lifestyle" />
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Top 10 Indoor Plants for Low Light</h3>
                                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Bring life to your home office with these resilient greens...</p>
                            </div>
                            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                                <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80" style={{ width: '100%', borderRadius: '0.5rem', height: '150px', objectFit: 'cover', marginBottom: '1rem' }} alt="Tech" />
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>The Future of AI in Daily Life</h3>
                                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>How embedded AI is quietly changing the way we interact with appliances...</p>
                            </div>
                        </div>
                    </article>

                    {/* Sidebar Weather */}
                    <aside>
                        <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', borderRadius: '1.5rem', padding: '2rem', color: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.2rem', margin: 0 }}>New Delhi, IN</h2>
                                    <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                                </div>
                                <Sun size={32} />
                            </div>
                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <div style={{ fontSize: '4.5rem', fontWeight: 'bold' }}>28°</div>
                                <div style={{ fontSize: '1.2rem' }}>Clear Skies</div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1.5rem' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Humidity</p>
                                    <p style={{ fontWeight: 'bold' }}>42%</p>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Wind</p>
                                    <p style={{ fontWeight: 'bold' }}>12km/h</p>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>UV Index</p>
                                    <p style={{ fontWeight: 'bold' }}>High</p>
                                </div>
                            </div>
                        </div>

                        {/* Safe Recovery Shortcut Tip (Hidden in plain sight) */}
                        <div style={{ marginTop: '2rem', padding: '1rem', borderRadius: '1rem', border: '1px dashed #cbd5e1', fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center' }}>
                            Press <kbd style={{ background: '#f8fafc', padding: '2px 4px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>Esc</kbd> + <kbd style={{ background: '#f8fafc', padding: '2px 4px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>X</kbd> to refresh workspace.
                        </div>

                        <div style={{ marginTop: '2rem' }}>
                            <h4 style={{ marginBottom: '1rem', color: '#475569' }}>Trending Stories</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[1, 2, 3].map(i => (
                                    <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#cbd5e1' }}>0{i}</div>
                                        <p style={{ fontSize: '0.95rem', fontWeight: '500' }}>Economic growth surpasses expectations in Q3</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                </div>
            </div>

            {/* Emergency Exit Shortcut button - if they click this specifically, it closes the overlay */}
            <button
                onClick={onExit}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    opacity: 0, // Totally invisible
                    width: '50px',
                    height: '50px',
                    cursor: 'default'
                }}
                aria-hidden="true"
            >
                Exit
            </button>
        </motion.div>
    );
};

export default StealthOverlay;
