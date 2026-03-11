import React, { useState } from 'react';
import './HealthcareVisuals.css';

const API = 'https://aram-ira2.onrender.com/api/healthcare';
const hdrs = () => {
    const u = JSON.parse(localStorage.getItem('userInfo') || '{}');
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${u.token || ''}` };
};
const riskClass = l => l === 'HIGH' ? 'risk-high' : l === 'MEDIUM' ? 'risk-medium' : 'risk-low';

const PatientLookupForm = () => {
    const [q, setQ] = useState('');
    const [patients, setPatients] = useState([]);
    const [sel, setSel] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [msg, setMsg] = useState('');
    const [form, setForm] = useState({ patientId: '', demographics: { firstName: '', lastName: '', dateOfBirth: '', gender: '', preferredLanguage: 'english' }, contactInfo: { phone: '', email: '' } });

    const flash = t => { setMsg(t); setTimeout(() => setMsg(''), 3000); };

    const search = async () => {
        try {
            const r = await fetch(`${API}/patients/search?q=${encodeURIComponent(q)}`, { headers: hdrs() });
            const d = await r.json();
            if (r.ok) { setPatients(d.patients || []); if (!d.patients?.length) flash('No patients found.'); }
            else flash(d.error?.message || 'Search failed');
        } catch (e) { flash('Network error'); }
    };

    const loadAll = async () => {
        try {
            const r = await fetch(`${API}/patients/search?q=`, { headers: hdrs() });
            const d = await r.json();
            if (r.ok) { setPatients(d.patients || []); flash(`Loaded ${d.patients?.length || 0} patients`); }
            else flash(d.error?.message || 'Failed to load');
        } catch (e) { flash('Network error'); }
    };

    const create = async e => {
        e.preventDefault();
        try {
            const r = await fetch(`${API}/patients`, { method: 'POST', headers: hdrs(), body: JSON.stringify(form) });
            const d = await r.json();
            if (r.ok) { flash('Patient created!'); setShowCreate(false); reset(); search(); }
            else flash(d.error?.message || 'Create failed');
        } catch (e) { flash('Network error'); }
    };

    const update = async e => {
        e.preventDefault();
        try {
            const r = await fetch(`${API}/patients/${sel._id}`, { method: 'PUT', headers: hdrs(), body: JSON.stringify(form) });
            const d = await r.json();
            if (r.ok) { flash('Patient updated!'); setEditMode(false); setSel(d.patient); search(); }
            else flash(d.error?.message || 'Update failed');
        } catch (e) { flash('Network error'); }
    };

    const del = async id => {
        if (!window.confirm('Delete this patient?')) return;
        try { const r = await fetch(`${API}/patients/${id}`, { method: 'DELETE', headers: hdrs() }); if (r.ok) { flash('Patient deleted!'); setSel(null); search(); } }
        catch (e) { flash('Delete failed'); }
    };

    const pick = p => {
        setSel(p);
        setForm({ patientId: p.patientId, demographics: { ...p.demographics, dateOfBirth: p.demographics.dateOfBirth?.split('T')[0] || '' }, contactInfo: { phone: p.contactInfo?.phone || '', email: p.contactInfo?.email || '' } });
    };

    const reset = () => setForm({ patientId: '', demographics: { firstName: '', lastName: '', dateOfBirth: '', gender: '', preferredLanguage: 'english' }, contactInfo: { phone: '', email: '' } });

    return (
        <div>
            {msg && <div className="hc-alert hc-alert-info"><span>ℹ️</span><div>{msg}</div></div>}

            <div className="hc-section">
                <h3>🔍 Patient Lookup / Search</h3>
                <p className="hc-subtitle">Search for existing patient records by name, Patient ID, or email</p>
                <div className="hc-search-bar">
                    <input className="hc-input" placeholder="Search by name, Patient ID, or email..." value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} />
                    <button className="hc-btn hc-btn-primary" onClick={search}>Search</button>
                    <button className="hc-btn hc-btn-secondary" onClick={loadAll}>View All Patients</button>
                    <button className="hc-btn hc-btn-success" onClick={() => { setShowCreate(true); setSel(null); reset(); }}>+ New Patient</button>
                </div>
            </div>

            {patients.length > 0 && (
                <div className="hc-section" style={{ overflow: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <h3 style={{ margin: 0 }}>Patient Records ({patients.length})</h3>
                        <button className="hc-btn hc-btn-danger hc-btn-sm" onClick={() => setPatients([])}>✕ Close</button>
                    </div>
                    <table className="hc-table">
                        <thead><tr><th>Patient ID</th><th>Name</th><th>Date of Birth</th><th>Gender</th><th>Risk Level</th><th>Actions</th></tr></thead>
                        <tbody>
                            {patients.map(p => (
                                <tr key={p._id}>
                                    <td><strong>{p.patientId}</strong></td>
                                    <td>{p.demographics?.firstName} {p.demographics?.lastName}</td>
                                    <td>{p.demographics?.dateOfBirth ? new Date(p.demographics.dateOfBirth).toLocaleDateString() : '—'}</td>
                                    <td style={{ textTransform: 'capitalize' }}>{p.demographics?.gender || '—'}</td>
                                    <td><span className={riskClass(p.ipvHistory?.highestRiskLevel || 'LOW')}>{p.ipvHistory?.highestRiskLevel || 'LOW'}</span></td>
                                    <td>
                                        <button className="hc-btn hc-btn-primary hc-btn-sm" onClick={() => pick(p)} style={{ marginRight: 6 }}>View</button>
                                        <button className="hc-btn hc-btn-danger hc-btn-sm" onClick={() => del(p._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {sel && !editMode && (
                <div className="hc-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0 }}>Patient Details — {sel.patientId}</h3>
                        <button className="hc-btn hc-btn-danger hc-btn-sm" onClick={() => setSel(null)}>✕ Close</button>
                    </div>
                    <div className="hc-grid" style={{ marginTop: 16 }}>
                        <div><span className="hc-label">Patient ID</span><strong>{sel.patientId}</strong></div>
                        <div><span className="hc-label">Full Name</span>{sel.demographics?.firstName} {sel.demographics?.lastName}</div>
                        <div><span className="hc-label">Date of Birth</span>{sel.demographics?.dateOfBirth ? new Date(sel.demographics.dateOfBirth).toLocaleDateString() : '—'}</div>
                        <div><span className="hc-label">Gender</span><span style={{ textTransform: 'capitalize' }}>{sel.demographics?.gender || '—'}</span></div>
                        <div><span className="hc-label">Phone</span>{sel.contactInfo?.phone || '—'}</div>
                        <div><span className="hc-label">Email</span>{sel.contactInfo?.email || '—'}</div>
                        <div><span className="hc-label">Highest Risk Level</span><span className={riskClass(sel.ipvHistory?.highestRiskLevel || 'LOW')}>{sel.ipvHistory?.highestRiskLevel || 'LOW'}</span></div>
                        <div><span className="hc-label">Total Screenings</span>{sel.ipvHistory?.totalScreenings || 0}</div>
                    </div>
                    <div className="hc-btn-group">
                        <button className="hc-btn hc-btn-primary" onClick={() => setEditMode(true)}>Edit</button>
                        <button className="hc-btn hc-btn-danger" onClick={() => del(sel._id)}>Delete</button>
                        <button className="hc-btn hc-btn-secondary" onClick={() => setSel(null)}>Close</button>
                    </div>
                </div>
            )}

            {(showCreate || editMode) && (
                <div className="hc-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0 }}>{editMode ? 'Edit Patient' : 'Create New Patient'}</h3>
                        <button className="hc-btn hc-btn-danger hc-btn-sm" onClick={() => { setShowCreate(false); setEditMode(false); }}>✕ Close</button>
                    </div>
                    <form onSubmit={editMode ? update : create} style={{ marginTop: 16 }}>
                        <div className="hc-grid">
                            <div><label className="hc-label">Patient ID *</label><input className="hc-input" type="text" required value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })} disabled={editMode} /></div>
                            <div><label className="hc-label">First Name *</label><input className="hc-input" type="text" required value={form.demographics.firstName} onChange={e => setForm({ ...form, demographics: { ...form.demographics, firstName: e.target.value } })} /></div>
                            <div><label className="hc-label">Last Name *</label><input className="hc-input" type="text" required value={form.demographics.lastName} onChange={e => setForm({ ...form, demographics: { ...form.demographics, lastName: e.target.value } })} /></div>
                            <div><label className="hc-label">Date of Birth *</label><input className="hc-input" type="date" required value={form.demographics.dateOfBirth} onChange={e => setForm({ ...form, demographics: { ...form.demographics, dateOfBirth: e.target.value } })} /></div>
                            <div><label className="hc-label">Gender *</label><select className="hc-select" required value={form.demographics.gender} onChange={e => setForm({ ...form, demographics: { ...form.demographics, gender: e.target.value } })}><option value="">Select Gender</option><option value="female">Female</option><option value="male">Male</option><option value="non-binary">Non-binary</option><option value="other">Other</option></select></div>
                            <div><label className="hc-label">Phone</label><input className="hc-input" type="tel" value={form.contactInfo.phone} onChange={e => setForm({ ...form, contactInfo: { ...form.contactInfo, phone: e.target.value } })} /></div>
                            <div><label className="hc-label">Email</label><input className="hc-input" type="email" value={form.contactInfo.email} onChange={e => setForm({ ...form, contactInfo: { ...form.contactInfo, email: e.target.value } })} /></div>
                        </div>
                        <div className="hc-btn-group">
                            <button type="submit" className="hc-btn hc-btn-success">{editMode ? 'Update Patient' : 'Create Patient'}</button>
                            <button type="button" className="hc-btn hc-btn-secondary" onClick={() => { setShowCreate(false); setEditMode(false); }}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PatientLookupForm;
