import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Accordion = ({ title, children, defaultOpen = false, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div style={{ marginBottom: '1rem', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '0.75rem', overflow: 'hidden', background: '#fff' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    padding: '1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: isOpen ? 'rgba(198, 142, 242, 0.15)' : 'rgba(198, 142, 242, 0.05)', // Lavender tint
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.2s ease'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {Icon && <Icon size={20} color="var(--secondary-color)" />}
                    <span style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-main)' }}>{title}</span>
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
                        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)', fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Accordion;
