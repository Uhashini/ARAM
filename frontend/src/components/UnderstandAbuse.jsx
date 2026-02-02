import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const UnderstandAbuse = () => {
    const navigate = useNavigate();
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    return (
        <section className="info-section">
            <div className="container">
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Understand Abuse
                </motion.h2>
                <motion.div
                    className="info-grid"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <motion.div className="info-card" variants={itemVariants} whileHover={{ y: -5 }}>
                        <h3>What is IPV?</h3>
                        <p>
                            Intimate Partner Violence (IPV) describes physical, sexual, or psychological harm by a current or former partner or spouse.
                        </p>
                        <button onClick={() => navigate('/understand-abuse/what-is-ipv')} className="btn-text" style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '600' }}>Learn the signs →</button>
                    </motion.div>
                    <motion.div className="info-card" variants={itemVariants} whileHover={{ y: -5 }}>
                        <h3>Types of Abuse</h3>
                        <p>
                            Abuse isn't just physical. It can be emotional, financial, digital, or sexual. Recognizing the patterns is the first step to safety.
                        </p>
                        <button onClick={() => navigate('/understand-abuse/types')} className="btn-text" style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '600' }}>Explore types →</button>
                    </motion.div>
                    <motion.div className="info-card" variants={itemVariants} whileHover={{ y: -5 }}>
                        <h3>Cycle of Violence</h3>
                        <p>
                            Abuse often follows a cycle: tension building, the incident, reconciliation, and calm. Breaking this cycle is possible with support.
                        </p>
                        <button onClick={() => navigate('/understand-abuse/cycle')} className="btn-text" style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '600' }}>Break the cycle →</button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default UnderstandAbuse;
