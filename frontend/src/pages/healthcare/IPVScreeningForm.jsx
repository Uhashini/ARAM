import React, { useState, useEffect } from 'react';

const API = 'http://localhost:5001/api/healthcare';
const hdrs = () => { const u = JSON.parse(localStorage.getItem('userInfo') || '{}'); return { 'Content-Type': 'application/json', Authorization: `Bearer ${u.token || ''}` }; };
const riskClass = l => l === 'HIGH' ? 'risk-high' : l === 'MEDIUM' ? 'risk-medium' : 'risk-low';

const TYPES = [{ v: 'WHO', l: 'WHO IPV Screening' }, { v: 'HITS', l: 'HITS' }, { v: 'WAST', l: 'WAST' }, { v: 'PVS', l: 'PVS' }, { v: 'AAS', l: 'AAS' }, { v: 'clinical-assessment', l: 'Clinical Assessment' }];
const EMOTIONS = ['calm', 'anxious', 'depressed', 'fearful', 'angry', 'withdrawn', 'agitated'];
const INJURIES = ['bruises', 'cuts', 'burns', 'fractures', 'head-injury', 'dental-injury', 'defensive-wounds', 'other'];
const BEHAVIORS = ['fearful-demeanor', 'hypervigilance', 'depression', 'anxiety', 'substance-use', 'suicidal-ideation', 'social-isolation', 'other'];

const init = {
    patientId: '', screeningType: 'WHO', completedAt: new Date().toISOString().split('T')[0], totalScore: 0,
    responses: [{ questionId: 'q1', questionText: 'Has your partner ever hit, kicked, or physically hurt you?', response: '', score: 0 }, { questionId: 'q2', questionText: 'Do you feel unsafe in your current relationship?', response: '', score: 0 }, { questionId: 'q3', questionText: 'Has your partner ever threatened you or your children?', response: '', score: 0 }],
    clinicalObservations: { physicalInjuries: [], behavioralIndicators: [], emotionalState: '', patientDemeanor: '', additionalNotes: '' },
    riskAssessment: { aiRiskLevel: 'LOW', aiProbability: 0.3, aiConfidence: 0.5, aiExplanation: '', finalRiskLevel: 'LOW', riskFactors: [] },
    followUpRequired: false, followUpDate: ''
};

