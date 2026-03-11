import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import './RoleDashboard.css';
import './healthcare/HealthcareVisuals.css';

import PatientLookupForm from './healthcare/PatientLookupForm';
import IPVScreeningForm from './healthcare/IPVScreeningForm';
import AIRiskScoreForm from './healthcare/AIRiskScoreForm';
import ReferralForm from './healthcare/ReferralForm';
import CarePlanForm from './healthcare/CarePlanForm';
import PatientReportForm from './healthcare/PatientReportForm';

const API = 'https://aram-ira2.onrender.com/api/healthcare';
const hdrs = () => {
  const u = JSON.parse(localStorage.getItem('userInfo') || '{}');
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${u.token || ''}` };
};

const RISK_COLORS = { HIGH: '#e74c3c', MEDIUM: '#f39c12', LOW: '#27ae60' };

/*Dashboard Summary Tab with Charts*/
const DashboardTab = () => {
  const [dash, setDash] = useState(null);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [d, m] = await Promise.all([
          fetch(`${API}/dashboard`, { headers: hdrs() }).then(r => r.json()),
          fetch(`${API}/metrics`, { headers: hdrs() }).then(r => r.json())
        ]);
        setDash(d.dashboard);
        setMetrics(m.metrics);
      } catch (e) { console.error(e); }
    })();
  }, []);

  if (!dash) return (
    <div className="hc-section" style={{ textAlign: 'center', padding: 40, color: '#7f8c8d', position: 'relative', minHeight: 200 }}>
      <div className="hc-loading-spinner">
        <div className="hc-spinner" />
      </div>
      <div style={{ marginTop: 18, fontWeight: 500, fontSize: 17 }}>Loading dashboard...</div>
      {/* Decorative SVG graphic */}
      <svg className="hc-dashboard-bg" width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="110" cy="110" r="100" fill="#3498db" fillOpacity="0.18" />
        <circle cx="110" cy="110" r="70" fill="#27ae60" fillOpacity="0.13" />
        <circle cx="110" cy="110" r="40" fill="#f39c12" fillOpacity="0.13" />
      </svg>
    </div>
  );

  const riskDist = metrics?.risk?.distribution || [];
  const refByType = metrics?.referrals?.byType || [];
  const refByStatus = metrics?.referrals?.byStatus || [];
  const scrByType = metrics?.screening?.byType || [];
  const totalRisk = riskDist.reduce((s, r) => s + r.count, 0) || 1;

  // Prepare chart data
  const riskPieData = ['HIGH', 'MEDIUM', 'LOW'].map(level => {
    const item = riskDist.find(r => r._id === level);
    return { name: level, value: item?.count || 0 };
  }).filter(d => d.value > 0);

  const screeningBarData = scrByType.map(s => ({
    name: s._id || 'Unknown',
    count: s.count,
    avgScore: Math.round((s.avgScore || 0) * 10) / 10
  }));

  const referralBarData = refByType.map(r => ({
    name: (r._id || 'other').replace(/-/g, ' '),
    count: r.count
  }));

  const referralStatusData = refByStatus.map(r => ({
    name: (r._id || 'other').replace(/-/g, ' '),
    count: r.count
  }));

  const CHART_COLORS = ['#3498db', '#e74c3c', '#27ae60', '#f39c12', '#8e44ad', '#1abc9c', '#e67e22', '#2c3e50'];

  return (
    <div>
      {/* Today's Summary */}
      <div className="hc-section">
        <h3>📊 Today's Summary</h3>
        <p className="hc-subtitle">Real-time overview of healthcare operations</p>
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
          <div className="hc-stat-card"><div className="hc-stat-value" style={{ color: '#3498db' }}>{dash.recentScreenings}</div><div className="hc-stat-label">Patients Screened Today</div></div>
          <div className="hc-stat-card"><div className="hc-stat-value" style={{ color: '#e74c3c' }}>{dash.highRiskPatients}</div><div className="hc-stat-label">High-Risk Cases</div></div>
          <div className="hc-stat-card"><div className="hc-stat-value" style={{ color: '#f39c12' }}>{dash.pendingReferrals}</div><div className="hc-stat-label">Pending Referrals</div></div>
          <div className="hc-stat-card"><div className="hc-stat-value" style={{ color: '#27ae60' }}>{dash.pendingFollowUps}</div><div className="hc-stat-label">Follow-Ups Due</div></div>
          <div className="hc-stat-card"><div className="hc-stat-value" style={{ color: '#8e44ad' }}>{dash.totalPatients}</div><div className="hc-stat-label">Total Patients</div></div>
        </div>
      </div>

      {/* High-risk alert */}
      {dash.highRiskPatients > 0 && (
        <div className="hc-alert hc-alert-danger">
          <span style={{ fontSize: 20 }}>🚨</span>
          <div><strong>HIGH RISK ALERT</strong> — {dash.highRiskPatients} patient(s) flagged as HIGH risk requiring immediate intervention and safety planning.</div>
        </div>
      )}

      {/* Charts Row: Risk Distribution Pie + Screening Bar */}
      {metrics && (
        <div className="hc-grid" style={{ marginBottom: 20 }}>
          {/* Risk Distribution Pie Chart */}
          <div className="hc-section">
            <h3>Risk Level Distribution</h3>
            {riskPieData.length > 0 ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                <ResponsiveContainer width={280} height={250}>
                  <PieChart>
                    <Pie data={riskPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {riskPieData.map((entry, i) => <Cell key={i} fill={RISK_COLORS[entry.name] || CHART_COLORS[i]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div>
                  {['HIGH', 'MEDIUM', 'LOW'].map(level => {
                    const item = riskDist.find(r => r._id === level);
                    const count = item?.count || 0;
                    const pct = Math.round((count / totalRisk) * 100);
                    return (
                      <div key={level} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <div style={{ width: 14, height: 14, borderRadius: '50%', background: RISK_COLORS[level] }} />
                        <span style={{ fontWeight: 600, minWidth: 70 }}>{level}</span>
                        <span style={{ color: '#7f8c8d' }}>{count} patients ({pct}%)</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : <p style={{ color: '#7f8c8d', textAlign: 'center', padding: 30 }}>No risk data available yet</p>}
          </div>

          {/* Screening Types Bar Chart */}
          <div className="hc-section">
            <h3>Screenings by Type</h3>
            {screeningBarData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={screeningBarData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f3f7" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3498db" name="Count" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="avgScore" fill="#f39c12" name="Avg Score" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p style={{ color: '#7f8c8d', textAlign: 'center', padding: 30 }}>No screening data yet</p>}
          </div>
        </div>
      )}

      {/* Charts Row: Referral by Type + Referral by Status */}
      {metrics && (referralBarData.length > 0 || referralStatusData.length > 0) && (
        <div className="hc-grid" style={{ marginBottom: 20 }}>
          {/* Referral Types Bar Chart */}
          {referralBarData.length > 0 && (
            <div className="hc-section">
              <h3>Referrals by Type</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={referralBarData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f3f7" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" name="Referrals" radius={[4, 4, 0, 0]}>
                    {referralBarData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Referral Status Pie Chart */}
          {referralStatusData.length > 0 && (
            <div className="hc-section">
              <h3>Referral Status Breakdown</h3>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                <ResponsiveContainer width={260} height={250}>
                  <PieChart>
                    <Pie data={referralStatusData} cx="50%" cy="50%" outerRadius={85} paddingAngle={3} dataKey="count" label={({ name, count }) => `${name}: ${count}`}>
                      {referralStatusData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div>
                  {referralStatusData.map((d, i) => (
                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: 13 }}>
                      <div style={{ width: 12, height: 12, borderRadius: 3, background: CHART_COLORS[i % CHART_COLORS.length] }} />
                      <span style={{ textTransform: 'capitalize' }}>{d.name}: {d.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Metrics Summary Cards */}
      {metrics && (
        <div className="hc-section">
          <h3>System Metrics Summary</h3>
          <div className="stats-grid" style={{ marginTop: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
            <div className="hc-stat-card"><div className="hc-stat-value" style={{ color: '#3498db' }}>{metrics.screening?.total || 0}</div><div className="hc-stat-label">Total Screenings</div></div>
            <div className="hc-stat-card"><div className="hc-stat-value" style={{ color: '#e74c3c' }}>{metrics.screening?.positiveCount || 0}</div><div className="hc-stat-label">Positive Cases</div></div>
            <div className="hc-stat-card"><div className="hc-stat-value" style={{ color: '#27ae60' }}>{metrics.carePlans?.active || 0}</div><div className="hc-stat-label">Active Care Plans</div></div>
            <div className="hc-stat-card"><div className="hc-stat-value" style={{ color: '#f39c12' }}>{metrics.followUps?.scheduled || 0}</div><div className="hc-stat-label">Scheduled Follow-Ups</div></div>
            <div className="hc-stat-card"><div className="hc-stat-value" style={{ color: '#1abc9c' }}>{metrics.followUps?.completed || 0}</div><div className="hc-stat-label">Completed Follow-Ups</div></div>
            <div className="hc-stat-card"><div className="hc-stat-value" style={{ color: '#c0392b' }}>{metrics.followUps?.missed || 0}</div><div className="hc-stat-label">Missed Follow-Ups</div></div>
            <div className="hc-stat-card"><div className="hc-stat-value" style={{ color: '#8e44ad' }}>{metrics.safetyPlans?.active || 0}</div><div className="hc-stat-label">Active Safety Plans</div></div>
            <div className="hc-stat-card"><div className="hc-stat-value" style={{ color: '#2c3e50' }}>{metrics.referrals?.total || 0}</div><div className="hc-stat-label">Total Referrals</div></div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Tabs ───────────────────────────────────────────────────────────── */
const TABS = [
  { key: 'dashboard', label: '📊 Dashboard', Comp: DashboardTab },
  { key: 'lookup', label: '👥 Patient Lookup', Comp: PatientLookupForm },
  { key: 'ipv', label: '🏥 IPV Screening', Comp: IPVScreeningForm },
  { key: 'risk', label: '🤖 AI Risk Score', Comp: AIRiskScoreForm },
  { key: 'referral', label: '🤝 Referrals', Comp: ReferralForm },
  { key: 'careplan', label: '📋 Care Plan', Comp: CarePlanForm },
  { key: 'reports', label: '📄 Reports', Comp: PatientReportForm }
];

const HealthcareDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const ActiveComp = TABS.find(t => t.key === activeTab)?.Comp || DashboardTab;

  return (
    <div className="role-dashboard" style={{ position: 'relative' }}>
      {/* Decorative SVG background for dashboard */}
      <svg className="hc-dashboard-bg" width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="110" cy="110" r="100" fill="#3498db" fillOpacity="0.18" />
        <circle cx="110" cy="110" r="70" fill="#27ae60" fillOpacity="0.13" />
        <circle cx="110" cy="110" r="40" fill="#f39c12" fillOpacity="0.13" />
      </svg>
      <div className="role-dashboard__header">
        <h1>Healthcare Worker Dashboard</h1>
        <p>Clinical tools for IPV screening, AI risk assessment, referrals and patient care</p>
      </div>
      <div className="role-dashboard__content">
        <div className="hc-tabs">
          {TABS.map(tab => (
            <button key={tab.key} className={`hc-tab ${activeTab === tab.key ? 'active' : ''}`} onClick={() => setActiveTab(tab.key)}>{tab.label}</button>
          ))}
        </div>
        <ActiveComp />
      </div>
    </div>
  );
};

export default HealthcareDashboard;