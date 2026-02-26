import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield, Phone, FileText, Lock, Book, Heart, MapPin,
  LogOut, Home, ChevronRight, ArrowRight,
  User, Siren, MessageCircle, Camera, Mic, Video
} from 'lucide-react';
import './VictimDashboard.css';
import aramLogo from '../assets/aram-hero-logo.png';
import EmergencyOverlay from '../components/EmergencyOverlay';
import TrustedContacts from '../components/TrustedContacts';

/* ─── Safety Status ─── */
const SafetyStatusCard = ({ riskLevel, lastChecked }) => {
  const level = riskLevel || 'LOW';
  const cls = level === 'HIGH' || level === 'EXTREME' ? 'high' : level === 'MEDIUM' ? 'medium' : 'low';
  return (
    <div className="safety-status-card">
      <div className="status-header">
        <span className={`risk-badge ${cls}`}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
          {level} RISK
        </span>
        <span className="status-sub" style={{ fontSize: '0.72rem' }}>
          Trend: <strong>Stable →</strong>
        </span>
      </div>
      <div className="status-title">Current Safety Status</div>
      <div className="status-sub">
        Last assessed: {lastChecked ? new Date(lastChecked).toLocaleDateString() : 'Not yet'}
      </div>
      <div className="status-meta-row">
        <span className="status-meta-dot" />
        <span>Location Sharing: <strong>Active</strong></span>
        <span style={{ color: '#cbd5e1' }}>|</span>
        <span>Updated 2m ago</span>
      </div>
      <button className="status-check-btn">
        <Shield size={15} /> Re-Assess Safety
      </button>
    </div>
  );
};

/* ─── Emergency Hub ─── */
const ActionCard = ({ icon: Icon, label, sub, colorClass, onClick }) => (
  <div className="action-card" onClick={onClick}>
    <div className={`icon-circle ${colorClass}`}><Icon size={20} /></div>
    <div className="action-label">{label}</div>
    {sub && <div className="action-sub">{sub}</div>}
  </div>
);

const EmergencyHub = ({ onSOS }) => (
  <div className="emergency-hub">
    <div className="hub-label">
      <span>Emergency Quick Actions</span>
      <span style={{ fontSize: '0.72rem', fontWeight: 400, color: '#94a3b8' }}>Tap to activate</span>
    </div>
    <div className="action-grid">
      <ActionCard icon={Siren} label="Call Police" sub="100" colorClass="icon-police" onClick={onSOS} />
      <ActionCard icon={Heart} label="Helpline" sub="181" colorClass="icon-helpline" onClick={onSOS} />
      <ActionCard icon={MessageCircle} label="🚨 SOS Alert" sub="Full Protocol" colorClass="icon-panic" onClick={onSOS} />
      <ActionCard icon={MapPin} label="Share Loc" sub="Live Tracking" colorClass="icon-location" onClick={() => { }} />
    </div>
  </div>
);

/* ─── Report Banner ─── */
const ReportBanner = ({ navigate }) => (
  <div className="report-banner span-2">
    <div className="banner-content">
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div className="banner-icon-box"><FileText size={24} /></div>
        <div>
          <div className="banner-title">Incident Reporting</div>
          <div className="banner-desc">Securely document abuse details. Your data is encrypted end-to-end and cannot be altered.</div>
          <div className="evidence-types">
            <span className="evi-badge"><Camera size={11} /> Photos</span>
            <span className="evi-badge"><Mic size={11} /> Audio</span>
            <span className="evi-badge"><Video size={11} /> Video</span>
            <span className="evi-badge"><FileText size={11} /> Docs</span>
          </div>
        </div>
      </div>
    </div>
    <div className="banner-actions">
      <button className="btn-primary" onClick={() => navigate('/report-victim')}>
        Start New Report <ArrowRight size={15} />
      </button>
      <button className="btn-ghost">Continue Draft (Saved 2h ago)</button>
    </div>
  </div>
);

/* ─── Module Cards ─── */
const ModuleCard = ({ icon: Icon, title, desc, onClick, color, liveStatus }) => (
  <div className="module-card" onClick={onClick}>
    {liveStatus && (
      <div className="live-badge">
        <span className="live-dot" /> {liveStatus}
      </div>
    )}
    <div className="module-row">
      <div className="module-icon" style={{ color, background: `${color}18` }}><Icon size={23} /></div>
      <ArrowRight size={18} className="module-arrow" />
    </div>
    <div className="module-title">{title}</div>
    <div className="module-desc">{desc}</div>
  </div>
);

const JournalCard = ({ onClick }) => (
  <div className="module-card journal-card" onClick={onClick}>
    <div className="module-row">
      <div className="module-icon" style={{ color: '#4f46e5', background: '#eef2ff' }}><Book size={23} /></div>
      <Lock size={15} style={{ color: '#818cf8' }} />
    </div>
    <div className="module-title">Private Journal</div>
    <div className="module-desc">Entries are encrypted locally. Only you have the key.</div>
    <div className="journal-meta">
      <span>Last entry: Today</span>
      <span className="mood-chip">Mood: Calm</span>
    </div>
  </div>
);

