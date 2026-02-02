import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const SeekingSupport = () => {
    const navigate = useNavigate();

    const handleSupportClick = () => {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            navigate('/login', {
                state: {
                    from: { pathname: '/self-screen' },
                    message: "Please Log In or Sign Up to take the Safety Assessment test."
                }
            });
        } else {
            navigate('/self-screen');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    return (
        <section className="support-section" id="resources">
            <div className="container">
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    Seeking Support
                </motion.h2>
                <motion.div
                    className="info-gridSupport"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    <motion.div className="support-card" variants={itemVariants} whileHover={{ x: 10 }}>
                        <h3>Safety Planning</h3>
                        <p>
                            Create a personalized plan to keep yourself safe while in a relationship, planning to leave, or after leaving.
                        </p>
                        <span className="btn-text" onClick={() => navigate('/safety-planning')} style={{ cursor: 'pointer' }}>Create Plan →</span>
                    </motion.div>
                    <motion.div className="support-card" variants={itemVariants} whileHover={{ x: 10 }}>
                        <h3>Legal Resources</h3>
                        <p>
                            Understand your rights, restraining orders, and legal protections available to you.
                        </p>
                        <span className="btn-text" onClick={() => navigate('/resources/legal')} style={{ cursor: 'pointer' }}>Get Legal Help →</span>
                    </motion.div>
                    <motion.div className="support-card" variants={itemVariants} whileHover={{ x: 10 }}>
                        <h3>Find a Shelter</h3>
                        <p>
                            Locate safe housing and emergency shelters in your area.
                        </p>
                        <span className="btn-text" onClick={() => navigate('/resources/shelters')} style={{ cursor: 'pointer' }}>Find Shelter →</span>
                    </motion.div>
                    <motion.div className="support-card" variants={itemVariants} whileHover={{ x: 10 }}>
                        <h3>Counseling</h3>
                        <p>
                            Connect with professional counselors and take a self-screening assessment for guidance.
                        </p>
                        <span className="btn-text" onClick={handleSupportClick} style={{ cursor: 'pointer' }}>Take Safety Check →</span>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default SeekingSupport;