const IPVScreeningForm = () => {
    const [list, setList] = useState([]);
    const [form, setForm] = useState({ ...init });
    const [show, setShow] = useState(false);
    const [editId, setEditId] = useState(null);
    const [filterPid, setFilterPid] = useState('');
    const [msg, setMsg] = useState('');

    const flash = t => { setMsg(t); setTimeout(() => setMsg(''), 3000); };

    const load = async () => {
        try {
            const p = filterPid ? `?patientId=${filterPid}` : '';
            const r = await fetch(`${API}/screening${p}`, { headers: hdrs() });
            const d = await r.json();
            if (r.ok) setList(d.screenings || []);
        } catch (e) { flash('Failed to load'); }
    };

    const loadAll = async () => {
        try {
            const r = await fetch(`${API}/screening`, { headers: hdrs() });
            const d = await r.json();
            if (r.ok) { setList(d.screenings || []); flash(`Loaded ${d.screenings?.length || 0} screenings`); }
        } catch (e) { flash('Failed to load'); }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { load(); }, []);

    const submit = async e => {
        e.preventDefault();
        try {
            const url = editId ? `${API}/screening/${editId}` : `${API}/screening`;
            const r = await fetch(url, { method: editId ? 'PUT' : 'POST', headers: hdrs(), body: JSON.stringify(form) });
            const d = await r.json();
            if (r.ok) { flash(editId ? 'Updated!' : 'Created!'); setShow(false); setEditId(null); setForm({ ...init }); load(); }
            else flash(d.error?.message || 'Failed');
        } catch (e) { flash('Network error'); }
    };

    const edit = s => {
        setEditId(s._id);
        setForm({ patientId: s.patientId?.patientId || s.patientId || '', screeningType: s.screeningType || 'WHO', completedAt: s.completedAt ? s.completedAt.split('T')[0] : '', totalScore: s.totalScore || 0, responses: s.responses || init.responses, clinicalObservations: s.clinicalObservations || init.clinicalObservations, riskAssessment: s.riskAssessment || init.riskAssessment, followUpRequired: s.followUpRequired || false, followUpDate: s.followUpDate ? s.followUpDate.split('T')[0] : '' });
        setShow(true);
    };

    const del = async id => { if (!window.confirm('Delete?')) return; try { const r = await fetch(`${API}/screening/${id}`, { method: 'DELETE', headers: hdrs() }); if (r.ok) { flash('Deleted!'); load(); } } catch (e) { flash('Failed'); } };

    const toggleArr = (field, val) => {
        const cur = form.clinicalObservations[field] || [];
        const upd = cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val];
        setForm({ ...form, clinicalObservations: { ...form.clinicalObservations, [field]: upd } });
    };

    // Observation stats from existing screenings
    const injuryStats = {};
    const behaviorStats = {};
    const emotionStats = {};
    list.forEach(s => {
        const obs = s.clinicalObservations || {};
        (obs.physicalInjuries || []).forEach(i => { injuryStats[i] = (injuryStats[i] || 0) + 1; });
        (obs.behavioralIndicators || []).forEach(b => { behaviorStats[b] = (behaviorStats[b] || 0) + 1; });
        if (obs.emotionalState) emotionStats[obs.emotionalState] = (emotionStats[obs.emotionalState] || 0) + 1;
    });

    return (
        <div>
            {msg && <div className="hc-alert hc-alert-info"><span>ℹ️</span><div>{msg}</div></div>}

            <div className="hc-section">
                <h3>🏥 IPV Screening & Assessment</h3>
                <p className="hc-subtitle">Comprehensive screening with 8 control types — Full Insert / Update / Delete / Search / Display</p>
                <div className="hc-search-bar">
                    <input className="hc-input" placeholder="Filter by Patient ID (e.g. PAT-001)..." value={filterPid} onChange={e => setFilterPid(e.target.value)} />
                    <button className="hc-btn hc-btn-primary" onClick={load}>Search</button>
                    <button className="hc-btn hc-btn-secondary" onClick={loadAll}>View All Patients</button>
                    <button className="hc-btn hc-btn-success" onClick={() => { setShow(true); setEditId(null); setForm({ ...init }); }}>+ New Screening</button>
                </div>
            </div>

            {/* Clinical Observation Tracker */}
            {list.length > 0 && (Object.keys(injuryStats).length > 0 || Object.keys(behaviorStats).length > 0) && (
                <div className="hc-section">
                    <h3>📋 Clinical Observation Tracker</h3>
                    <div className="hc-grid" style={{ marginTop: 14 }}>
                        {Object.keys(injuryStats).length > 0 && (
                            <div>
                                <span className="hc-label">Physical Injuries Identified</span>
                                <div style={{ marginTop: 8 }}>{Object.entries(injuryStats).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
                                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', marginBottom: 4, background: '#fdedec', borderRadius: 6, fontSize: 13 }}>
                                        <span style={{ textTransform: 'capitalize' }}>{k.replace(/-/g, ' ')}</span>
                                        <span className="risk-high" style={{ padding: '2px 10px', fontSize: 11 }}>{v}</span>
                                    </div>
                                ))}</div>
                            </div>
                        )}
                        {Object.keys(behaviorStats).length > 0 && (
                            <div>
                                <span className="hc-label">Behavioral Indicators</span>
                                <div style={{ marginTop: 8 }}>{Object.entries(behaviorStats).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
                                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', marginBottom: 4, background: '#fef9e7', borderRadius: 6, fontSize: 13 }}>
                                        <span style={{ textTransform: 'capitalize' }}>{k.replace(/-/g, ' ')}</span>
                                        <span className="risk-medium" style={{ padding: '2px 10px', fontSize: 11 }}>{v}</span>
                                    </div>
                                ))}</div>
                            </div>
                        )}
                        {Object.keys(emotionStats).length > 0 && (
                            <div>
                                <span className="hc-label">Emotional State Patterns</span>
                                <div style={{ marginTop: 8 }}>{Object.entries(emotionStats).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
                                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', marginBottom: 4, background: '#eaf2fd', borderRadius: 6, fontSize: 13 }}>
                                        <span style={{ textTransform: 'capitalize' }}>{k}</span>
                                        <span className="risk-low" style={{ padding: '2px 10px', fontSize: 11, background: '#eaf2fd', color: '#2980b9', border: '1px solid #aed6f1' }}>{v}</span>
                                    </div>
                                ))}</div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Screening Results Table */}
            {list.length > 0 && (
                <div className="hc-section" style={{ overflow: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <h3 style={{ margin: 0 }}>Screening Records ({list.length})</h3>
                        <button className="hc-btn hc-btn-danger hc-btn-sm" onClick={() => setList([])}>✕ Close</button>
                    </div>
                    <table className="hc-table" style={{ marginTop: 12 }}>
                        <thead><tr><th>Date</th><th>Patient</th><th>Type</th><th>Score</th><th>Risk Level</th><th>Actions</th></tr></thead>
                        <tbody>
                            {list.map(s => (
                                <tr key={s._id}>
                                    <td>{new Date(s.completedAt).toLocaleDateString()}</td>
                                    <td>{s.patientId?.patientId || '—'} {s.patientId?.demographics ? `(${s.patientId.demographics.firstName} ${s.patientId.demographics.lastName})` : ''}</td>
                                    <td>{s.screeningType}</td>
                                    <td><strong>{s.totalScore}</strong></td>
                                    <td><span className={riskClass(s.riskAssessment?.finalRiskLevel || 'LOW')}>{s.riskAssessment?.finalRiskLevel || 'LOW'}</span></td>
                                    <td>
                                        <button className="hc-btn hc-btn-primary hc-btn-sm" onClick={() => edit(s)} style={{ marginRight: 6 }}>Edit</button>
                                        <button className="hc-btn hc-btn-danger hc-btn-sm" onClick={() => del(s._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* New / Edit Screening Form */}
            {show && (
                <form onSubmit={submit}>
                    <div className="hc-section">
                        <h3>{editId ? 'Edit Screening' : 'New IPV Screening'}</h3>
                        <div className="hc-grid" style={{ marginTop: 16 }}>
                            {/* 1. TEXT */}
                            <div><label className="hc-label">Patient ID *</label><input className="hc-input" required placeholder="e.g. PAT-001" value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })} /></div>
                            {/* 2. DATE */}
                            <div><label className="hc-label">Screening Date *</label><input className="hc-input" type="date" required value={form.completedAt} onChange={e => setForm({ ...form, completedAt: e.target.value })} /></div>
                            {/* 3. SELECT */}
                            <div><label className="hc-label">Screening Type *</label><select className="hc-select" required value={form.screeningType} onChange={e => setForm({ ...form, screeningType: e.target.value })}>{TYPES.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}</select></div>
                            {/* 7. NUMBER */}
                            <div><label className="hc-label">Total Score *</label><input className="hc-input" type="number" required min="0" max="50" value={form.totalScore} onChange={e => setForm({ ...form, totalScore: parseInt(e.target.value) || 0 })} /></div>
                        </div>
                    </div>

                    <div className="hc-section">
                        <h3>Screening Questions</h3>
                        {form.responses.map((r, i) => (
                            <div key={r.questionId} style={{ padding: 16, background: '#f5f7fa', borderRadius: 10, marginBottom: 12 }}>
                                <p style={{ fontWeight: 600, color: '#34495e', marginBottom: 10 }}>{r.questionText}</p>
                                <div className="hc-grid">
                                    <div><label className="hc-label">Response</label><input className="hc-input" value={r.response} onChange={e => { const u = [...form.responses]; u[i].response = e.target.value; setForm({ ...form, responses: u }); }} /></div>
                                    <div><label className="hc-label">Score</label><input className="hc-input" type="number" min="0" max="10" value={r.score} onChange={e => { const u = [...form.responses]; u[i].score = parseInt(e.target.value) || 0; setForm({ ...form, responses: u }); }} /></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="hc-section">
                        <h3>Clinical Observations</h3>
                        {/* 4. RADIO */}
                        <div style={{ marginBottom: 18 }}>
                            <label className="hc-label">Emotional State</label>
                            <div className="hc-option-group">
                                {EMOTIONS.map(s => (<label key={s} className={`hc-option-label ${form.clinicalObservations.emotionalState === s ? 'selected' : ''}`}><input type="radio" name="emo" checked={form.clinicalObservations.emotionalState === s} onChange={() => setForm({ ...form, clinicalObservations: { ...form.clinicalObservations, emotionalState: s } })} /><span style={{ textTransform: 'capitalize' }}>{s}</span></label>))}
                            </div>
                        </div>
                        {/* 5. CHECKBOXES */}
                        <div style={{ marginBottom: 18 }}>
                            <label className="hc-label">Physical Injuries</label>
                            <div className="hc-option-group">
                                {INJURIES.map(j => (<label key={j} className={`hc-option-label ${(form.clinicalObservations.physicalInjuries || []).includes(j) ? 'selected' : ''}`}><input type="checkbox" checked={(form.clinicalObservations.physicalInjuries || []).includes(j)} onChange={() => toggleArr('physicalInjuries', j)} /><span>{j.replace(/-/g, ' ')}</span></label>))}
                            </div>
                        </div>
                        <div style={{ marginBottom: 18 }}>
                            <label className="hc-label">Behavioral Indicators</label>
                            <div className="hc-option-group">
                                {BEHAVIORS.map(b => (<label key={b} className={`hc-option-label ${(form.clinicalObservations.behavioralIndicators || []).includes(b) ? 'selected' : ''}`}><input type="checkbox" checked={(form.clinicalObservations.behavioralIndicators || []).includes(b)} onChange={() => toggleArr('behavioralIndicators', b)} /><span>{b.replace(/-/g, ' ')}</span></label>))}
                            </div>
                        </div>
                        {/* 6. TEXTAREA */}
                        <div style={{ marginBottom: 16 }}><label className="hc-label">Patient Demeanor Notes</label><textarea className="hc-textarea" value={form.clinicalObservations.patientDemeanor} onChange={e => setForm({ ...form, clinicalObservations: { ...form.clinicalObservations, patientDemeanor: e.target.value } })} /></div>
                        <div><label className="hc-label">Additional Observations</label><textarea className="hc-textarea" value={form.clinicalObservations.additionalNotes} onChange={e => setForm({ ...form, clinicalObservations: { ...form.clinicalObservations, additionalNotes: e.target.value } })} /></div>
                    </div>

                    <div className="hc-section">
                        <h3>Risk Assessment</h3>
                        <div className="hc-grid">
                            <div><label className="hc-label">AI Risk Level</label><select className="hc-select" value={form.riskAssessment.aiRiskLevel} onChange={e => setForm({ ...form, riskAssessment: { ...form.riskAssessment, aiRiskLevel: e.target.value } })}><option value="LOW">LOW</option><option value="MEDIUM">MEDIUM</option><option value="HIGH">HIGH</option></select></div>
                            {/* 8. RANGE */}
                            <div><label className="hc-label">AI Confidence</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                                    <input type="range" min="0" max="100" step="1" style={{ flex: 1, accentColor: '#3498db' }} value={Math.round((form.riskAssessment.aiConfidence || 0) * 100)} onChange={e => setForm({ ...form, riskAssessment: { ...form.riskAssessment, aiConfidence: parseInt(e.target.value) / 100 } })} />
                                    <span style={{ fontWeight: 700, color: '#3498db', minWidth: 45 }}>{Math.round((form.riskAssessment.aiConfidence || 0) * 100)}%</span>
                                </div>
                            </div>
                            <div><label className="hc-label">Final Risk Level *</label><select className="hc-select" required value={form.riskAssessment.finalRiskLevel} onChange={e => setForm({ ...form, riskAssessment: { ...form.riskAssessment, finalRiskLevel: e.target.value } })}><option value="LOW">LOW</option><option value="MEDIUM">MEDIUM</option><option value="HIGH">HIGH</option></select></div>
                            <div><label className="hc-label">AI Probability (0-1)</label><input className="hc-input" type="number" step="0.01" min="0" max="1" value={form.riskAssessment.aiProbability} onChange={e => setForm({ ...form, riskAssessment: { ...form.riskAssessment, aiProbability: parseFloat(e.target.value) || 0 } })} /></div>
                        </div>
                        <div style={{ marginTop: 14 }}><label className="hc-label">AI Explanation</label><textarea className="hc-textarea" value={form.riskAssessment.aiExplanation || ''} onChange={e => setForm({ ...form, riskAssessment: { ...form.riskAssessment, aiExplanation: e.target.value } })} /></div>
                    </div>

                    <div className="hc-section">
                        <h3>Follow-Up</h3>
                        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 14 }}>
                            <label className="hc-label" style={{ margin: 0 }}>Follow-Up Required?</label>
                            <label className="hc-option-label" style={{ padding: '5px 12px' }}><input type="radio" name="fu" checked={form.followUpRequired === true} onChange={() => setForm({ ...form, followUpRequired: true })} /> Yes</label>
                            <label className="hc-option-label" style={{ padding: '5px 12px' }}><input type="radio" name="fu" checked={form.followUpRequired === false} onChange={() => setForm({ ...form, followUpRequired: false })} /> No</label>
                        </div>
                        {form.followUpRequired && <div style={{ maxWidth: 300 }}><label className="hc-label">Follow-Up Date</label><input className="hc-input" type="date" value={form.followUpDate} onChange={e => setForm({ ...form, followUpDate: e.target.value })} /></div>}

                        {form.riskAssessment.finalRiskLevel === 'HIGH' && (
                            <div className="hc-alert hc-alert-danger" style={{ marginTop: 16 }}>
                                <span style={{ fontSize: 20 }}>🚨</span>
                                <div><strong>HIGH RISK ALERT</strong> — Immediate intervention and safety planning recommended. This patient requires urgent follow-up.</div>
                            </div>
                        )}

                        <div className="hc-btn-group">
                            <button type="submit" className="hc-btn hc-btn-success">{editId ? 'Update' : 'Submit'} Screening</button>
                            <button type="button" className="hc-btn hc-btn-secondary" onClick={() => { setShow(false); setEditId(null); }}>Cancel</button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default IPVScreeningForm;