/* ─── Activity Timeline ─── */
const ActivityTimeline = () => (
  <div className="timeline-section span-3">
    <div className="section-title">Recent Activity</div>
    <div className="timeline-list">
      <div className="timeline-item">
        <div className="t-dot active" />
        <div className="t-content">
          <h4>Safety Check Completed</h4>
          <p>Risk assessed as LOW. Location sharing enabled.</p>
          <small>Today, 10:23 AM</small>
        </div>
      </div>
      <div className="timeline-item">
        <div className="t-dot" />
        <div className="t-content">
          <h4>New Evidence Added</h4>
          <p>2 photos added to Evidence Vault.</p>
          <small>Yesterday, 4:15 PM</small>
        </div>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════ */
const VictimDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emergencyActive, setEmergencyActive] = useState(false);

  useEffect(() => {
    let escCount = 0;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        escCount++;
        if (escCount >= 3) window.location.href = 'https://google.com';
        setTimeout(() => (escCount = 0), 1200);
      }
    };
    window.addEventListener('keydown', onKey);

    const fetchUserData = async () => {
      const raw = localStorage.getItem('userInfo');
      if (raw) {
        try {
          const { token } = JSON.parse(raw);
          const res = await fetch('http://127.0.0.1:5001/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) setUser(await res.json());
          else setUser({ riskAssessment: { level: 'LOW', lastChecked: new Date() } });
        } catch {
          setUser({ riskAssessment: { level: 'LOW', lastChecked: new Date() } });
        }
      }
      setLoading(false);
    };
    fetchUserData();
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleQuickExit = () => {
    localStorage.removeItem('userInfo');
    window.location.href = 'https://weather.com';
  };

  if (loading)
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, background: '#f8fafc', color: '#94a3b8' }}>
        <Shield size={48} style={{ opacity: 0.4 }} />
        <span>Securing your safe space…</span>
      </div>
    );

  const riskLevel = user?.riskAssessment?.level || 'LOW';

  return (
    <>
      {emergencyActive && (
        <EmergencyOverlay onSessionEnd={() => setEmergencyActive(false)} />
      )}
      <div className="dashboard-container">
        {/* ── NAVBAR ── */}
        <nav className="navbar-fluid">
          <div className="nav-inner-fluid">

            {/* LEFT: Logo + Divider + Breadcrumb */}
            <div className="nav-left-zone">
              <Link to="/">
                <img src={aramLogo} alt="ARAM" style={{ height: 26 }} />
              </Link>
              <div className="nav-divider" />
              <div className="breadcrumb-fluid">
                <Link to="/">Home</Link>
                <ChevronRight size={13} style={{ color: '#cbd5e1' }} />
                <span className="breadcrumb-active">Safe Command Center</span>
              </div>
            </div>

            {/* RIGHT: Trust Badge + Avatar + Exit */}
            <div className="nav-right-zone">
              <div className="trust-badge" title="End-to-end encrypted — only you and authorized responders can access your data.">
                <Lock size={11} />
                E2E ENCRYPTED
              </div>
              <div className="nav-avatar">
                <User size={15} />
              </div>
              <button className="quick-exit-btn" onClick={handleQuickExit}>
                <LogOut size={13} />
                Quick Exit (Esc×3)
              </button>
            </div>

          </div>
        </nav>

        {/* ── MAIN GRID ── */}
        <main className="dashboard-main animate-fade-in">

          {/* Row 1 */}
          <SafetyStatusCard riskLevel={riskLevel} lastChecked={user?.riskAssessment?.lastChecked} />
          <EmergencyHub onSOS={() => setEmergencyActive(true)} />

          {/* Row 2: Banner spans 2 cols, Journal 1 col */}
          <ReportBanner navigate={navigate} />
          <JournalCard onClick={() => navigate('/journal')} />

          {/* Trusted Contacts — full width */}
          <div style={{ gridColumn: '1 / -1' }}>
            <TrustedContacts />
          </div>

          {/* Row 3: Feature Modules */}
          <ModuleCard icon={Lock} title="Safety Planner" desc="Interactive escape plans & bag checklists." color="#0ea5e9" onClick={() => navigate('/safety-planning')} />
          <ModuleCard icon={Home} title="Shelters & Help" desc="Find verified safe houses nearby." color="#6366f1" liveStatus="4 Nearby" onClick={() => navigate('/resources/shelters')} />
          <ModuleCard icon={Heart} title="Counselling" desc="Book trauma-informed therapy sessions." color="#ec4899" liveStatus="2 Online" onClick={() => navigate('/healthcare')} />
          <ModuleCard icon={Shield} title="Evidence Vault" desc="Your evidence is securely stored and cannot be altered." color="#10b981" liveStatus="12 Files" onClick={() => { }} />
          <ModuleCard icon={FileText} title="Legal Rights" desc="DV Act details, child custody & court guides." color="#f59e0b" onClick={() => navigate('/resources/legal')} />

          {/* Row 4: Timeline — full width */}
          <ActivityTimeline />

        </main>

        {/* ── MOBILE NAV ── */}
        <div className="mobile-nav">
          <button className="mob-btn active" onClick={() => navigate('/victim-dashboard')}>
            <Home size={20} /><span>Home</span>
          </button>
          <div className="fab" onClick={() => setEmergencyActive(true)}>
            <Siren size={22} />
          </div>
          <button className="mob-btn" style={{ color: '#ef4444' }} onClick={() => setEmergencyActive(true)}>
            <Phone size={20} /><span>Police</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default VictimDashboard;
