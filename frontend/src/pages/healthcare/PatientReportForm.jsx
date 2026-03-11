import React, { useState } from 'react';
import './HealthcareVisuals.css';

const API = 'http://localhost:5001/api/healthcare';
const hdrs = () => { const u = JSON.parse(localStorage.getItem('userInfo') || '{}'); return { 'Content-Type': 'application/json', Authorization: `Bearer ${u.token || ''}` }; };

const SEC = ['demographics', 'screeningHistory', 'riskScores', 'referrals', 'carePlans', 'followUps'];
const REPORT_TYPES = [
    { v: 'comprehensive', l: 'Comprehensive Report', d: 'Full patient history including all sections' },
    { v: 'screening-summary', l: 'Screening Summary', d: 'Historical screening records with dates, types, scores' },
    { v: 'risk-assessment', l: 'Risk Assessment Report', d: 'Risk levels, trends, and positive screening analysis' },
    { v: 'referral-history', l: 'Referral History', d: 'Complete referral records with providers and status' },
    { v: 'care-plan-summary', l: 'Care Plan Summary', d: 'Diagnoses, goals, interventions, and priority flags' },
    { v: 'follow-up-summary', l: 'Follow-Up Summary', d: 'Scheduled and completed follow-ups with outcomes' }
];

const riskClass = l => l === 'HIGH' ? 'risk-high' : l === 'MEDIUM' ? 'risk-medium' : 'risk-low';

