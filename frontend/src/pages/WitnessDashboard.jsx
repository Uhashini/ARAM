import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, PhoneCall, Clock, ArrowRight, ExternalLink, MapPin, Eye, FileText, ChevronRight } from 'lucide-react';
import '../App.css';
import './WitnessDashboard.css';
import aramLogo from '../assets/aram-hero-logo.png';
import Accordion from '../components/Accordion';

const WitnessDashboard = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const filteredReports = reports.filter(report => {
    return filterSeverity === 'all' || (report.riskAssessment?.riskScore === filterSeverity);
  });

  return (
    <div className="witness-dashboard-redesign">
      {/* Sticky Top Navigation */}
      <nav className="navbar-fluid">
        <div className="nav-inner-fluid">
          <div className="nav-left-zone">
            <Link to="/">
              <img src={aramLogo} alt="ARAM" style={{ height: '32px' }} />
            </Link>
            <div className="breadcrumb-fluid">
              <Link to="/">Home</Link>
              <ChevronRight size={14} />
              <span>Witness Dashboard</span>
            </div>
          </div>
          <div className="nav-right-zone">
            <div className="secure-indicator">
              <Lock size={12} /> Secure Portal
            </div>
            {user ? (
              <span className="user-welcome-fluid">Welcome, {user.name.split(' ')[0]}</span>
            ) : (
              <Link to="/login" className="btn-login-fluid" style={{ color: 'var(--primary-color)', fontWeight: '700', textDecoration: 'none' }}>Login</Link>
            )}
          </div>
        </div>
      </nav>

      <div className="fluid-layout-container">
        {/* Main Flow (Left/Center) */}
        <div className="main-content-flow">
          {/* Hero Command Center */}
          <header className="hero-command-fluid">
            <h1>ARAM <span className="highlight">Witness</span> Command Center</h1>
            <p>
              Your action is a catalyst for change. Report safely, intervene directly,
              or delegate to authorities. We provide the tools to ensure your safety and theirs.
            </p>
            <div className="hero-cta-area">
              <button className="btn-primary-fluid" onClick={() => navigate('/report-incident')}>
                Start Official Report
              </button>
              <div className="reassurance-note">
                <Shield size={18} />
                <span>Secure & 100% anonymous reporting</span>
              </div>
            </div>
          </header>

          {/* Quick Trigger Strip */}
          <section className="trigger-strip-fluid">
            <div className="trigger-info">
              <h3>Spotted an incident?</h3>
              <p>Every report triggers immediate intervention resources and guidance.</p>
            </div>
            <button className="btn-trigger-fluid" onClick={() => navigate('/report-incident')}>
              Report Now <ChevronRight size={18} />
            </button>
          </section>

          {/* 3 D's of Intervention */}
          <section className="ddd-section-fluid">
            <h3>The 3 D's of Intervention</h3>
            <div className="ddd-flow-fluid">
              <div className="ddd-node distract">
                <span className="node-num">01</span>
                <h5>Distract</h5>
                <p>Interrupt the situation indirectly to de-escalate without confrontation.</p>
              </div>
              <div className="ddd-node delegate">
                <span className="node-num">02</span>
                <h5>Delegate</h5>
                <p>Find someone else with authority or more experience to help intervene.</p>
              </div>
              <div className="ddd-node direct">
                <span className="node-num">03</span>
                <h5>Direct</h5>
                <p>Address the situation specifically if it is safe to do so for everyone.</p>
              </div>
            </div>
          </section>

          {/* Intervention Toolkit */}
          <section className="toolkit-section-fluid" id="toolkit">
            <div className="toolkit-header-flow">
              <div className="toolkit-intro">
                <h3>Intervention Toolkit</h3>
                <p>
                  Knowledge is your most powerful tool. Equip yourself with the specific
                  indicators of abuse and the exact protocols needed to intervene without
                  compromising your own or the survivor's safety.
                </p>
              </div>
              <div className="toolkit-accordion-list">
                <Accordion title="Signs of Abuse" icon={Eye} variant="clean" iconColor="var(--accent-color)">
                  <ul className="toolkit-list-fluid">
                    <li>Physical markers (unexplained bruises or clothing choices)</li>
                    <li>Behavioral shifts (extreme anxiety, withdrawal)</li>
                    <li>Controlling behavior from a partner</li>
                  </ul>
                </Accordion>
                <Accordion title="Safety Protocols" icon={Lock} variant="clean" iconColor="var(--primary-color)">
                  <ul className="toolkit-list-fluid">
                    <li>Use incognito mode for browsing safety tools</li>
                    <li>Digital footprint management and quick-exit strategies</li>
                    <li>Safe ways to document evidence</li>
                  </ul>
                </Accordion>
              </div>
            </div>
            <div className="toolkit-footer-flow">
              <Link to="/understand-abuse/what-is-ipv" className="link-standard-fluid">
                Explore the Full Educational Guide <ChevronRight size={18} />
              </Link>
            </div>
          </section>

          {/* Activity History */}
          <section className="history-section-fluid">
            <div className="section-divider-top" />
            <div className="history-portal-header">
              <Shield size={32} color="var(--primary-color)" />
              <h3>Activity History</h3>
            </div>

            {user ? (
              <div className="history-list-fluid">
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Track your reports and access detailed FIR summaries securely.</p>
                <div className="trust-indicator-row">
                  <div className="trust-item"><Lock size={14} /> Encrypted</div>
                  <div className="trust-item"><Shield size={14} /> Anonymous Access</div>
                  <div className="trust-item"><FileText size={14} /> FIR Summaries</div>
                </div>
                {loading ? (
                  <div>Loading history...</div>
                ) : filteredReports.length > 0 ? (
                  filteredReports.map(report => (
                    <div key={report._id} className="history-item-fluid">
                      <div className="history-meta">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <h4>Report #{report.reportId || 'PENDING'}</h4>
                          {/* Semantic Status Badges */}
                          {report.riskAssessment?.riskScore === 'EMERGENCY' ? (
                            <span className="status-badge warning">Escalated</span>
                          ) : report.reportId ? (
                            <span className="status-badge success">FIR Generated</span>
                          ) : (
                            <span className="status-badge info">Submitted</span>
                          )}
                        </div>
                        <p>{new Date(report.createdAt).toLocaleDateString()} • {report.location || 'Reported Location'}</p>
                      </div>
                      <button className="history-btn-view" onClick={() => navigate(`/witness/report/${report._id}`)}>
                        View FIR Summary
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="history-empty-fluid" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>
                    <FileText size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                    <p>No recent report activity found.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="history-auth-upsell">
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.15rem' }}>
                  Your personal dashboard for tracking reports and legal documentation.
                </p>
                <div className="trust-indicator-row">
                  <div className="trust-item"><Lock size={14} /> Encrypted</div>
                  <div className="trust-item"><Shield size={14} /> Anonymous Access</div>
                  <div className="trust-item"><FileText size={14} /> FIR Summaries</div>
                </div>
                <div className="upsell-context">
                  <div className="upsell-copy">
                    <p>
                      Login to access your private secure vault, track active investigations,
                      and download official FIR summaries.
                    </p>
                  </div>
                </div>
                <button className="btn-secondary-fluid" onClick={() => navigate('/login')}>
                  Login to Secure Vault <ArrowRight size={20} />
                </button>
              </div>
            )}
          </section>
        </div>

        {/* Desktop Emergency Panel */}
        <aside className="emergency-panel-desktop">
          <h4>Emergency Assistance</h4>
          <a href="tel:181" className="emergency-item-fluid">
            <div className="emergency-icon-box">
              <PhoneCall size={20} />
            </div>
            <div className="emergency-content-box">
              <h5>NCW Helpline</h5>
              <span>Dial 181</span>
            </div>
          </a>
          <a href="tel:100" className="emergency-item-fluid">
            <div className="emergency-icon-box">
              <Shield size={20} />
            </div>
            <div className="emergency-content-box">
              <h5>Police</h5>
              <span>Dial 100</span>
            </div>
          </a>
        </aside>
      </div>

      {/* Mobile Sticky Bottom Sheet */}
      <div className="mobile-emergency-sheet">
        <div className="sheet-handle" />
        <div style={{ display: 'flex', gap: '16px' }}>
          <a href="tel:181" className="emergency-item-fluid" style={{ flex: 1, marginBottom: 0 }}>
            <div className="emergency-icon-box">
              <PhoneCall size={18} />
            </div>
            <div className="emergency-content-box">
              <h5>NCW</h5>
              <span>181</span>
            </div>
          </a>
          <a href="tel:100" className="emergency-item-fluid" style={{ flex: 1, marginBottom: 0 }}>
            <div className="emergency-icon-box">
              <Shield size={18} />
            </div>
            <div className="emergency-content-box">
              <h5>Police</h5>
              <span>100</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default WitnessDashboard;
