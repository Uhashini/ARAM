/**
 * TrustedContacts.jsx
 * 
 * A self-contained card for adding / editing / removing trusted emergency contacts.
 * Data is persisted to MongoDB via PUT /api/victim/emergency-contacts.
 * These contacts are automatically alerted when the user triggers SOS.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Users, Plus, Trash2, Pencil, CheckCircle2, AlertCircle, Shield, Phone, X, Save } from 'lucide-react';
import './TrustedContacts.css';

const API = 'http://127.0.0.1:5001';

const RELATIONSHIPS = [
    { value: 'family', label: '👨‍👩‍👧 Family' },
    { value: 'friend', label: '👫 Friend' },
    { value: 'coworker', label: '💼 Coworker' },
    { value: 'neighbor', label: '🏠 Neighbor' },
    { value: 'professional', label: '⚕️ Professional' },
    { value: 'other', label: '👤 Other' },
];

const BLANK_CONTACT = { name: '', phone: '', relationship: 'family', isSafe: true, notes: '' };

const getToken = () => {
    try { return JSON.parse(localStorage.getItem('userInfo') || '{}').token || null; }
    catch { return null; }
};

const authHeaders = () => ({
    'Content-Type': 'application/json',
    ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
});

/* ─── Inline contact editor ─────────────────────────────────────────── */
const ContactEditor = ({ contact, onSave, onCancel }) => {
    const [form, setForm] = useState({ ...BLANK_CONTACT, ...contact });
    const [errors, setErrors] = useState({});

    const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Name is required';
        if (!form.phone.trim()) e.phone = 'Phone number is required';
        else if (!/^\+?[\d\s\-()]{7,15}$/.test(form.phone.trim())) e.phone = 'Enter a valid phone number';
        if (!form.relationship) e.relationship = 'Select a relationship';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = () => { if (validate()) onSave(form); };

    return (
        <div className="tc-editor">
            <div className="tc-editor-row">
                <div className="tc-field">
                    <label>Full Name *</label>
                    <input
                        value={form.name}
                        onChange={e => set('name', e.target.value)}
                        placeholder="e.g. Priya Sharma"
                        className={errors.name ? 'error' : ''}
                    />
                    {errors.name && <span className="tc-error">{errors.name}</span>}
                </div>
                <div className="tc-field">
                    <label>Phone Number *</label>
                    <input
                        value={form.phone}
                        onChange={e => set('phone', e.target.value)}
                        placeholder="+91 98765 43210"
                        type="tel"
                        className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="tc-error">{errors.phone}</span>}
                </div>
            </div>

            <div className="tc-editor-row">
                <div className="tc-field">
                    <label>Relationship *</label>
                    <select value={form.relationship} onChange={e => set('relationship', e.target.value)} className={errors.relationship ? 'error' : ''}>
                        {RELATIONSHIPS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                    {errors.relationship && <span className="tc-error">{errors.relationship}</span>}
                </div>
                <div className="tc-field">
                    <label>Notes (optional)</label>
                    <input value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="e.g. Call if not responding" />
                </div>
            </div>

            <div className="tc-safe-toggle">
                <label className="tc-toggle-label">
                    <input type="checkbox" checked={form.isSafe} onChange={e => set('isSafe', e.target.checked)} />
                    <span>This person is safe to contact (uncheck if they may be colluding with the abuser)</span>
                </label>
            </div>

            <div className="tc-editor-actions">
                <button className="tc-btn-save" onClick={handleSave}><Save size={14} /> Save Contact</button>
                <button className="tc-btn-cancel" onClick={onCancel}><X size={14} /> Cancel</button>
            </div>
        </div>
    );
};

