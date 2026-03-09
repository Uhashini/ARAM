/**
 * EmergencyOverlay — Full real-time emergency UI
 * 
 * Driven by useEmergencySession hook:
 *   - Live action statuses streamed from Socket.io
 *   - Leaflet mini-map with live GPS pings
 *   - Trusted contact acknowledgement list
 *   - PIN-protected cancel dialog
 *   - Safe Screen disguise mode
 *
 * Rendered via ReactDOM.createPortal → directly on document.body
 */

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import { Shield, Eye, Phone, Heart, Siren, Copy, CheckCircle2, Lock, MapPin, X, RefreshCw } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './EmergencyOverlay.css';
import useEmergencySession from '../hooks/useEmergencySession';

// Fix Leaflet default icon (webpack issue)
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

/* ─── Helpers ──────────────────────────────────────────────────────── */
const ACTION_META = {
    LOCATION: { emoji: '📍', label: 'Sharing live location' },
    SMS: { emoji: '📨', label: 'Sending panic SMS' },
    EVIDENCE: { emoji: '🔒', label: 'Backing up evidence' },
    RESPONDER: { emoji: '🚨', label: 'Alerting responders' },
};

const STATE_COLOR = {
    queued: '#4b5563',
    running: '#fbbf24',
    success: '#34d399',
    failed: '#ef4444',
    retrying: '#fb923c',
};

const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
};

/* ─── Map auto-pan to latest ping ───────────────────────────────────── */
const MapPanner = ({ center }) => {
    const map = useMap();
    useEffect(() => { if (center) map.setView(center, 15); }, [center, map]);
    return null;
};

