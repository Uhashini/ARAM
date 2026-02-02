import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Shield, ExternalLink } from 'lucide-react';
import Navigation from '../components/Navigation';
import '../App.css';

const Helplines = () => {
  const helplines = [
    { name: 'Women Helpline (Domestic Abuse)', number: '181', description: '24/7 Toll-free hotline for women in distress. Provides police, medical, legal, and counseling services.' },
    { name: 'Police Emergency', number: '100', description: 'Immediate police assistance.' },
    { name: 'Child Helpline', number: '1098', description: 'For reporting child abuse or distress.' },
    { name: 'Cyber Crime Helpline', number: '1930', description: 'Report online harassment and cyber crimes.' },
  ];

  return (
    <div className="app-container">
      <Navigation />

      <div className="container" style={{ padding: '3rem 1.5rem', minHeight: '80vh' }}>
        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Emergency Helplines</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Confidential support is available 24/7.
          </p>
        </header>

        <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '700px', margin: '0 auto' }}>
          {helplines.map((line, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              style={{ background: 'var(--white)', padding: '2rem', borderRadius: '1rem', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem' }}
            >
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>{line.number}</h2>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{line.name}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{line.description}</p>
              </div>
              <a href={`tel:${line.number}`} className="btn-primary" style={{ height: 'fit-content', whiteSpace: 'nowrap', padding: '1rem 2rem', borderRadius: '2rem' }}>
                <Phone size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> Call
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Helplines;