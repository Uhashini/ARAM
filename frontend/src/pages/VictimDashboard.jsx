import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Book, Phone, FileText, AlertTriangle } from 'lucide-react';
import Navigation from '../components/Navigation';
import '../App.css';

const VictimDashboard = () => {
  const navigate = useNavigate();

  // Mock data - in real app, these would come from backend
  const lastRiskScore = null; // or { level: 'HIGH', score: 8, date: '2024-05-20' }

  return (
    <div className="app-container">
      <Navigation />

      <div className="container" style={{ padding: '3rem 1.5rem', minHeight: '85vh' }}>
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Victim/Survivor Dashboard</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
            Your private space for support and planning.
          </p>
        </header>

        {/* Dashboard Grid */}
        <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

          {/* CARD 1: Self Screening */}
          <motion.div
            whileHover={{ y: -5 }}
            className="dashboard-card"
            style={{ background: 'var(--white)', padding: '2rem', borderRadius: '1rem', boxShadow: 'var(--shadow-md)', borderTop: '4px solid var(--primary-color)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem' }}>Safety Check</h2>
              <Shield size={28} color="var(--primary-color)" />
            </div>
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
              Assess your current safety level discreetly. Takes 2-3 minutes.
            </p>
            <button
              onClick={() => navigate('/self-screen')}
              className="btn-primary"
              style={{ width: '100%' }}
            >
              Start Self Screen
            </button>
          </motion.div>

          {/* CARD 2: Risk Result / Last Status */}
          <motion.div
            whileHover={{ y: -5 }}
            className="dashboard-card"
            style={{ background: 'var(--white)', padding: '2rem', borderRadius: '1rem', boxShadow: 'var(--shadow-md)', borderTop: '4px solid ' + (lastRiskScore ? 'var(--danger)' : '#9ca3af') }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem' }}>Risk Status</h2>
              <AlertTriangle size={28} color={lastRiskScore ? 'var(--danger)' : '#9ca3af'} />
            </div>

            {lastRiskScore ? (
              <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                <span style={{ display: 'inline-block', padding: '0.5rem 1rem', background: '#fee2e2', color: '#dc2626', borderRadius: '2rem', fontWeight: 'bold' }}>
                  HIGH RISK
                </span>
                <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>Last checked: 2 days ago</p>
                <button className="btn-outline" style={{ marginTop: '1rem', width: '100%' }}>View Action Plan</button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                  No recent assessment found.
                </p>
                <button disabled className="btn-outline" style={{ width: '100%', opacity: 0.5, cursor: 'not-allowed' }}>
                  View Plan
                </button>
              </div>
            )}
          </motion.div>

          {/* CARD 3: Resources */}
          <motion.div
            whileHover={{ y: -5 }}
            className="dashboard-card"
            style={{ background: 'var(--white)', padding: '2rem', borderRadius: '1rem', boxShadow: 'var(--shadow-md)', borderTop: '4px solid var(--secondary-color)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem' }}>Find Support</h2>
              <Phone size={28} color="var(--secondary-color)" />
            </div>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <button onClick={() => navigate('/resources/legal')} className="btn-ghost" style={{ textAlign: 'left', border: '1px solid #e5e7eb' }}>
                ⚖️ Legal Resources
              </button>
              <button onClick={() => navigate('/resources/shelters')} className="btn-ghost" style={{ textAlign: 'left', border: '1px solid #e5e7eb' }}>
                🏠 Safe Shelters
              </button>
              <button onClick={() => navigate('/helplines')} className="btn-ghost" style={{ textAlign: 'left', border: '1px solid #e5e7eb' }}>
                📞 Emergency Helplines
              </button>
            </div>
          </motion.div>

          {/* CARD 4: Journal */}
          <motion.div
            whileHover={{ y: -5 }}
            className="dashboard-card"
            style={{ background: 'var(--white)', padding: '2rem', borderRadius: '1rem', boxShadow: 'var(--shadow-md)', borderTop: '4px solid var(--accent-color)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem' }}>Private Journal</h2>
              <Book size={28} color="var(--accent-color)" />
            </div>
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
              Record incidents, feelings, or evidence safely. Only visible to you.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => navigate('/journal/new')} className="btn-primary" style={{ flex: 1, background: 'var(--accent-color)' }}>
                Write New
              </button>
              <button onClick={() => navigate('/journal')} className="btn-outline" style={{ flex: 1, borderColor: 'var(--accent-color)', color: 'var(--accent-color)' }}>
                View All
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default VictimDashboard;