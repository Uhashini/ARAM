import React, { useState } from 'react';

const API = 'http://localhost:5001/api/healthcare';
const hdrs = () => { const u = JSON.parse(localStorage.getItem('userInfo') || '{}'); return { 'Content-Type': 'application/json', Authorization: `Bearer ${u.token || ''}` }; };

const urgencyClass = u => u === 'emergency' ? 'risk-high' : u === 'high' ? 'risk-high' : u === 'medium' ? 'risk-medium' : 'risk-low';
const statusClass = s => s === 'completed' ? 'risk-low' : s === 'pending' ? 'risk-medium' : 'risk-high';

// Must match Referral model enums exactly
const PROVIDER_TYPES = ['ngo', 'government', 'private', 'hospital', 'clinic', 'legal-aid', 'shelter', 'hotline'];
const URGENCY_LEVELS = ['low', 'medium', 'high', 'emergency'];
const REFERRAL_TYPES = ['counseling', 'legal', 'shelter', 'medical', 'financial', 'support-group', 'emergency', 'other'];
const CONSENT_METHODS = ['verbal', 'written', 'electronic'];

const emptyForm = () => ({
    patientId: '',
    referralType: 'counseling',
    urgencyLevel: 'medium',
    serviceProvider: {
        name: '',
        type: 'ngo',
        contactInfo: { phone: '', email: '' }
    },
    referralReason: '',
    notes: '',
    patientConsent: false,
    consentDate: new Date().toISOString().split('T')[0],
    consentMethod: 'verbal'
});

