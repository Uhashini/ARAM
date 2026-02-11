import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Accordion = ({ title, children, defaultOpen = false, icon: Icon, variant, iconColor }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const isClean = variant === 'clean';

    return (
        <div style={{
            marginBottom: isClean ? '0' : '1rem',
            border: isClean ? 'none' : '1px solid rgba(0,0,0,0.05)',
            borderRadius: isClean ? '0' : '0.75rem',
            overflow: 'hidden',
            background: isClean ? 'transparent' : '#fff'
        }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    padding: isClean ? '1rem 1.5rem' : '1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: isClean ? 'transparent' : (isOpen ? 'rgba(198, 142, 242, 0.15)' : 'rgba(198, 142, 242, 0.05)'),
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {Icon && <Icon size={20} color={iconColor || (isClean ? "var(--primary-color)" : "var(--secondary-color)")} />}
                    <span style={{
                        fontWeight: isClean ? 700 : 600,
                        fontSize: isClean ? '1rem' : '1.05rem',
                        color: 'var(--text-main)'
                    }}>{title}</span>
                </div>
                {isOpen ? <ChevronUp size={20} color="var(--text-secondary)" /> : <ChevronDown size={20} color="var(--text-secondary)" />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <div style={{
                            padding: isClean ? '0.5rem 1.5rem 1.5rem' : '1.5rem',
                            borderTop: isClean ? 'none' : '1px solid rgba(0,0,0,0.05)',
                            fontSize: '0.95rem',
                            lineHeight: '1.6',
                            color: 'var(--text-secondary)'
                        }}>
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Accordion;