/* ─── Main component ─────────────────────────────────────────────────── */
const TrustedContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null); // { type: 'ok'|'err', msg }
    const [editingIdx, setEditingIdx] = useState(null); // null = not editing, -1 = new, N = editing index
    const [deletingIdx, setDeletingIdx] = useState(null);

    const showToast = (type, msg) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3500);
    };

    /* Load contacts */
    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/victim/emergency-contacts`, { headers: authHeaders() });
            if (!res.ok) throw new Error('Failed to load');
            const data = await res.json();
            setContacts(data.contacts || []);
        } catch {
            showToast('err', 'Could not load contacts. Make sure you are logged in.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    /* Save full list to backend */
    const persist = async (newList) => {
        setSaving(true);
        try {
            const res = await fetch(`${API}/api/victim/emergency-contacts`, {
                method: 'PUT',
                headers: authHeaders(),
                body: JSON.stringify({ contacts: newList })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Save failed');
            setContacts(data.contacts);
            showToast('ok', 'Contacts saved successfully ✓');
        } catch (err) {
            showToast('err', err.message || 'Failed to save contacts');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveContact = (form) => {
        let updated;
        if (editingIdx === -1) {
            updated = [...contacts, form];
        } else {
            updated = contacts.map((c, i) => i === editingIdx ? form : c);
        }
        setEditingIdx(null);
        persist(updated);
    };

    const handleDelete = (idx) => {
        const updated = contacts.filter((_, i) => i !== idx);
        setDeletingIdx(null);
        persist(updated);
    };

    const relLabel = (val) => RELATIONSHIPS.find(r => r.value === val)?.label || val;

    return (
        <div className="tc-card">
            {/* Header */}
            <div className="tc-header">
                <div className="tc-header-left">
                    <div className="tc-icon"><Shield size={18} color="#a78bfa" /></div>
                    <div>
                        <h3 className="tc-title">Trusted Contacts</h3>
                        <p className="tc-subtitle">Alerted automatically when you trigger 🚨 SOS</p>
                    </div>
                </div>
                {editingIdx === null && (
                    <button className="tc-btn-add" onClick={() => setEditingIdx(-1)} disabled={saving}>
                        <Plus size={15} /> Add Contact
                    </button>
                )}
            </div>

            {/* Toast */}
            {toast && (
                <div className={`tc-toast tc-toast--${toast.type}`}>
                    {toast.type === 'ok' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                    {toast.msg}
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="tc-loading">
                    <div className="tc-spinner" />
                    <span>Loading contacts…</span>
                </div>
            )}

            {/* New contact editor (shown at top) */}
            {!loading && editingIdx === -1 && (
                <ContactEditor
                    contact={BLANK_CONTACT}
                    onSave={handleSaveContact}
                    onCancel={() => setEditingIdx(null)}
                />
            )}

            {/* Empty state */}
            {!loading && contacts.length === 0 && editingIdx !== -1 && (
                <div className="tc-empty">
                    <Users size={32} color="#6b7280" />
                    <p>No trusted contacts yet.</p>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                        Add at least one person who should be alerted if you trigger an SOS.
                    </p>
                </div>
            )}

            {/* Contact list */}
            {!loading && contacts.length > 0 && (
                <div className="tc-list">
                    {contacts.map((c, i) => (
                        <div key={i} className={`tc-item ${!c.isSafe ? 'tc-item--unsafe' : ''}`}>
                            {editingIdx === i ? (
                                <ContactEditor
                                    contact={c}
                                    onSave={handleSaveContact}
                                    onCancel={() => setEditingIdx(null)}
                                />
                            ) : (
                                <>
                                    <div className="tc-item-avatar">
                                        {c.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="tc-item-info">
                                        <div className="tc-item-name">
                                            {c.name}
                                            {!c.isSafe && <span className="tc-unsafe-badge">⚠ excluded from SOS</span>}
                                        </div>
                                        <div className="tc-item-meta">
                                            <span className="tc-item-rel">{relLabel(c.relationship)}</span>
                                            <span className="tc-item-phone"><Phone size={11} /> {c.phone}</span>
                                        </div>
                                        {c.notes && <div className="tc-item-notes">{c.notes}</div>}
                                    </div>
                                    <div className="tc-item-actions">
                                        <button
                                            className="tc-icon-btn tc-icon-btn--edit"
                                            onClick={() => setEditingIdx(i)}
                                            title="Edit"
                                            disabled={saving || editingIdx !== null}
                                        ><Pencil size={14} /></button>

                                        {deletingIdx === i ? (
                                            <div className="tc-confirm-delete">
                                                <span>Remove?</span>
                                                <button className="tc-btn-confirm-yes" onClick={() => handleDelete(i)}>Yes</button>
                                                <button className="tc-btn-confirm-no" onClick={() => setDeletingIdx(null)}>No</button>
                                            </div>
                                        ) : (
                                            <button
                                                className="tc-icon-btn tc-icon-btn--del"
                                                onClick={() => setDeletingIdx(i)}
                                                title="Delete"
                                                disabled={saving || editingIdx !== null}
                                            ><Trash2 size={14} /></button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Footer hint */}
            {!loading && contacts.length > 0 && editingIdx === null && (
                <p className="tc-footer-hint">
                    {saving ? '⏳ Saving…' : `${contacts.filter(c => c.isSafe !== false).length} contact(s) will receive an SMS when SOS is triggered.`}
                </p>
            )}
        </div>
    );
};

export default TrustedContacts;