const ReferralForm = () => {
    const [list, setList] = useState([]);
    const [show, setShow] = useState(false);
    const [editId, setEditId] = useState(null);
    const [filterPid, setFilterPid] = useState('');
    const [msg, setMsg] = useState('');
    const [form, setForm] = useState(emptyForm());

    const flash = t => { setMsg(t); setTimeout(() => setMsg(''), 3000); };

    const load = async () => {
        try {
            const p = filterPid ? `?patientId=${filterPid}` : '';
            const r = await fetch(`${API}/referrals${p}`, { headers: hdrs() });
            const d = await r.json();
            if (r.ok) setList(d.referrals || []);
        } catch (e) { flash('Failed to load'); }
    };

    const [allPatients, setAllPatients] = useState([]);
    const loadAllPatients = async () => {
        try {
            const r = await fetch(`${API}/patients/search?q=`, { headers: hdrs() });
            const d = await r.json();
            if (r.ok) { setAllPatients(d.patients || []); flash(`Loaded ${d.patients?.length || 0} patients`); }
        } catch (e) { flash('Network error'); }
    };

    const submit = async e => {
        e.preventDefault();
        try {
            const url = editId ? `${API}/referral/${editId}` : `${API}/referral`;
            const r = await fetch(url, { method: editId ? 'PUT' : 'POST', headers: hdrs(), body: JSON.stringify(form) });
            const d = await r.json();
            if (r.ok) { flash(editId ? 'Updated!' : 'Created!'); setShow(false); setEditId(null); load(); }
            else flash(d.error?.message || 'Failed');
        } catch (e) { flash('Network error'); }
    };

    const edit = ref => {
        setEditId(ref._id);
        setForm({
            patientId: ref.patientId?.patientId || ref.patientId || '',
            referralType: ref.referralType || 'counseling',
            urgencyLevel: ref.urgencyLevel || 'medium',
            serviceProvider: {
                name: ref.serviceProvider?.name || '',
                type: ref.serviceProvider?.type || 'ngo',
                contactInfo: {
                    phone: ref.serviceProvider?.contactInfo?.phone || '',
                    email: ref.serviceProvider?.contactInfo?.email || ''
                }
            },
            referralReason: ref.referralReason || '',
            notes: ref.notes || '',
            patientConsent: ref.patientConsent || false,
            consentDate: ref.consentDate ? ref.consentDate.split('T')[0] : '',
            consentMethod: ref.consentMethod || 'verbal'
        });
        setShow(true);
    };

    const del = async id => { if (!window.confirm('Delete referral?')) return; try { const r = await fetch(`${API}/referral/${id}`, { method: 'DELETE', headers: hdrs() }); if (r.ok) { flash('Deleted!'); load(); } } catch (e) { flash('Failed'); } };

    // Service provider mapping
    const providerMap = {};
    list.forEach(r => {
        const t = r.serviceProvider?.type || 'other';
        if (!providerMap[t]) providerMap[t] = [];
        providerMap[t].push(r);
    });

    return (
        <div>
            {msg && <div className="hc-alert hc-alert-info"><span>ℹ️</span><div>{msg}</div></div>}

            <div className="hc-section">
                <h3>🤝 Referral Initiation</h3>
                <p className="hc-subtitle">Create and manage patient referrals to counselors, NGOs, shelters, legal aid, and hotlines</p>
                <div className="hc-search-bar">
                    <input className="hc-input" placeholder="Filter by Patient ID (e.g. PAT-001)..." value={filterPid} onChange={e => setFilterPid(e.target.value)} />
                    <button className="hc-btn hc-btn-primary" onClick={load}>Search</button>
                    <button className="hc-btn hc-btn-secondary" onClick={loadAllPatients}>View All Patients</button>
                    <button className="hc-btn hc-btn-success" onClick={() => { setShow(true); setEditId(null); setForm(emptyForm()); }}>+ New Referral</button>
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
                                    <td><button className="hc-btn hc-btn-primary hc-btn-sm" onClick={() => { setFilterPid(p.patientId); setAllPatients([]); }}>Select</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Referral Status Dashboard */}
            {list.length > 0 && (
                <div className="hc-section" style={{ overflow: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <h3 style={{ margin: 0 }}>Referral Status Dashboard ({list.length})</h3>
                        <button className="hc-btn hc-btn-danger hc-btn-sm" onClick={() => setList([])}>✕ Close</button>
                    </div>
                    <table className="hc-table" style={{ marginTop: 12 }}>
                        <thead><tr><th>Date</th><th>Patient</th><th>Type</th><th>Urgency</th><th>Provider</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                            {list.map(ref => (
                                <tr key={ref._id}>
                                    <td>{new Date(ref.createdAt).toLocaleDateString()}</td>
                                    <td>{ref.patientId?.patientId || '—'} {ref.patientId?.demographics ? `(${ref.patientId.demographics.firstName} ${ref.patientId.demographics.lastName})` : ''}</td>
                                    <td style={{ textTransform: 'capitalize' }}>{ref.referralType}</td>
                                    <td><span className={urgencyClass(ref.urgencyLevel)} style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 20, fontSize: 11.5, fontWeight: 700 }}>{ref.urgencyLevel?.toUpperCase()}</span></td>
                                    <td>
                                        <strong>{ref.serviceProvider?.name || '—'}</strong>
                                        <div style={{ fontSize: 11, color: '#7f8c8d', textTransform: 'capitalize' }}>{(ref.serviceProvider?.type || '').replace(/-/g, ' ')}</div>
                                    </td>
                                    <td><span className={statusClass(ref.status)} style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 20, fontSize: 11.5, fontWeight: 700 }}>{ref.status?.toUpperCase()}</span></td>
                                    <td>
                                        <button className="hc-btn hc-btn-primary hc-btn-sm" onClick={() => edit(ref)} style={{ marginRight: 6 }}>Edit</button>
                                        <button className="hc-btn hc-btn-danger hc-btn-sm" onClick={() => del(ref._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Service Provider Mapping */}
            {Object.keys(providerMap).length > 0 && (
                <div className="hc-section">
                    <h3>Service Provider Mapping</h3>
                    <div className="hc-grid" style={{ marginTop: 14 }}>
                        {Object.entries(providerMap).map(([type, refs]) => (
                            <div key={type} style={{ padding: 16, background: '#f5f7fa', borderRadius: 10 }}>
                                <span className="hc-label" style={{ textTransform: 'capitalize' }}>{type.replace(/-/g, ' ')} ({refs.length})</span>
                                {refs.map(r => (
                                    <div key={r._id} style={{ marginTop: 8, padding: '8px 12px', background: '#fff', borderRadius: 6, border: '1px solid #edf0f5', fontSize: 13 }}>
                                        <strong>{r.serviceProvider?.name}</strong>
                                        {r.serviceProvider?.contactInfo?.phone && <span style={{ color: '#7f8c8d', marginLeft: 8 }}>📞 {r.serviceProvider.contactInfo.phone}</span>}
                                        {r.serviceProvider?.contactInfo?.email && <div style={{ color: '#7f8c8d', fontSize: 12, marginTop: 2 }}>✉️ {r.serviceProvider.contactInfo.email}</div>}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* New / Edit Form */}
            {show && (
                <form onSubmit={submit}>
                    <div className="hc-section">
                        <h3>{editId ? 'Edit Referral' : 'New Referral'}</h3>
                        <div className="hc-grid" style={{ marginTop: 16 }}>
                            <div>
                                <label className="hc-label">Patient ID *</label>
                                <input className="hc-input" required placeholder="e.g. PAT-001" value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })} />
                            </div>
                            <div>
                                <label className="hc-label">Referral Type *</label>
                                <select className="hc-select" required value={form.referralType} onChange={e => setForm({ ...form, referralType: e.target.value })}>
                                    {REFERRAL_TYPES.map(t => <option key={t} value={t}>{t.replace(/-/g, ' ')}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="hc-label">Urgency Level *</label>
                                <select className="hc-select" required value={form.urgencyLevel} onChange={e => setForm({ ...form, urgencyLevel: e.target.value })}>
                                    {URGENCY_LEVELS.map(u => <option key={u} value={u}>{u.charAt(0).toUpperCase() + u.slice(1)}</option>)}
                                </select>
                            </div>
                        </div>

                        <h3 style={{ marginTop: 24 }}>Service Provider</h3>
                        <div className="hc-grid" style={{ marginTop: 12 }}>
                            <div>
                                <label className="hc-label">Provider Name *</label>
                                <input className="hc-input" required value={form.serviceProvider.name} onChange={e => setForm({ ...form, serviceProvider: { ...form.serviceProvider, name: e.target.value } })} />
                            </div>
                            <div>
                                <label className="hc-label">Provider Type *</label>
                                <select className="hc-select" required value={form.serviceProvider.type} onChange={e => setForm({ ...form, serviceProvider: { ...form.serviceProvider, type: e.target.value } })}>
                                    {PROVIDER_TYPES.map(t => <option key={t} value={t}>{t.replace(/-/g, ' ')}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="hc-label">Provider Phone *</label>
                                <input className="hc-input" type="tel" required placeholder="e.g. +1-555-123-4567" value={form.serviceProvider.contactInfo.phone} onChange={e => setForm({ ...form, serviceProvider: { ...form.serviceProvider, contactInfo: { ...form.serviceProvider.contactInfo, phone: e.target.value } } })} />
                            </div>
                            <div>
                                <label className="hc-label">Provider Email</label>
                                <input className="hc-input" type="email" value={form.serviceProvider.contactInfo.email} onChange={e => setForm({ ...form, serviceProvider: { ...form.serviceProvider, contactInfo: { ...form.serviceProvider.contactInfo, email: e.target.value } } })} />
                            </div>
                        </div>

                        <div style={{ marginTop: 16 }}>
                            <label className="hc-label">Referral Reason *</label>
                            <textarea className="hc-textarea" required placeholder="Describe the reason for this referral..." value={form.referralReason} onChange={e => setForm({ ...form, referralReason: e.target.value })} />
                        </div>
                        <div style={{ marginTop: 14 }}>
                            <label className="hc-label">Additional Notes</label>
                            <textarea className="hc-textarea" style={{ minHeight: 60 }} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                        </div>

                        <h3 style={{ marginTop: 24 }}>Patient Consent</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
                            <input type="checkbox" checked={form.patientConsent} onChange={e => setForm({ ...form, patientConsent: e.target.checked })} style={{ accentColor: '#3498db', width: 18, height: 18 }} />
                            <label style={{ fontSize: 14, color: '#34495e' }}>Patient has consented to this referral</label>
                        </div>
                        {form.patientConsent && (
                            <div className="hc-grid" style={{ marginTop: 12 }}>
                                <div>
                                    <label className="hc-label">Consent Date *</label>
                                    <input className="hc-input" type="date" required value={form.consentDate} onChange={e => setForm({ ...form, consentDate: e.target.value })} />
                                </div>
                                <div>
                                    <label className="hc-label">Consent Method *</label>
                                    <select className="hc-select" required value={form.consentMethod} onChange={e => setForm({ ...form, consentMethod: e.target.value })}>
                                        {CONSENT_METHODS.map(m => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
                                    </select>
                                </div>
                            </div>
                        )}

                        {form.urgencyLevel === 'emergency' && (
                            <div className="hc-alert hc-alert-danger" style={{ marginTop: 16 }}>
                                <span style={{ fontSize: 20 }}>🚨</span>
                                <div><strong>EMERGENCY REFERRAL</strong> — This referral has been marked as emergency priority. Ensure immediate processing and follow-up.</div>
                            </div>
                        )}

                        <div className="hc-btn-group">
                            <button type="submit" className="hc-btn hc-btn-success">{editId ? 'Update' : 'Submit'} Referral</button>
                            <button type="button" className="hc-btn hc-btn-secondary" onClick={() => { setShow(false); setEditId(null); }}>Cancel</button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ReferralForm;
