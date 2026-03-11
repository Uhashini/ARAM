import React, { useState } from 'react';
import './HealthcareVisuals.css';

const API = 'https://aram-ira2.onrender.com/api/healthcare';
const hdrs = () => { const u = JSON.parse(localStorage.getItem('userInfo') || '{}'); return { 'Content-Type': 'application/json', Authorization: `Bearer ${u.token || ''}` }; };

const CarePlanForm = () => {
    const [tab, setTab] = useState('plans');
    const [pid, setPid] = useState('');
    const [plans, setPlans] = useState([]);
    const [followUps, setFollowUps] = useState([]);
    const [showPlan, setShowPlan] = useState(false);
    const [showFU, setShowFU] = useState(false);
    const [editPlanId, setEditPlanId] = useState(null);
    const [editFUId, setEditFUId] = useState(null);
    const [msg, setMsg] = useState('');
    const [planForm, setPlanForm] = useState({ patientId: '', diagnosis: '', goals: [{ description: '', targetDate: '', status: 'pending' }], interventions: [{ type: 'counseling', description: '', frequency: 'as-needed', status: 'planned' }], status: 'active', priority: 'medium', notes: '' });
    const [fuForm, setFUForm] = useState({ patientId: '', carePlanId: '', followUpDate: '', followUpType: 'in-person', status: 'scheduled', outcome: '', notes: '', nextFollowUpDate: '' });

    const flash = t => { setMsg(t); setTimeout(() => setMsg(''), 3000); };

    const loadPlans = async () => { if (!pid.trim()) { flash('Enter patient ID'); return; } try { const r = await fetch(`${API}/careplan/${pid}`, { headers: hdrs() }); const d = await r.json(); if (r.ok) setPlans(d.carePlans || []); } catch (e) { flash('Failed'); } };
    const loadFU = async () => { if (!pid.trim()) { flash('Enter patient ID'); return; } try { const r = await fetch(`${API}/followup/${pid}`, { headers: hdrs() }); const d = await r.json(); if (r.ok) setFollowUps(d.followUps || []); } catch (e) { flash('Failed'); } };

    const [allPatients, setAllPatients] = useState([]);
    const loadAllPatients = async () => {
        try {
            const r = await fetch(`${API}/patients/search?q=`, { headers: hdrs() });
            const d = await r.json();
            if (r.ok) { setAllPatients(d.patients || []); flash(`Loaded ${d.patients?.length || 0} patients`); }
        } catch (e) { flash('Network error'); }
    };

    const submitPlan = async e => {
        e.preventDefault();
        try {
            const url = editPlanId ? `${API}/careplan/${editPlanId}` : `${API}/careplan`;
            const r = await fetch(url, { method: editPlanId ? 'PUT' : 'POST', headers: hdrs(), body: JSON.stringify({ ...planForm, patientId: pid }) });
            if (r.ok) { flash(editPlanId ? 'Updated!' : 'Created!'); setShowPlan(false); setEditPlanId(null); loadPlans(); }
            else { const d = await r.json(); flash(d.error?.message || 'Failed'); }
        } catch (e) { flash('Network error'); }
    };

    const submitFU = async e => {
        e.preventDefault();
        try {
            const url = editFUId ? `${API}/followup/${editFUId}` : `${API}/followup`;
            const r = await fetch(url, { method: editFUId ? 'PUT' : 'POST', headers: hdrs(), body: JSON.stringify({ ...fuForm, patientId: pid }) });
            if (r.ok) { flash(editFUId ? 'Updated!' : 'Created!'); setShowFU(false); setEditFUId(null); loadFU(); }
            else { const d = await r.json(); flash(d.error?.message || 'Failed'); }
        } catch (e) { flash('Network error'); }
    };

    const delPlan = async id => { if (!window.confirm('Delete?')) return; try { if ((await fetch(`${API}/careplan/${id}`, { method: 'DELETE', headers: hdrs() })).ok) { flash('Deleted!'); loadPlans(); } } catch (e) { flash('Failed'); } };
    const delFU = async id => { if (!window.confirm('Delete?')) return; try { if ((await fetch(`${API}/followup/${id}`, { method: 'DELETE', headers: hdrs() })).ok) { flash('Deleted!'); loadFU(); } } catch (e) { flash('Failed'); } };

    const editPlan = p => { setEditPlanId(p._id); setPlanForm({ patientId: p.patientId, diagnosis: p.diagnosis, goals: p.goals?.length ? p.goals.map(g => ({ ...g, targetDate: g.targetDate?.split('T')[0] || '' })) : [{ description: '', targetDate: '', status: 'pending' }], interventions: p.interventions?.length ? p.interventions : [{ type: 'counseling', description: '', frequency: 'as-needed', status: 'planned' }], status: p.status || 'active', priority: p.priority || 'medium', notes: p.notes || '' }); setShowPlan(true); };
    const editFUEntry = f => { setEditFUId(f._id); setFUForm({ patientId: f.patientId, carePlanId: f.carePlanId?._id || f.carePlanId || '', followUpDate: f.followUpDate?.split('T')[0] || '', followUpType: f.followUpType || 'in-person', status: f.status || 'scheduled', outcome: f.outcome || '', notes: f.notes || '', nextFollowUpDate: f.nextFollowUpDate?.split('T')[0] || '' }); setShowFU(true); };

    const addGoal = () => setPlanForm({ ...planForm, goals: [...planForm.goals, { description: '', targetDate: '', status: 'pending' }] });
    const addIntv = () => setPlanForm({ ...planForm, interventions: [...planForm.interventions, { type: 'counseling', description: '', frequency: 'as-needed', status: 'planned' }] });

    const priorityClass = p => p === 'urgent' || p === 'high' ? 'risk-high' : p === 'medium' ? 'risk-medium' : 'risk-low';
    const statusColor = s => s === 'active' ? '#27ae60' : s === 'completed' ? '#3498db' : s === 'on-hold' ? '#f39c12' : '#e74c3c';
    const fuStatusClass = s => s === 'completed' ? 'risk-low' : s === 'missed' ? 'risk-high' : s === 'scheduled' ? 'risk-medium' : 'risk-low';
    const fuIcon = t => t === 'in-person' ? '🏥' : t === 'phone' ? '📞' : t === 'video' ? '🎥' : t === 'home-visit' ? '🏠' : '✉️';

    return (
        <div>
            {msg && <div className="hc-alert hc-alert-info"><span>ℹ️</span><div>{msg}</div></div>}

            <div className="hc-section">
                <h3>📋 Care Plan & Follow-Up</h3>
                <p className="hc-subtitle">Create care plans with goals and interventions, and track follow-up appointments</p>
                <div className="hc-search-bar">
                    <input className="hc-input" placeholder="Enter Patient ID (e.g. PAT-001)..." value={pid} onChange={e => setPid(e.target.value)} />
                    <button className="hc-btn hc-btn-primary" onClick={() => { loadPlans(); loadFU(); }}>Load</button>
                    <button className="hc-btn hc-btn-secondary" onClick={loadAllPatients}>View All Patients</button>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                    <button className={`hc-tab ${tab === 'plans' ? 'active' : ''}`} onClick={() => setTab('plans')}>Care Plans</button>
                    <button className={`hc-tab ${tab === 'logs' ? 'active' : ''}`} onClick={() => setTab('logs')}>Follow-Up Logs</button>
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

            {tab === 'plans' && (
                <>
                    <div style={{ marginBottom: 16, textAlign: 'right' }}>
                        <button className="hc-btn hc-btn-success" onClick={() => { setShowPlan(true); setEditPlanId(null); setPlanForm({ patientId: '', diagnosis: '', goals: [{ description: '', targetDate: '', status: 'pending' }], interventions: [{ type: 'counseling', description: '', frequency: 'as-needed', status: 'planned' }], status: 'active', priority: 'medium', notes: '' }); }}>+ New Care Plan</button>
                    </div>

                    {/* Care Plan Status Cards */}
                    {plans.map(p => (
                        <div key={p._id} className="hc-score-card" style={{ borderLeftColor: statusColor(p.status) }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <h3 style={{ margin: 0, fontSize: 16 }}>{p.diagnosis}</h3>
                                <div style={{ display: 'flex', gap: 6 }}>
                                    <span className={priorityClass(p.priority)} style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 20, fontSize: 11.5, fontWeight: 700 }}>{p.priority?.toUpperCase()}</span>
                                    <span className="hc-tag" style={{ background: `${statusColor(p.status)}15`, color: statusColor(p.status), borderColor: statusColor(p.status) }}>{p.status}</span>
                                </div>
                            </div>

                            {/* Goals */}
                            {p.goals?.length > 0 && (
                                <div style={{ marginBottom: 12 }}>
                                    <span className="hc-label">Goals</span>
                                    <div style={{ marginTop: 6 }}>
                                        {p.goals.map((g, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', marginBottom: 4, background: '#f5f7fa', borderRadius: 6, fontSize: 13 }}>
                                                <span style={{ fontSize: 14 }}>{g.status === 'achieved' ? '✅' : g.status === 'in-progress' ? '🔄' : '⏳'}</span>
                                                <span style={{ flex: 1 }}>{g.description}</span>
                                                <span className="hc-tag" style={{ fontSize: 11 }}>{g.status}</span>
                                                {g.targetDate && <span style={{ fontSize: 11, color: '#7f8c8d' }}>by {new Date(g.targetDate).toLocaleDateString()}</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Interventions */}
                            {p.interventions?.length > 0 && (
                                <div style={{ marginBottom: 12 }}>
                                    <span className="hc-label">Interventions</span>
                                    <div style={{ marginTop: 6 }}>
                                        {p.interventions.map((iv, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', marginBottom: 4, background: '#eaf2fd', borderRadius: 6, fontSize: 13 }}>
                                                <span className="hc-tag" style={{ background: '#3498db15', color: '#3498db', borderColor: '#aed6f1' }}>{iv.type}</span>
                                                <span style={{ flex: 1 }}>{iv.description}</span>
                                                <span style={{ fontSize: 11, color: '#7f8c8d' }}>{iv.frequency}</span>
                                                <span className="hc-tag" style={{ fontSize: 11 }}>{iv.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {p.notes && <p style={{ color: '#7f8c8d', fontSize: 13, margin: '8px 0' }}>{p.notes}</p>}
                            <div className="hc-btn-group" style={{ marginTop: 10 }}>
                                <button className="hc-btn hc-btn-primary hc-btn-sm" onClick={() => editPlan(p)}>Edit</button>
                                <button className="hc-btn hc-btn-danger hc-btn-sm" onClick={() => delPlan(p._id)}>Delete</button>
                            </div>
                        </div>
                    ))}

                    {/* Create/Edit form */}
                    {showPlan && (
                        <form onSubmit={submitPlan}>
                            <div className="hc-section">
                                <h3>{editPlanId ? 'Edit Care Plan' : 'New Care Plan'}</h3>
                                <div className="hc-grid" style={{ marginTop: 16 }}>
                                    <div><label className="hc-label">Diagnosis *</label><input className="hc-input" required value={planForm.diagnosis} onChange={e => setPlanForm({ ...planForm, diagnosis: e.target.value })} /></div>
                                    <div><label className="hc-label">Status</label><select className="hc-select" value={planForm.status} onChange={e => setPlanForm({ ...planForm, status: e.target.value })}><option value="active">Active</option><option value="completed">Completed</option><option value="on-hold">On Hold</option><option value="cancelled">Cancelled</option></select></div>
                                    <div><label className="hc-label">Priority</label><select className="hc-select" value={planForm.priority} onChange={e => setPlanForm({ ...planForm, priority: e.target.value })}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option></select></div>
                                </div>

                                {/* Goals */}
                                <div style={{ marginTop: 20 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h3 style={{ margin: 0 }}>Goals</h3>
                                        <button type="button" className="hc-btn hc-btn-outline hc-btn-sm" onClick={addGoal}>+ Add Goal</button>
                                    </div>
                                    {planForm.goals.map((g, i) => (
                                        <div key={i} className="hc-grid-3" style={{ padding: 14, background: '#f5f7fa', borderRadius: 10, marginTop: 10 }}>
                                            <div><label className="hc-label">Description</label><input className="hc-input" value={g.description} onChange={e => { const u = [...planForm.goals]; u[i].description = e.target.value; setPlanForm({ ...planForm, goals: u }); }} /></div>
                                            <div><label className="hc-label">Target Date</label><input className="hc-input" type="date" value={g.targetDate} onChange={e => { const u = [...planForm.goals]; u[i].targetDate = e.target.value; setPlanForm({ ...planForm, goals: u }); }} /></div>
                                            <div><label className="hc-label">Status</label><select className="hc-select" value={g.status} onChange={e => { const u = [...planForm.goals]; u[i].status = e.target.value; setPlanForm({ ...planForm, goals: u }); }}><option value="pending">Pending</option><option value="in-progress">In Progress</option><option value="achieved">Achieved</option><option value="revised">Revised</option></select></div>
                                        </div>
                                    ))}
                                </div>

                                {/* Interventions */}
                                <div style={{ marginTop: 20 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h3 style={{ margin: 0 }}>Interventions</h3>
                                        <button type="button" className="hc-btn hc-btn-outline hc-btn-sm" onClick={addIntv}>+ Add Intervention</button>
                                    </div>
                                    {planForm.interventions.map((iv, i) => (
                                        <div key={i} className="hc-grid-3" style={{ padding: 14, background: '#f5f7fa', borderRadius: 10, marginTop: 10 }}>
                                            <div><label className="hc-label">Type</label><select className="hc-select" value={iv.type} onChange={e => { const u = [...planForm.interventions]; u[i].type = e.target.value; setPlanForm({ ...planForm, interventions: u }); }}><option value="counseling">Counseling</option><option value="safety-planning">Safety Planning</option><option value="medical-care">Medical Care</option><option value="referral">Referral</option><option value="follow-up">Follow-Up</option><option value="documentation">Documentation</option><option value="other">Other</option></select></div>
                                            <div><label className="hc-label">Description</label><input className="hc-input" value={iv.description} onChange={e => { const u = [...planForm.interventions]; u[i].description = e.target.value; setPlanForm({ ...planForm, interventions: u }); }} /></div>
                                            <div><label className="hc-label">Frequency</label><select className="hc-select" value={iv.frequency} onChange={e => { const u = [...planForm.interventions]; u[i].frequency = e.target.value; setPlanForm({ ...planForm, interventions: u }); }}><option value="once">Once</option><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="bi-weekly">Bi-Weekly</option><option value="monthly">Monthly</option><option value="as-needed">As Needed</option></select></div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ marginTop: 16 }}><label className="hc-label">Notes</label><textarea className="hc-textarea" value={planForm.notes} onChange={e => setPlanForm({ ...planForm, notes: e.target.value })} /></div>
                                <div className="hc-btn-group">
                                    <button type="submit" className="hc-btn hc-btn-success">{editPlanId ? 'Update' : 'Create'} Care Plan</button>
                                    <button type="button" className="hc-btn hc-btn-secondary" onClick={() => { setShowPlan(false); setEditPlanId(null); }}>Cancel</button>
                                </div>
                            </div>
                        </form>
                    )}
                </>
            )}

            {tab === 'logs' && (
                <>
                    <div style={{ marginBottom: 16, textAlign: 'right' }}>
                        <button className="hc-btn hc-btn-success" onClick={() => { setShowFU(true); setEditFUId(null); setFUForm({ patientId: '', carePlanId: '', followUpDate: '', followUpType: 'in-person', status: 'scheduled', outcome: '', notes: '', nextFollowUpDate: '' }); }}>+ New Follow-Up</button>
                    </div>

                    {/* Follow-Up Timeline */}
                    {followUps.length > 0 ? (
                        <div className="hc-section">
                            <h3>Follow-Up Timeline</h3>
                            <div style={{ marginTop: 16 }}>
                                {followUps.map(f => (
                                    <div key={f._id} className="hc-timeline-item">
                                        <div className="hc-score-card" style={{ borderLeftColor: f.status === 'completed' ? '#27ae60' : f.status === 'missed' ? '#e74c3c' : '#f39c12', marginBottom: 0 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                                                <div>
                                                    <span style={{ fontSize: 18, marginRight: 8 }}>{fuIcon(f.followUpType)}</span>
                                                    <strong>{f.followUpType?.replace(/-/g, ' ')}</strong>
                                                    <span style={{ color: '#7f8c8d', marginLeft: 10, fontSize: 13 }}>{new Date(f.followUpDate).toLocaleDateString()}</span>
                                                </div>
                                                <span className={fuStatusClass(f.status)} style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 20, fontSize: 11.5, fontWeight: 700 }}>{f.status?.toUpperCase()}</span>
                                            </div>
                                            {f.carePlanId?.diagnosis && <div style={{ marginTop: 6, fontSize: 13, color: '#7f8c8d' }}>Care Plan: <strong>{f.carePlanId.diagnosis}</strong></div>}
                                            {f.outcome && <div style={{ marginTop: 6, fontSize: 13 }}>Outcome: {f.outcome}</div>}
                                            {f.notes && <div style={{ marginTop: 4, fontSize: 13, color: '#7f8c8d' }}>{f.notes}</div>}
                                            {f.nextFollowUpDate && <div style={{ marginTop: 6, fontSize: 12, color: '#3498db' }}>Next follow-up: {new Date(f.nextFollowUpDate).toLocaleDateString()}</div>}
                                            <div className="hc-btn-group" style={{ marginTop: 8 }}>
                                                <button className="hc-btn hc-btn-primary hc-btn-sm" onClick={() => editFUEntry(f)}>Edit</button>
                                                <button className="hc-btn hc-btn-danger hc-btn-sm" onClick={() => delFU(f._id)}>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : <div className="hc-section" style={{ textAlign: 'center', color: '#7f8c8d', padding: 40 }}>No follow-up logs found. Click "+ New Follow-Up" to add one.</div>}

                    {/* Follow-Up Form */}
                    {showFU && (
                        <form onSubmit={submitFU} style={{ marginTop: 16 }}>
                            <div className="hc-section">
                                <h3>{editFUId ? 'Edit Follow-Up' : 'New Follow-Up Log'}</h3>
                                <div className="hc-grid" style={{ marginTop: 16 }}>
                                    <div><label className="hc-label">Care Plan ID (Optional)</label><input className="hc-input" placeholder="MongoDB ObjectId of care plan" value={fuForm.carePlanId} onChange={e => setFUForm({ ...fuForm, carePlanId: e.target.value })} /></div>
                                    <div><label className="hc-label">Follow-Up Date *</label><input className="hc-input" type="date" required value={fuForm.followUpDate} onChange={e => setFUForm({ ...fuForm, followUpDate: e.target.value })} /></div>
                                    <div><label className="hc-label">Type *</label><select className="hc-select" required value={fuForm.followUpType} onChange={e => setFUForm({ ...fuForm, followUpType: e.target.value })}><option value="in-person">In-Person</option><option value="phone">Phone</option><option value="video">Video</option><option value="home-visit">Home Visit</option><option value="email">Email</option></select></div>
                                    <div><label className="hc-label">Status</label><select className="hc-select" value={fuForm.status} onChange={e => setFUForm({ ...fuForm, status: e.target.value })}><option value="scheduled">Scheduled</option><option value="completed">Completed</option><option value="missed">Missed</option><option value="cancelled">Cancelled</option><option value="rescheduled">Rescheduled</option></select></div>
                                    <div><label className="hc-label">Next Follow-Up Date</label><input className="hc-input" type="date" value={fuForm.nextFollowUpDate} onChange={e => setFUForm({ ...fuForm, nextFollowUpDate: e.target.value })} /></div>
                                </div>
                                <div style={{ marginTop: 14 }}><label className="hc-label">Outcome</label><textarea className="hc-textarea" style={{ minHeight: 60 }} value={fuForm.outcome} onChange={e => setFUForm({ ...fuForm, outcome: e.target.value })} /></div>
                                <div style={{ marginTop: 14 }}><label className="hc-label">Notes</label><textarea className="hc-textarea" style={{ minHeight: 60 }} value={fuForm.notes} onChange={e => setFUForm({ ...fuForm, notes: e.target.value })} /></div>
                                <div className="hc-btn-group">
                                    <button type="submit" className="hc-btn hc-btn-success">{editFUId ? 'Update' : 'Create'} Follow-Up</button>
                                    <button type="button" className="hc-btn hc-btn-secondary" onClick={() => { setShowFU(false); setEditFUId(null); }}>Cancel</button>
                                </div>
                            </div>
                        </form>
                    )}
                </>
            )}
        </div>
    );
};

export default CarePlanForm;