const PatientReportForm = () => {
    const [pid, setPid] = useState('');
    const [reports, setReports] = useState([]);
    const [show, setShow] = useState(false);
    const [preview, setPreview] = useState(null);
    const [msg, setMsg] = useState('');
    const [form, setForm] = useState({ reportType: 'comprehensive', dateRange: { startDate: '', endDate: '' }, includeSections: { demographics: true, screeningHistory: true, riskScores: true, referrals: true, carePlans: true, followUps: true } });

    const flash = t => { setMsg(t); setTimeout(() => setMsg(''), 3000); };

    const load = async () => {
        if (!pid.trim()) { flash('Enter patient ID'); return; }
        try { const r = await fetch(`${API}/reports/${pid}`, { headers: hdrs() }); const d = await r.json(); if (r.ok) setReports(d.reports || []); } catch (e) { flash('Failed'); }
    };

    const [allPatients, setAllPatients] = useState([]);
    const loadAllPatients = async () => {
        try {
            const r = await fetch(`${API}/patients/search?q=`, { headers: hdrs() });
            const d = await r.json();
            if (r.ok) { setAllPatients(d.patients || []); flash(`Loaded ${d.patients?.length || 0} patients`); }
        } catch (e) { flash('Network error'); }
    };

    const generate = async e => {
        e.preventDefault();
        try {
            const r = await fetch(`${API}/reports`, { method: 'POST', headers: hdrs(), body: JSON.stringify({ patientId: pid, ...form }) });
            const d = await r.json();
            if (r.ok) { flash('Report generated!'); setPreview(d.report); setShow(false); load(); }
            else flash(d.error?.message || 'Failed');
        } catch (e) { flash('Network error'); }
    };

    const del = async id => { if (!window.confirm('Delete?')) return; try { if ((await fetch(`${API}/reports/${id}`, { method: 'DELETE', headers: hdrs() })).ok) { flash('Deleted!'); load(); } } catch (e) { flash('Failed'); } };

    const toggleSec = s => setForm({ ...form, includeSections: { ...form.includeSections, [s]: !form.includeSections[s] } });

    const printReport = () => { window.print(); };

    /* ── Formatted Report Renderer ── */
    const renderReport = (rpt) => {
        const rd = rpt.reportData || {};
        return (
            <div id="report-printable">
                {/* Header */}
                <div style={{ textAlign: 'center', borderBottom: '2px solid #2c3e50', paddingBottom: 16, marginBottom: 20 }}>
                    <h2 style={{ margin: 0, color: '#2c3e50' }}>ARAM Healthcare — Patient Report</h2>
                    <p style={{ margin: '6px 0 0', color: '#7f8c8d', fontSize: 13 }}>
                        Type: <strong>{rpt.reportType}</strong> | Generated: {new Date(rpt.createdAt).toLocaleString()} | Range: {new Date(rpt.dateRange?.startDate).toLocaleDateString()} – {new Date(rpt.dateRange?.endDate).toLocaleDateString()}
                    </p>
                </div>

                {/* Demographics */}
                {rd.demographics && (
                    <div className="hc-section" style={{ pageBreakInside: 'avoid' }}>
                        <h3>👤 Patient Demographics</h3>
                        <div className="hc-grid" style={{ marginTop: 12 }}>
                            <div><span className="hc-label">First Name</span>{rd.demographics.firstName}</div>
                            <div><span className="hc-label">Last Name</span>{rd.demographics.lastName}</div>
                            <div><span className="hc-label">Date of Birth</span>{rd.demographics.dateOfBirth ? new Date(rd.demographics.dateOfBirth).toLocaleDateString() : '—'}</div>
                            <div><span className="hc-label">Gender</span><span style={{ textTransform: 'capitalize' }}>{rd.demographics.gender || '—'}</span></div>
                            {rd.contactInfo && <>
                                <div><span className="hc-label">Phone</span>{rd.contactInfo.phone || '—'}</div>
                                <div><span className="hc-label">Email</span>{rd.contactInfo.email || '—'}</div>
                            </>}
                        </div>
                    </div>
                )}

                {/* Risk History */}
                {rd.riskHistory && (
                    <div className="hc-section" style={{ pageBreakInside: 'avoid' }}>
                        <h3>⚠️ Risk Assessment Summary</h3>
                        <div className="stats-grid" style={{ marginTop: 12, gridTemplateColumns: 'repeat(3, 1fr)' }}>
                            <div className="hc-stat-card">
                                <div className="hc-stat-value" style={{ color: rd.riskHistory.highestRiskLevel === 'HIGH' ? '#e74c3c' : rd.riskHistory.highestRiskLevel === 'MEDIUM' ? '#f39c12' : '#27ae60' }}>{rd.riskHistory.highestRiskLevel || 'N/A'}</div>
                                <div className="hc-stat-label">Highest Risk Level</div>
                            </div>
                            <div className="hc-stat-card">
                                <div className="hc-stat-value" style={{ color: '#3498db' }}>{rd.riskHistory.totalScreenings || 0}</div>
                                <div className="hc-stat-label">Total Screenings</div>
                            </div>
                            <div className="hc-stat-card">
                                <div className="hc-stat-value" style={{ color: '#f39c12' }}>{rd.riskHistory.positiveScreenings || 0}</div>
                                <div className="hc-stat-label">Positive Screenings</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Screenings */}
                {rd.screenings?.length > 0 && (
                    <div className="hc-section" style={{ overflow: 'auto', pageBreakInside: 'avoid' }}>
                        <h3>🏥 Screening History ({rd.screenings.length} records)</h3>
                        <table className="hc-table" style={{ marginTop: 12 }}>
                            <thead><tr><th>Date</th><th>Type</th><th>Score</th><th>Risk Level</th></tr></thead>
                            <tbody>
                                {rd.screenings.map((s, i) => (
                                    <tr key={i}>
                                        <td>{new Date(s.completedAt).toLocaleDateString()}</td>
                                        <td>{s.screeningType}</td>
                                        <td><strong>{s.totalScore}</strong></td>
                                        <td><span className={riskClass(s.riskAssessment?.finalRiskLevel || 'LOW')}>{s.riskAssessment?.finalRiskLevel || 'LOW'}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Referrals */}
                {rd.referrals?.length > 0 && (
                    <div className="hc-section" style={{ overflow: 'auto', pageBreakInside: 'avoid' }}>
                        <h3>🤝 Referral History ({rd.referrals.length} records)</h3>
                        <table className="hc-table" style={{ marginTop: 12 }}>
                            <thead><tr><th>Date</th><th>Type</th><th>Provider</th><th>Urgency</th><th>Status</th></tr></thead>
                            <tbody>
                                {rd.referrals.map((ref, i) => (
                                    <tr key={i}>
                                        <td>{new Date(ref.createdAt).toLocaleDateString()}</td>
                                        <td style={{ textTransform: 'capitalize' }}>{ref.referralType}</td>
                                        <td>{ref.serviceProvider?.name || '—'}</td>
                                        <td><span className={ref.urgencyLevel === 'emergency' ? 'risk-high' : ref.urgencyLevel === 'urgent' ? 'risk-medium' : 'risk-low'}>{ref.urgencyLevel}</span></td>
                                        <td>{ref.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Care Plans */}
                {rd.carePlans?.length > 0 && (
                    <div className="hc-section" style={{ pageBreakInside: 'avoid' }}>
                        <h3>📋 Care Plan Summary ({rd.carePlans.length} plans)</h3>
                        {rd.carePlans.map((cp, i) => (
                            <div key={i} className="hc-score-card" style={{ borderLeftColor: cp.priority === 'urgent' || cp.priority === 'high' ? '#e74c3c' : '#27ae60' }}>
                                <strong>{cp.diagnosis}</strong>
                                <span className="hc-tag" style={{ marginLeft: 10 }}>{cp.status}</span>
                                <span className="hc-tag" style={{ marginLeft: 6 }}>{cp.priority}</span>
                                {cp.goals?.length > 0 && <div style={{ marginTop: 8, fontSize: 13 }}><strong>Goals:</strong> {cp.goals.map((g, j) => <span key={j} className="hc-tag">{g.description} ({g.status})</span>)}</div>}
                                {cp.interventions?.length > 0 && <div style={{ marginTop: 6, fontSize: 13 }}><strong>Interventions:</strong> {cp.interventions.map((iv, j) => <span key={j} className="hc-tag">{iv.type}: {iv.description}</span>)}</div>}
                            </div>
                        ))}
                    </div>
                )}

                {/* Follow-Ups */}
                {rd.followUps?.length > 0 && (
                    <div className="hc-section" style={{ overflow: 'auto', pageBreakInside: 'avoid' }}>
                        <h3>📅 Follow-Up Summary ({rd.followUps.length} records)</h3>
                        <table className="hc-table" style={{ marginTop: 12 }}>
                            <thead><tr><th>Date</th><th>Type</th><th>Status</th><th>Outcome</th><th>Next Follow-Up</th></tr></thead>
                            <tbody>
                                {rd.followUps.map((fu, i) => (
                                    <tr key={i}>
                                        <td>{new Date(fu.followUpDate).toLocaleDateString()}</td>
                                        <td style={{ textTransform: 'capitalize' }}>{fu.followUpType?.replace(/-/g, ' ')}</td>
                                        <td><span className={fu.status === 'completed' ? 'risk-low' : fu.status === 'missed' ? 'risk-high' : 'risk-medium'}>{fu.status}</span></td>
                                        <td>{fu.outcome || '—'}</td>
                                        <td>{fu.nextFollowUpDate ? new Date(fu.nextFollowUpDate).toLocaleDateString() : '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div>
            {msg && <div className="hc-alert hc-alert-info"><span>ℹ️</span><div>{msg}</div></div>}

            <div className="hc-section">
                <h3>📄 Patient Report Generation</h3>
                <p className="hc-subtitle">Generate comprehensive or targeted reports — configurable sections, PDF export, and saved archive</p>
                <div className="hc-search-bar">
                    <input className="hc-input" placeholder="Enter Patient ID (e.g. PAT-001)..." value={pid} onChange={e => setPid(e.target.value)} />
                    <button className="hc-btn hc-btn-primary" onClick={load}>Load Reports</button>
                    <button className="hc-btn hc-btn-secondary" onClick={loadAllPatients}>View All Patients</button>
                    <button className="hc-btn hc-btn-success" onClick={() => setShow(true)}>+ Generate New</button>
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
                        <thead><tr><th>Patient ID</th><th>Name</th><th>Action</th></tr></thead>
                        <tbody>
                            {allPatients.map(p => (
                                <tr key={p._id}>
                                    <td><strong>{p.patientId}</strong></td>
                                    <td>{p.demographics?.firstName} {p.demographics?.lastName}</td>
                                    <td><button className="hc-btn hc-btn-primary hc-btn-sm" onClick={() => { setPid(p.patientId); setAllPatients([]); }}>Select</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Generate Form */}
            {show && (
                <form onSubmit={generate}>
                    <div className="hc-section">
                        <h3>Generate New Report</h3>

                        {/* Report type selection */}
                        <div style={{ marginTop: 16 }}>
                            <label className="hc-label">Report Type *</label>
                            <div className="hc-grid" style={{ marginTop: 8 }}>
                                {REPORT_TYPES.map(rt => (
                                    <label key={rt.v} className={`hc-option-label ${form.reportType === rt.v ? 'selected' : ''}`} style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '12px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <input type="radio" name="rtype" checked={form.reportType === rt.v} onChange={() => setForm({ ...form, reportType: rt.v })} />
                                            <strong style={{ fontSize: 14 }}>{rt.l}</strong>
                                        </div>
                                        <span style={{ fontSize: 12, color: '#7f8c8d', marginTop: 4, marginLeft: 22 }}>{rt.d}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="hc-grid" style={{ marginTop: 16 }}>
                            <div><label className="hc-label">Start Date *</label><input className="hc-input" type="date" required value={form.dateRange.startDate} onChange={e => setForm({ ...form, dateRange: { ...form.dateRange, startDate: e.target.value } })} /></div>
                            <div><label className="hc-label">End Date *</label><input className="hc-input" type="date" required value={form.dateRange.endDate} onChange={e => setForm({ ...form, dateRange: { ...form.dateRange, endDate: e.target.value } })} /></div>
                        </div>

                        {/* Configurable Sections */}
                        <div style={{ marginTop: 16 }}>
                            <label className="hc-label">Include Sections</label>
                            <div className="hc-option-group" style={{ marginTop: 8 }}>
                                {SEC.map(s => (
                                    <label key={s} className={`hc-option-label ${form.includeSections[s] ? 'selected' : ''}`}>
                                        <input type="checkbox" checked={form.includeSections[s]} onChange={() => toggleSec(s)} />
                                        <span style={{ textTransform: 'capitalize' }}>{s.replace(/([A-Z])/g, ' $1').trim()}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="hc-btn-group">
                            <button type="submit" className="hc-btn hc-btn-success">Generate Report</button>
                            <button type="button" className="hc-btn hc-btn-secondary" onClick={() => setShow(false)}>Cancel</button>
                        </div>
                    </div>
                </form>
            )}

            {/* Report Preview */}
            {preview && (
                <div>
                    <div className="hc-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0 }}>📄 Report Preview — {preview.reportType}</h3>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button className="hc-btn hc-btn-primary" onClick={printReport}>🖨️ Print / Save PDF</button>
                            <button className="hc-btn hc-btn-secondary" onClick={() => setPreview(null)}>Close</button>
                        </div>
                    </div>
                    {renderReport(preview)}
                </div>
            )}

            {/* Saved Reports Archive */}
            {reports.length > 0 && !preview && (
                <div className="hc-section" style={{ overflow: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <h3 style={{ margin: 0 }}>📁 Saved Reports Archive ({reports.length})</h3>
                        <button className="hc-btn hc-btn-danger hc-btn-sm" onClick={() => setReports([])}>✕ Close</button>
                    </div>
                    <table className="hc-table" style={{ marginTop: 12 }}>
                        <thead><tr><th>Generated</th><th>Type</th><th>Date Range</th><th>Generated By</th><th>Sections</th><th>Actions</th></tr></thead>
                        <tbody>
                            {reports.map(rpt => {
                                const secs = rpt.includeSections || {};
                                const activeSecs = Object.entries(secs).filter(([, v]) => v).map(([k]) => k);
                                return (
                                    <tr key={rpt._id}>
                                        <td>{new Date(rpt.createdAt).toLocaleDateString()}</td>
                                        <td><span className="hc-tag" style={{ textTransform: 'capitalize' }}>{rpt.reportType?.replace(/-/g, ' ')}</span></td>
                                        <td>{rpt.dateRange ? `${new Date(rpt.dateRange.startDate).toLocaleDateString()} – ${new Date(rpt.dateRange.endDate).toLocaleDateString()}` : '—'}</td>
                                        <td>{rpt.generatedBy?.name || '—'}</td>
                                        <td>{activeSecs.length > 0 ? activeSecs.map(s => <span key={s} className="hc-tag" style={{ fontSize: 10 }}>{s}</span>) : '—'}</td>
                                        <td>
                                            <button className="hc-btn hc-btn-primary hc-btn-sm" onClick={() => setPreview(rpt)} style={{ marginRight: 6 }}>View</button>
                                            <button className="hc-btn hc-btn-primary hc-btn-sm" onClick={() => { setPreview(rpt); setTimeout(printReport, 500); }} style={{ marginRight: 6 }}>PDF</button>
                                            <button className="hc-btn hc-btn-danger hc-btn-sm" onClick={() => del(rpt._id)}>Delete</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PatientReportForm;
