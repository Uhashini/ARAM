import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, ShieldAlert, Stethoscope, BarChart3 } from 'lucide-react';
import '../App.css';

const RoleSelection = () => {
    const navigate = useNavigate();

    const roles = [
        {
            id: 'witness',
            title: 'Witness',
            icon: <Eye size={48} />,
            description: 'File incident reports with or without disclosing your identity. Help make your community safer.',
            className: 'role-witness',
            actionText: 'Report an Incident',
            route: '/witness'
        },
        {
            id: 'victim',
            title: 'Victim/Survivor',
            icon: <ShieldAlert size={48} />,
            description: 'Access self-screening tools, risk assessments, referrals, and learn more about abuse patterns.',
            className: 'role-victim',
            actionText: 'Get Support',
            route: '/victim-dashboard'
        },
        {
            id: 'healthcare',
            title: 'Healthcare Worker',
            icon: <Stethoscope size={48} />,
            description: 'Find patient records, track injury frequency, calculate risk scores, and plan aftercare.',
            className: 'role-hospital',
            actionText: 'Portal Access',
            route: '/healthcare'
        },
        {
            id: 'admin',
            title: 'Administrator',
            icon: <BarChart3 size={48} />,
            description: 'View visual charts, analyze reports, and manage system data.',
            className: 'role-admin',
            actionText: 'Admin Dashboard',
            route: '/admin'
        }
    ];

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
            opacity: 1
        }
    };

    return (
        <section id="roles" className="roles-section">
            <div className="container">
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Select Your Role
                </motion.h2>
                <motion.div
                    className="roles-grid"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {roles.map((role) => (
                        <motion.div
                            key={role.id}
                            className={`role-card ${role.className}`}
                            variants={itemVariants}
                            whileHover={{ y: -10, transition: { duration: 0.2 } }}
                            onClick={() => navigate(role.route)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="role-icon">{role.icon}</div>
                            <h3 className="role-title">{role.title}</h3>
                            <p className="role-description">{role.description}</p>
                            <motion.button
                                className="role-btn"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(role.route);
                                }}
                            >
                                {role.actionText}
                            </motion.button>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default RoleSelection;
