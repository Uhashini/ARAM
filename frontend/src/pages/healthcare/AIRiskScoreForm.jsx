import React, { useState } from 'react';
import './HealthcareVisuals.css';

const API = 'https://aram-ira2.onrender.com/api/healthcare';
const hdrs = () => { const u = JSON.parse(localStorage.getItem('userInfo') || '{}'); return { 'Content-Type': 'application/json', Authorization: `Bearer ${u.token || ''}` }; };
const riskClass = l => l === 'HIGH' ? 'risk-high' : l === 'MEDIUM' ? 'risk-medium' : 'risk-low';
const riskColor = l => l === 'HIGH' ? '#e74c3c' : l === 'MEDIUM' ? '#f39c12' : '#27ae60';

const AIRiskScoreForm = () => {
    const [pid, setPid] = useState('');
    const [data, setData] = useState(null);
    const [msg, setMsg] = useState('');
    const flash = t => { setMsg(t); setTimeout(() => setMsg(''), 3000); };

    const lookup = async () => {
        if (!pid.trim()) { flash('Enter a Patient ID'); return; }
        try {
            const r = await fetch(`${API}/risk-score/${pid}`, { headers: hdrs() });
            const d = await r.json();
            if (r.ok) { setData(d); if (!d.patient) flash('No patient found'); }
            else flash(d.error?.message || 'Lookup failed');
        } catch (e) { flash('Network error'); }
    };

    const loadAllPatients = async () => {
        try {
            const r = await fetch(`${API}/patients/search?q=`, { headers: hdrs() });
            const d = await r.json();
            if (r.ok && d.patients?.length) {
                setAllPatients(d.patients);
                flash(`Loaded ${d.patients.length} patients`);
            } else flash('No patients found');
        } catch (e) { flash('Network error'); }
    };

    const [allPatients, setAllPatients] = useState([]);

    return (
        <div>
            {msg && <div className="hc-alert hc-alert-info"><span>ℹ️</span><div>{msg}</div></div>}

            <div className="hc-section">
                <h3>🤖 AI Risk Score Review</h3>
                <p className="hc-subtitle">Review AI-generated risk assessments, probability metrics, and historical risk data</p>
                <div className="hc-search-bar">
                    <input className="hc-input" placeholder="Enter Patient ID (e.g. PAT-001)..." value={pid} onChange={e => setPid(e.target.value)} onKeyDown={e => e.key === 'Enter' && lookup()} />
                    <button className="hc-btn hc-btn-primary" onClick={lookup}>Lookup Risk Score</button>
                    <button className="hc-btn hc-btn-secondary" onClick={loadAllPatients}>View All Patients</button>
                </div>
            </div>

            {/* All Patients List */}
            {allPatients.length > 0 && (
                <div className="hc-section" style={{ overflow: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <h3 style={{ margin: 0 }}>All Patients ({allPatients.length})</h3>
                        <button className="hc-btn hc-btn-danger hc-btn-sm" onClick={() => setAllPatients([])}>✕ Close</button>
                    </div>
                    <table className="hc-table">
                        <thead><tr><th>Patient ID</th><th>Name</th><th>Risk Level</th><th>Action</th></tr></thead>
                        <tbody>
                            {allPatients.map(p => (
                                <tr key={p._id}>
                                    <td><strong>{p.patientId}</strong></td>
                                    <td>{p.demographics?.firstName} {p.demographics?.lastName}</td>
                                    <td><span className={riskClass(p.ipvHistory?.highestRiskLevel || 'LOW')}>{p.ipvHistory?.highestRiskLevel || 'LOW'}</span></td>
                                    <td><button className="hc-btn hc-btn-primary hc-btn-sm" onClick={() => { setPid(p.patientId); setAllPatients([]); }}>Select</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {data?.patient && (
                <>
                    {/* Close button for results */}
                    <div style={{ textAlign: 'right', marginBottom: 12 }}>
                        <button className="hc-btn hc-btn-danger hc-btn-sm" onClick={() => setData(null)}>✕ Close Results</button>
                    </div>
                    {/* Patient Risk Overview Stats */}
                    <div className="stats-grid" style={{ marginBottom: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                        <div className="hc-stat-card">
                            <div className="hc-stat-value" style={{ color: riskColor(data.patient.highestRiskLevel) }}>{data.patient.highestRiskLevel}</div>
                            <div className="hc-stat-label">Highest Risk Level</div>
                        </div>
                        <div className="hc-stat-card">
                            <div className="hc-stat-value" style={{ color: '#3498db' }}>{data.patient.totalScreenings}</div>
                            <div className="hc-stat-label">Total Screenings</div>
                        </div>
                        <div className="hc-stat-card">
                            <div className="hc-stat-value" style={{ color: '#f39c12' }}>{data.patient.positiveScreenings}</div>
                            <div className="hc-stat-label">Positive Screenings</div>
                        </div>
                        <div className="hc-stat-card">
                            <div className="hc-stat-value" style={{ color: '#2c3e50' }}>{data.patient.fullName}</div>
                            <div className="hc-stat-label">Patient Name</div>
                            <div style={{ fontSize: 12, color: '#7f8c8d', marginTop: 4 }}>ID: {data.patient.patientId}</div>
                        </div>
                    </div>

                    {/* High-Risk Patient Alert */}
                    {data.patient.highestRiskLevel === 'HIGH' && (
                        <div className="hc-alert hc-alert-danger">
                            <span style={{ fontSize: 22 }}>🚨</span>
                            <div>
                                <strong>HIGH RISK PATIENT — IMMEDIATE INTERVENTION REQUIRED</strong>
                                <p style={{ margin: '6px 0 0', fontSize: 13 }}>{data.patient.fullName} has been flagged as HIGH risk. Ensure safety planning, conduct follow-up, and initiate emergency referral if needed.</p>
                            </div>
                        </div>
                    )}

                    {/* AI Risk Score Cards */}
                    <div className="hc-section">
                        <h3>AI Risk Score History</h3>
                        {data.screenings.length > 0 ? data.screenings.map((s, i) => (
                            <div key={s._id || i} className="hc-score-card" style={{ borderLeftColor: riskColor(s.finalRiskLevel || 'LOW') }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                                    <div>
                                        <strong style={{ fontSize: 15 }}>{s.screeningType}</strong>
                                        <span style={{ color: '#7f8c8d', fontSize: 13, marginLeft: 10 }}>{new Date(s.completedAt).toLocaleDateString()}</span>
                                        <div style={{ color: '#7f8c8d', fontSize: 13, marginTop: 4 }}>Score: <strong style={{ color: '#2c3e50' }}>{s.totalScore}</strong></div>
                                        {s.aiExplanation && <p style={{ color: '#555', margin: '6px 0 0', fontSize: 13, lineHeight: 1.5 }}>{s.aiExplanation}</p>}
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span className={riskClass(s.aiRiskLevel || 'LOW')} style={{ marginRight: 6 }}>AI: {s.aiRiskLevel || 'N/A'}</span>
                                        <span className={riskClass(s.finalRiskLevel || 'LOW')}>Final: {s.finalRiskLevel || 'N/A'}</span>
                                        {/* Probability and Confidence Metrics */}
                                        <div style={{ marginTop: 10 }}>
                                            <div style={{ fontSize: 12, color: '#7f8c8d', marginBottom: 4 }}>Probability: <strong style={{ color: '#2c3e50' }}>{s.aiProbability !== undefined ? `${(s.aiProbability * 100).toFixed(0)}%` : 'N/A'}</strong></div>
                                            <div className="hc-metric-bar" style={{ width: 120 }}><div className="hc-metric-fill" style={{ width: `${(s.aiProbability || 0) * 100}%`, background: riskColor(s.aiRiskLevel || 'LOW') }} /></div>
                                            <div style={{ fontSize: 12, color: '#7f8c8d', marginTop: 6 }}>Confidence: <strong style={{ color: '#2c3e50' }}>{s.aiConfidence !== undefined ? `${(s.aiConfidence * 100).toFixed(0)}%` : 'N/A'}</strong></div>
                                            <div className="hc-metric-bar" style={{ width: 120 }}><div className="hc-metric-fill" style={{ width: `${(s.aiConfidence || 0) * 100}%`, background: '#3498db' }} /></div>
                                        </div>
                                    </div>
                                </div>
                                {/* Risk Factor Tags */}
                                {s.riskFactors?.length > 0 && (
                                    <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #f0f3f7' }}>
                                        <span className="hc-label" style={{ marginBottom: 8 }}>Identified Risk Factors</span>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                                            {s.riskFactors.map((rf, j) => (
                                                <span key={j} className="hc-tag" style={{ background: rf.severity === 'high' ? '#fdedec' : rf.severity === 'medium' ? '#fef9e7' : '#f0f3f7', borderColor: rf.severity === 'high' ? '#f5b7b1' : rf.severity === 'medium' ? '#f9e79f' : '#dce1e8' }}>
                                                    {(rf.factor || '').replace(/-/g, ' ')} <span style={{ color: '#7f8c8d', marginLeft: 4 }}>({rf.severity})</span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {/* Clinical Observations Summary */}
                                {s.clinicalObservations && (s.clinicalObservations.physicalInjuries?.length > 0 || s.clinicalObservations.behavioralIndicators?.length > 0) && (
                                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #f0f3f7' }}>
                                        {s.clinicalObservations.physicalInjuries?.length > 0 && (
                                            <div style={{ marginBottom: 6 }}><span style={{ fontSize: 12, fontWeight: 600, color: '#e74c3c' }}>Injuries: </span>{s.clinicalObservations.physicalInjuries.map((inj, k) => <span key={k} className="hc-tag" style={{ background: '#fdedec', borderColor: '#f5b7b1', fontSize: 11 }}>{inj.replace(/-/g, ' ')}</span>)}</div>
                                        )}
                                        {s.clinicalObservations.behavioralIndicators?.length > 0 && (
                                            <div><span style={{ fontSize: 12, fontWeight: 600, color: '#f39c12' }}>Behaviors: </span>{s.clinicalObservations.behavioralIndicators.map((beh, k) => <span key={k} className="hc-tag" style={{ background: '#fef9e7', borderColor: '#f9e79f', fontSize: 11 }}>{beh.replace(/-/g, ' ')}</span>)}</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )) : (
                            <div style={{ textAlign: 'center', padding: 40, color: '#7f8c8d' }}>
                                <p>No AI risk scores available. Conduct IPV screenings to generate assessments.</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default AIRiskScoreForm;
