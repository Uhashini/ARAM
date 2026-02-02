import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Book, AlertTriangle, CheckCircle } from 'lucide-react';
import Navigation from '../components/Navigation';
import '../App.css';

const VictimDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchUserData = async () => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) return;

    try {
      const { token } = JSON.parse(userInfo);
      const response = await fetch('http://127.0.0.1:5001/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    if (location.state?.assessmentComplete) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [location]);

  const lastRiskScore = user?.riskAssessment;

  return (
    <div className="app-container">
      <Navigation />

      <div className="container" style={{ padding: '3rem 1.5rem', minHeight: '85vh' }}>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: '#dcfce7',
              color: '#166534',
              padding: '1rem',
              borderRadius: '0.5rem',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              border: '1px solid #bbf7d0'
            }}
          >
            <CheckCircle size={20} />
            Assessment saved successfully! Your dashboard has been updated.
          </motion.div>
        )}

        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Welcome Back</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
            Your private space for support and safety planning.
          </p>
        </header>

        {/* Dashboard Grid */}
        <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

          {/* CARD 2: Risk Result / Last Status - MOVED TO TOP LEFT OR HIGHLIGHTED */}
          <motion.div
            whileHover={{ y: -5 }}
            className="dashboard-card"
            style={{
              background: 'var(--white)',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: 'var(--shadow-md)',
              borderTop: `4px solid ${lastRiskScore?.level === 'HIGH' ? '#dc2626' : (lastRiskScore?.level === 'MEDIUM' ? '#f97316' : (lastRiskScore?.level === 'LOW' ? '#16a34a' : '#9ca3af'))}`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem' }}>Risk Status</h2>
              <AlertTriangle size={28} color={lastRiskScore?.level === 'HIGH' ? '#dc2626' : (lastRiskScore?.level === 'MEDIUM' ? '#f97316' : (lastRiskScore?.level === 'LOW' ? '#16a34a' : '#9ca3af'))} />
            </div>

            {loading ? (
              <p>Loading status...</p>
            ) : lastRiskScore?.level ? (
              <div style={{ textAlign: 'center', margin: '0.5rem 0' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '0.5rem 1.5rem',
                  background: lastRiskScore.level === 'HIGH' ? '#fee2e2' : (lastRiskScore.level === 'MEDIUM' ? '#ffedd5' : '#dcfce7'),
                  color: lastRiskScore.level === 'HIGH' ? '#dc2626' : (lastRiskScore.level === 'MEDIUM' ? '#c2410c' : '#16a34a'),
                  borderRadius: '2rem',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  fontSize: '1.1rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  {lastRiskScore.level} RISK
                </span>
                <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Last Assessment: {new Date(lastRiskScore.lastChecked).toLocaleDateString()}
                </p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button
                    onClick={() => navigate('/self-screen')}
                    className="btn-outline"
                    style={{ flex: 1, fontSize: '0.9rem' }}
                  >
                    Retake
                  </button>
                  <button
                    onClick={() => navigate('/helplines')}
                    className="btn-primary"
                    style={{ flex: 1, fontSize: '0.9rem', background: lastRiskScore.level === 'HIGH' ? '#dc2626' : 'var(--primary-color)' }}
                  >
                    Get Help
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                  No recent assessment found. It's important to know your risk level.
                </p>
                <button onClick={() => navigate('/self-screen')} className="btn-primary" style={{ width: '100%' }}>
                  Take First Assessment
                </button>
              </div>
            )}
          </motion.div>

          {/* CARD 4: Journal - HIGHLIGHTED AS WELL */}
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
              Securely log thoughts and incidents. This is 100% private to you.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => navigate('/journal', { state: { startNew: true } })} className="btn-primary" style={{ flex: 1, background: 'var(--accent-color)' }}>
                Write Entry
              </button>
              <button onClick={() => navigate('/journal')} className="btn-outline" style={{ flex: 1, borderColor: 'var(--accent-color)', color: 'var(--accent-color)' }}>
                View Logs
              </button>
            </div>
          </motion.div>

          {/* CARD 3: Resources */}
          <motion.div
            whileHover={{ y: -5 }}
            className="dashboard-card"
            style={{ background: 'var(--white)', padding: '2rem', borderRadius: '1rem', boxShadow: 'var(--shadow-md)', borderTop: '4px solid var(--secondary-color)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem' }}>Resources</h2>
              <Shield size={28} color="var(--secondary-color)" />
            </div>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <button onClick={() => navigate('/resources/legal')} className="btn-ghost" style={{ textAlign: 'left', border: '1px solid #f1f5f9', background: '#f8fafc', padding: '0.75rem' }}>
                ⚖️ Legal Help
              </button>
              <button onClick={() => navigate('/resources/shelters')} className="btn-ghost" style={{ textAlign: 'left', border: '1px solid #f1f5f9', background: '#f8fafc', padding: '0.75rem' }}>
                🏠 Safe Shelters
              </button>
              <button onClick={() => navigate('/helplines')} className="btn-ghost" style={{ textAlign: 'left', border: '1px solid #f1f5f9', background: '#f8fafc', padding: '0.75rem' }}>
                📞 Emergency Contacts
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default VictimDashboard;