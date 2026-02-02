import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, LogIn, AlertTriangle, Eye, FileText, PhoneCall, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import '../App.css';
import aramLogo from '../assets/aram-hero-logo.png';
import Accordion from '../components/Accordion';

const WitnessDashboard = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const parsedUser = JSON.parse(userInfo);
        setUser(parsedUser);
        try {
          const response = await fetch('http://127.0.0.1:5001/api/witness/my-reports', {
            headers: {
              'Authorization': `Bearer ${parsedUser.token}`
            }
          });
          const data = await response.json();
          if (Array.isArray(data)) setReports(data);
        } catch (err) {
          console.error("Error fetching reports", err);
        }
      }
      setLoading(false);
    };
    fetchReports();
  }, []);

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container nav-content">
          <div className="logo">
            <Link to="/">
              <img src={aramLogo} alt="ARAM Logo" style={{ height: '40px' }} />
            </Link>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/resources" className="nav-link">Resources</Link>
          </div>
        </div>
      </nav>

      <div className="container" style={{ padding: '3rem 1.5rem', minHeight: 'calc(100vh - 80px)' }}>

        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Witness Dashboard</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
            Your role as a witness is crucial. You can report incidents {user ? 'securely' : 'anonymously'} or access tools to intervene safely.
          </p>
        </header>

        <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>

          {/* LEFT COLUMN: Actions */}
          <div className="actions-column">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={24} color="var(--primary-color)" /> Action Center
            </h2>

            <div className="action-cards-stack" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Report Option */}
              <motion.div
                className="feature-card"
                whileHover={{ y: -5 }}
                style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', textAlign: 'left' }}
              >
                <div style={{ background: 'rgba(37, 99, 235, 0.1)', padding: '1rem', borderRadius: '50%', flexShrink: 0 }}>
                  <FileText size={32} color="var(--primary-color)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Report Incident</h3>
                  <p style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>Submit details {user ? 'linked to your profile' : 'without revealing your identity'}.</p>
                  <button
                    className="btn-primary"
                    onClick={() => navigate('/report-incident')}
                  >
                    Start Report
                  </button>
                </div>
              </motion.div>

              {/* Login/History Option */}
              {user ? (
                <motion.div
                  className="feature-card"
                  whileHover={{ y: -5 }}
                  style={{ padding: '2rem', borderTop: '4px solid var(--accent-color)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <Eye size={24} color="var(--accent-color)" />
                    <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Your Report History</h3>
                  </div>
                  {loading ? (
                    <p>Loading reports...</p>
                  ) : reports.length > 0 ? (
                    <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {reports.map((report) => (
                        <div key={report._id} style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                            <span style={{
                              fontWeight: 'bold',
                              color: report.status === 'pending' ? '#f59e0b' : '#10b981'
                            }}>
                              {report.status.toUpperCase()}
                            </span>
                            <span style={{ color: '#94a3b8' }}>{new Date(report.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {report.incidentDescription}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#666', fontSize: '0.9rem', fontStyle: 'italic' }}>No reports submitted yet.</p>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  className="feature-card"
                  whileHover={{ y: -5 }}
                  style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', textAlign: 'left' }}
                >
                  <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '1rem', borderRadius: '50%', flexShrink: 0 }}>
                    <LogIn size={32} color="var(--accent-color)" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>View Previous Reports</h3>
                    <p style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>Login to track status and history.</p>
                    <button
                      className="btn-outline"
                      onClick={() => navigate('/login')}
                    >
                      Login / Sign Up
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Local Resources Card */}
              <div style={{ background: '#fff', padding: '2rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--danger)' }}>
                  <PhoneCall size={20} /> Emergency Support
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <strong>National Commission for Women</strong><br />
                    <a href="tel:181" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Call 181</a> (24/7 Helpline)
                  </li>
                  <li>
                    <strong>Police Control Room</strong><br />
                    <a href="tel:100" style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>Call 100</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Education / Tools */}
          <div className="education-column">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={24} color="var(--secondary-color)" /> Safe Intervention Tools
            </h2>

            <div className="accordions-wrapper">
              <Accordion title="Recognize Signs of Abuse" icon={Eye} defaultOpen={true}>
                <p style={{ marginBottom: '1rem' }}>Look for these subtle indicators in your friends or neighbors:</p>
                <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                  <li><strong>Physical:</strong> Unexplained bruises, wearing concealing clothing.</li>
                  <li><strong>Behavioral:</strong> Withdrawing from circle, rigid schedule.</li>
                  <li><strong>Financial:</strong> No access to money, partner controls spending.</li>
                </ul>
              </Accordion>

              <Accordion title="Bystander Steps: The 3 D's" icon={AlertTriangle}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
                    <strong>1. Distract:</strong> Spill a drink or ask for directions.
                  </div>
                  <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
                    <strong>2. Delegate:</strong> Ask others to help or alert security.
                  </div>
                  <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
                    <strong>3. Direct:</strong> Ask "Are you okay?" if safe.
                  </div>
                </div>
              </Accordion>

              <Accordion title="Safety Planning for Witnesses" icon={Lock}>
                <p>Your safety matters. Do not intervene physically if weapons are involved.</p>
                <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem' }}>
                  <li>Keep emergency numbers handy.</li>
                  <li>Maintain a safe distance.</li>
                  <li>Trust your instincts—call 100/181 if it feels dangerous.</li>
                </ul>
              </Accordion>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WitnessDashboard;