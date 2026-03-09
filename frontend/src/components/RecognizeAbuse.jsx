import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const RecognizeAbuse = () => {
    const navigate = useNavigate();

    return (
        <section className="recognize-section">
            <div className="container">
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    Recognize the Signs
                </motion.h2>
                <motion.p
                    className="section-subtitle"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    <strong className="subtitle-emphasis">Abuse can be subtle.</strong> Here are common indicators to look out for in <span className="subtitle-highlight">yourself or others.</span>
                </motion.p>
                <div className="duel-grid">
                    <motion.div
                        className="feature-card"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <h3>For Victims</h3>
                        <p>
                            Do you feel afraid of your partner? Do they control who you see or where you go?
                            You are not alone, and help is available.
                        </p>
                        <button className="btn-outline" onClick={() => navigate('/recognize-signs/victims')}>
                            Recognize Signs
                        </button>
                    </motion.div>
                    <motion.div
                        className="feature-card"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <h3>For Witnesses</h3>
                        <p>
                            Have you noticed a friend withdrawing or showing unexplained injuries?
                            Learn how to safely intervene or report your concerns.
                        </p>
                        <button className="btn-outline" onClick={() => navigate('/recognize-signs/witnesses')}>
                            How to Recognize
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default RecognizeAbuse;
