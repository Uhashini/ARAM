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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');

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

  // Handle hash navigation for smooth scrolling
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  // Filter reports based on search and filters
  const filteredReports = reports.filter(report => {
    const matchesSearch = searchTerm === '' ||
      report.incidentDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.location && report.location.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSeverity = filterSeverity === 'all' || report.severityLevel.toString() === filterSeverity;

    return matchesSearch && matchesSeverity;
  });

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
            <a href="#safe-intervention-tools" className="nav-link" onClick={(e) => {
              e.preventDefault();
              document.getElementById('safe-intervention-tools')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}>Resources</a>
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

                  {/* Search and Filter Controls */}
                  <div style={{ marginBottom: '1rem' }}>
                    <input
                      type="text"
                      placeholder="Search reports by description or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #e2e8f0',
                        fontSize: '0.9rem',
                        marginBottom: '0.75rem'
                      }}
                    />

                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>

                      <select
                        value={filterSeverity}
                        onChange={(e) => setFilterSeverity(e.target.value)}
                        style={{
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.375rem',
                          border: '1px solid #e2e8f0',
                          fontSize: '0.85rem',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="all">All Severity</option>
                        <option value="1">Level 1 (Verbal)</option>
                        <option value="2">Level 2</option>
                        <option value="3">Level 3</option>
                        <option value="4">Level 4</option>
                        <option value="5">Level 5 (Severe)</option>
                      </select>

                      {(searchTerm || filterSeverity !== 'all') && (
                        <button
                          onClick={() => {
                            setSearchTerm('');
                            setFilterSeverity('all');
                          }}
                          style={{
                            padding: '0.5rem 0.75rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #e2e8f0',
                            background: '#fee2e2',
                            color: '#dc2626',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            fontWeight: '500'
                          }}
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </div>

                  {loading ? (
                    <p>Loading reports...</p>
                  ) : filteredReports.length > 0 ? (
                    <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {filteredReports.map((report) => (
                        <div key={report._id} style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                <span style={{ color: '#94a3b8' }}>{new Date(report.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {report.incidentDescription}
                              </p>
                              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <button
                                  onClick={() => navigate(`/witness/report/${report._id}`)}
                                  style={{
                                    padding: '0.4rem 0.8rem',
                                    fontSize: '0.8rem',
                                    background: 'var(--primary-color)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.375rem',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                  }}
                                >
                                  View
                                </button>
                                <button
                                  onClick={() => navigate(`/witness/report/${report._id}/edit`)}
                                  style={{
                                    padding: '0.4rem 0.8rem',
                                    fontSize: '0.8rem',
                                    background: '#8b5cf6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.375rem',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={async () => {
                                    if (window.confirm('Are you sure you want to delete this report?')) {
                                      try {
                                        const userInfo = localStorage.getItem('userInfo');
                                        const parsedUser = JSON.parse(userInfo);
                                        const response = await fetch(`http://127.0.0.1:5001/api/witness/report/${report._id}`, {
                                          method: 'DELETE',
                                          headers: {
                                            'Authorization': `Bearer ${parsedUser.token}`
                                          }
                                        });
                                        if (response.ok) {
                                          alert('Report deleted successfully');
                                          setReports(reports.filter(r => r._id !== report._id));
                                        } else {
                                          alert('Failed to delete report');
                                        }
                                      } catch (err) {
                                        console.error('Delete error:', err);
                                        alert('Failed to delete report');
                                      }
                                    }
                                  }}
                                  style={{
                                    padding: '0.4rem 0.8rem',
                                    fontSize: '0.8rem',
                                    background: '#dc2626',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.375rem',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : searchTerm || filterSeverity !== 'all' ? (
                    <p style={{ color: '#666', fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center', padding: '2rem' }}>
                      No reports match your search criteria. Try adjusting your filters.
                    </p>
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
          <div className="education-column" id="safe-intervention-tools">
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