/* ─── Copy-number card ───────────────────────────────────────────────── */
const NumberCard = ({ number, label, color, icon: Icon }) => {
    const [copied, setCopied] = useState(false);
    return (
        <div className="call-btn">
            <div className="call-btn-icon" style={{ background: `${color}25`, color }}><Icon size={16} /></div>
            <div style={{ fontWeight: 800, fontSize: '1rem' }}>{number}</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>{label}</div>
            <button
                onClick={() => { navigator.clipboard.writeText(number).catch(() => { }); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                style={{ background: copied ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.08)', border: 'none', color: copied ? '#34d399' : 'rgba(255,255,255,0.5)', borderRadius: 6, padding: '3px 7px', fontSize: '0.68rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}
            >
                {copied ? <><CheckCircle2 size={10} /> Copied!</> : <><Copy size={10} /> Copy</>}
            </button>
        </div>
    );
};

/* ─── PIN Cancel Dialog ─────────────────────────────────────────────── */
const PinCancelDialog = ({ onConfirm, onBack, loading, error }) => {
    const [pin, setPin] = useState('');
    return (
        <div className="pin-dialog-backdrop">
            <div className="pin-dialog">
                <Lock size={28} color="#ef4444" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ margin: '0 0 6px', textAlign: 'center' }}>Confirm You're Safe</h3>
                <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', textAlign: 'center', marginBottom: 16 }}>
                    Enter your Safety PIN to cancel the emergency session.
                </p>
                <input
                    className="pin-input"
                    type="password"
                    maxLength={6}
                    placeholder="Safety PIN"
                    value={pin}
                    onChange={e => setPin(e.target.value)}
                    autoFocus
                />
                {error && <p style={{ color: '#f87171', fontSize: '0.78rem', textAlign: 'center', marginTop: 6 }}>{error}</p>}
                <button className="btn-cancel-emergency" style={{ marginTop: 14 }} onClick={() => onConfirm(pin)} disabled={loading}>
                    {loading ? 'Verifying…' : 'Confirm — I am safe'}
                </button>
                <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', cursor: 'pointer', marginTop: 8 }}>
                    ← Not yet — go back
                </button>
            </div>
        </div>
    );
};

/* ─── Safe Screen Decoy ─────────────────────────────────────────────── */
const SafeScreen = ({ onRestore }) => {
    useEffect(() => {
        // Triple-Esc to restore
        let count = 0;
        let timer;
        const handler = (e) => {
            if (e.key === 'Escape') {
                count++;
                clearTimeout(timer);
                timer = setTimeout(() => { count = 0; }, 800);
                if (count >= 3) { count = 0; onRestore(); }
            }
        };
        window.addEventListener('keydown', handler);
        return () => { window.removeEventListener('keydown', handler); clearTimeout(timer); };
    }, [onRestore]);

    return ReactDOM.createPortal(
        <div className="disguise-screen">
            <div className="disguise-weather">
                <div style={{ fontSize: '3rem' }}>🌤️</div>
                <h2 style={{ fontWeight: 300, fontSize: '1.8rem', margin: '8px 0 4px' }}>Mumbai, IN</h2>
                <p style={{ fontSize: '2.6rem', margin: '4px 0', fontWeight: 200 }}>29°C</p>
                <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Partly Cloudy · Feels like 31°C</p>
                <p style={{ marginTop: 32, fontSize: '0.7rem', color: '#555' }}>Press Esc × 3 to return</p>
            </div>
        </div>,
        document.body
    );
};

/* ─── Main Overlay ─────────────────────────────────────────────────── */
const EmergencyOverlay = ({ onSessionEnd }) => {
    const {
        sessionId, status, actions, contacts,
        locationPings, lastLocation, error,
        triggerSOS, cancelSOS, enterSafeScreen, exitSafeScreen
    } = useEmergencySession();

    const [showPinDialog, setShowPinDialog] = useState(false);
    const [pinError, setPinError] = useState('');
    const [pinLoading, setPinLoading] = useState(false);
    const [ticks, setTicks] = useState(0); // force re-render for "Xs ago"
    const [mapCenter, setMapCenter] = useState(null);

    // Update "Xs ago" every 5s
    useEffect(() => {
        const t = setInterval(() => setTicks(n => n + 1), 5000);
        return () => clearInterval(t);
    }, []);

    // Start SOS on mount
    useEffect(() => {
        triggerSOS();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update map center on new ping
    useEffect(() => {
        if (locationPings.length > 0) {
            setMapCenter([locationPings[0].lat, locationPings[0].lng]);
        } else if (lastLocation) {
            setMapCenter([lastLocation.lat, lastLocation.lng]);
        }
    }, [locationPings, lastLocation]);

    // Resolved → call onSessionEnd
    useEffect(() => {
        if (status === 'RESOLVED') {
            setTimeout(() => onSessionEnd?.(), 1500);
        }
    }, [status, onSessionEnd]);

    const handleCancelConfirm = async (pin) => {
        setPinLoading(true);
        setPinError('');
        const result = await cancelSOS(pin);
        setPinLoading(false);
        if (!result.ok) {
            setPinError(result.error || 'Incorrect PIN. Try again.');
        } else {
            setShowPinDialog(false);
        }
    };

    // Safe Screen mode
    if (status === 'SAFE_SCREEN') {
        return <SafeScreen onRestore={exitSafeScreen} />;
    }

    const pathCoords = locationPings.map(p => [p.lat, p.lng]);

    const overlayContent = (
        <>
            {/* Pulsing alert bar */}
            <div className="emergency-alert-bar">
                ⚠️ EMERGENCY MODE ACTIVE — Alerts running. Stay safe. Do not close this screen.
            </div>

            <div className="emergency-backdrop">
                <div className="emergency-card">

                    {/* Header */}
                    <div className="emergency-shield-icon">
                        <Shield size={30} color="#ef4444" />
                    </div>
                    <h1 className="emergency-title">You Are Not Alone</h1>
                    <p className="emergency-sub">
                        All actions are running automatically.<br />
                        {sessionId && <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>Session: {sessionId}</span>}
                    </p>

                    {error && (
                        <div style={{ background: 'rgba(254,202,202,0.12)', border: '1px solid #ef4444', borderRadius: 8, padding: '8px 12px', fontSize: '0.78rem', color: '#fca5a5', marginBottom: 12, textAlign: 'center' }}>
                            ⚠️ Offline mode — Some actions may not have reached the server.
                        </div>
                    )}

                    {/* Live Action Status */}
                    <div className="action-status-list">
                        {actions.length > 0
                            ? actions.map((action) => {
                                const meta = ACTION_META[action.type] || { emoji: '⚡', label: action.type };
                                return (
                                    <div className="action-status-item" key={action.type}>
                                        <span className={`status-dot ${action.state}`} style={{ background: STATE_COLOR[action.state] || '#4b5563' }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.85rem' }}>{meta.emoji} {meta.label}</div>
                                            {action.logs?.length > 0 && (
                                                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                                                    {action.logs[action.logs.length - 1].msg}
                                                </div>
                                            )}
                                            {action.retryCount > 0 && (
                                                <div style={{ fontSize: '0.7rem', color: '#fb923c' }}>
                                                    <RefreshCw size={10} /> Retry {action.retryCount}/3
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ textAlign: 'right', minWidth: 68 }}>
                                            <div style={{ fontSize: '0.73rem', fontWeight: 700, color: STATE_COLOR[action.state] }}>
                                                {action.state === 'queued' ? 'Queued'
                                                    : action.state === 'running' ? 'Running…'
                                                        : action.state === 'success' ? 'Done ✓'
                                                            : action.state === 'failed' ? 'Failed ✗'
                                                                : action.state === 'retrying' ? 'Retrying…'
                                                                    : action.state}
                                            </div>
                                            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>
                                                {action.lastUpdatedAt ? timeAgo(action.lastUpdatedAt) : ''}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                            : ['LOCATION', 'SMS', 'EVIDENCE', 'RESPONDER'].map(t => (
                                <div className="action-status-item" key={t}>
                                    <span className="status-dot running" style={{ background: '#fbbf24' }} />
                                    <div style={{ flex: 1, fontSize: '0.85rem' }}>{ACTION_META[t].emoji} {ACTION_META[t].label}</div>
                                    <div style={{ fontSize: '0.73rem', color: '#fbbf24' }}>Starting…</div>
                                </div>
                            ))
                        }
                    </div>

                    {/* Trusted Contact Ack Status */}
                    {contacts.length > 0 && (
                        <div className="action-status-list" style={{ marginTop: 8 }}>
                            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>TRUSTED CONTACTS</div>
                            {contacts.map((c, i) => (
                                <div className="action-status-item" key={i}>
                                    <span style={{ fontSize: '0.85rem' }}>👤</span>
                                    <div style={{ flex: 1, fontSize: '0.82rem' }}>
                                        {c.name} · {c.phone}
                                        <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>
                                            SMS: {c.smsStatus || 'pending'}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: c.ackAt ? '#34d399' : '#fbbf24' }}>
                                        {c.ackAt ? `✅ Ack ${timeAgo(c.ackAt)}` : '⏳ Waiting'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Live Location Map */}
                    {mapCenter ? (
                        <div className="location-map-container" style={{ margin: '12px 0', borderRadius: 10, overflow: 'hidden', height: 160, border: '1px solid rgba(255,255,255,0.1)' }}>
                            <MapContainer
                                center={mapCenter}
                                zoom={15}
                                style={{ height: '100%', width: '100%' }}
                                zoomControl={false}
                                attributionControl={false}
                            >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={mapCenter} />
                                {pathCoords.length > 1 && <Polyline positions={pathCoords} color="#ef4444" weight={2} />}
                                <MapPanner center={mapCenter} />
                            </MapContainer>
                        </div>
                    ) : (
                        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '14px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', margin: '12px 0' }}>
                            <MapPin size={16} style={{ marginBottom: 4 }} />
                            <div>Acquiring GPS location…</div>
                            {lastLocation && <div style={{ fontSize: '0.7rem', marginTop: 4 }}>Last: {lastLocation.lat?.toFixed(5)}, {lastLocation.lng?.toFixed(5)}</div>}
                        </div>
                    )}

                    {/* Emergency numbers */}
                    <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginBottom: 8, textAlign: 'center' }}>Emergency numbers — copy or dial</p>
                    <div className="call-buttons-row">
                        <NumberCard number="100" label="Police" color="#ef4444" icon={Phone} />
                        <NumberCard number="181" label="Women Helpline" color="#c084fc" icon={Heart} />
                        <NumberCard number="112" label="Emergency" color="#fbbf24" icon={Siren} />
                    </div>

                    {/* Survival Guide */}
                    <div className="survival-guide">
                        <h4>Stay Safe — Right Now</h4>
                        <ul>
                            <li>Move to a safer room or public area if possible.</li>
                            <li>Keep your phone charged and with you.</li>
                            <li>Stay on call with a trusted person or responder.</li>
                            <li>Use your pre-planned escape route if safe to do so.</li>
                            <li>Do not confront the perpetrator directly.</li>
                        </ul>
                    </div>

                    {/* Footer actions */}
                    <div className="emergency-footer">
                        <button className="btn-disguise" onClick={enterSafeScreen}>
                            <Eye size={15} />
                            Switch to Safe Screen (Hide App)
                        </button>

                        {showPinDialog
                            ? <PinCancelDialog
                                onConfirm={handleCancelConfirm}
                                onBack={() => { setShowPinDialog(false); setPinError(''); }}
                                loading={pinLoading}
                                error={pinError}
                            />
                            : <button className="btn-cancel-emergency" onClick={() => setShowPinDialog(true)}>
                                I am safe now — cancel emergency
                            </button>
                        }
                    </div>

                </div>
            </div>

            {status === 'RESOLVED' && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
                    <CheckCircle2 size={48} color="#34d399" />
                    <h2 style={{ color: '#fff', margin: 0 }}>Emergency Resolved</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>Your session has ended. Stay safe. 💚</p>
                </div>
            )}
        </>
    );

    return ReactDOM.createPortal(overlayContent, document.body);
};

export default EmergencyOverlay;
