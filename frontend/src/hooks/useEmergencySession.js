/**
 * useEmergencySession
 * 
 * Manages the full lifecycle of an emergency session:
 * - Creates session via REST → receives sessionId
 * - Connects to Socket.io and joins session room
 * - Streams action state updates in real time
 * - Sends GPS pings every 8 seconds via watchPosition
 * - Exposes triggerSOS, sendLocationPing, cancelSOS
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { io as SocketIO } from 'socket.io-client';

const API = 'http://127.0.0.1:5001';
const SOCKET_URL = 'http://127.0.0.1:5001';
const PING_INTERVAL_MS = 8000;

const getToken = () => {
    try {
        const u = localStorage.getItem('userInfo');
        return u ? JSON.parse(u).token : null;
    } catch { return null; }
};

const useEmergencySession = () => {
    const [sessionId, setSessionId] = useState(null);
    const [status, setStatus] = useState('IDLE'); // IDLE | ACTIVE | SAFE_SCREEN | RESOLVED
    const [actions, setActions] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [locationPings, setLocationPings] = useState([]);
    const [lastLocation, setLastLocation] = useState(null);
    const [error, setError] = useState(null);

    const socketRef = useRef(null);
    const watchIdRef = useRef(null);
    const pingThrottleRef = useRef(0);
    const activeSessionId = useRef(null);
    const triggeredRef = useRef(false); // StrictMode guard: prevent double-trigger

    // ── Connect to socket once sessionId is set ──────────────────────────
    useEffect(() => {
        if (!sessionId) return;
        activeSessionId.current = sessionId;

        const socket = SocketIO(SOCKET_URL, {
            transports: ['websocket'],
            auth: { token: getToken() }
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            socket.emit('join:session', sessionId);
        });

        socket.on('session:update', (data) => {
            if (data.sessionId !== sessionId) return;
            setActions(data.actions || []);
            setContacts(data.contacts || []);
            if (data.lastLocation) setLastLocation(data.lastLocation);
            if (data.status === 'resolved' || data.status === 'cancelled') {
                setStatus('RESOLVED');
            }
        });

        socket.on('location:update', (data) => {
            if (data.sessionId !== sessionId) return;
            setLocationPings(prev => [
                { lat: data.lat, lng: data.lng, accuracy: data.accuracy, timestamp: data.timestamp },
                ...prev.slice(0, 49) // Keep last 50
            ]);
            setLastLocation({ lat: data.lat, lng: data.lng, accuracy: data.accuracy, timestamp: data.timestamp });
        });

        socket.on('connect_error', (err) => {
            console.warn('[EmergencySocket] connection error:', err.message);
        });

        return () => {
            socket.emit('leave:session', sessionId);
            socket.disconnect();
            socketRef.current = null;
        };
    }, [sessionId]);

    // ── Location watch: fires every PING_INTERVAL_MS ─────────────────────
    const startLocationWatch = useCallback((sid) => {
        if (!navigator.geolocation) return;

        watchIdRef.current = navigator.geolocation.watchPosition(
            ({ coords }) => {
                const now = Date.now();
                if (now - pingThrottleRef.current < PING_INTERVAL_MS) return;
                pingThrottleRef.current = now;

                const token = getToken();
                fetch(`${API}/api/emergency/${sid}/location`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: `Bearer ${token}` } : {})
                    },
                    body: JSON.stringify({
                        lat: coords.latitude,
                        lng: coords.longitude,
                        accuracy: coords.accuracy
                    })
                }).catch(() => { }); // silent — socket will reflect update
            },
            (err) => console.warn('[Location] watch error:', err.message),
            { enableHighAccuracy: true, maximumAge: 5000 }
        );
    }, []);

    const stopLocationWatch = useCallback(() => {
        if (watchIdRef.current != null) {
            navigator.geolocation?.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
    }, []);

    // ── Trigger SOS ───────────────────────────────────────────────────────
    const triggerSOS = useCallback(async (riskLevel = 'HIGH') => {
        // StrictMode guard: only one session per overlay mount
        if (triggeredRef.current) return;
        triggeredRef.current = true;

        setError(null);
        try {
            const token = getToken();
            const res = await fetch(`${API}/api/emergency/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ riskLevel })
            });
            const data = await res.json();
            if (!data.ok) throw new Error(data.error || 'Failed to start session');

            setSessionId(data.sessionId);
            setActions(data.actions || []);
            setStatus('ACTIVE');
            startLocationWatch(data.sessionId);
        } catch (err) {
            setError(err.message);
            // Still show overlay even if API is down — offline safety
            setStatus('ACTIVE');
            setActions([
                { type: 'LOCATION', state: 'running' },
                { type: 'SMS', state: 'failed' },
                { type: 'EVIDENCE', state: 'failed' },
                { type: 'RESPONDER', state: 'failed' },
            ]);
        }
    }, [startLocationWatch]);

    // ── Cancel / I'm safe ─────────────────────────────────────────────────
    const cancelSOS = useCallback(async (pin) => {
        stopLocationWatch();

        if (!sessionId) {
            setStatus('RESOLVED');
            return { ok: true };
        }

        try {
            const token = getToken();
            const res = await fetch(`${API}/api/emergency/${sessionId}/cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ pin: pin || '' })
            });
            const data = await res.json();
            if (data.ok) setStatus('RESOLVED');
            return data;
        } catch {
            setStatus('RESOLVED'); // Let user exit even if API is down
            return { ok: true };
        }
    }, [sessionId, stopLocationWatch]);

    // ── Enter safe screen mode ────────────────────────────────────────────
    const enterSafeScreen = useCallback(() => {
        setStatus('SAFE_SCREEN');
        // Location watch keeps running in background
    }, []);

    const exitSafeScreen = useCallback(() => {
        setStatus('ACTIVE');
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => stopLocationWatch();
    }, [stopLocationWatch]);

    return {
        // State
        sessionId, status, actions, contacts,
        locationPings, lastLocation, error,
        // Actions
        triggerSOS, cancelSOS, enterSafeScreen, exitSafeScreen
    };
};

export default useEmergencySession;
