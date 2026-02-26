/**
 * emergencyService.js
 * All writes use atomic findOneAndUpdate / positional $ operator.
 * This prevents Mongoose VersionErrors when multiple async actions
 * run in parallel on the same EmergencySession document.
 */

const axios = require('axios');
const crypto = require('crypto');
const EmergencySession = require('../models/EmergencySession');
const LocationPing = require('../models/LocationPing');

/* ─── Atomic helpers ─────────────────────────────────────────────────── */

/** Update a single action's state + meta atomically. */
const setActionState = async (sessionId, actionType, state, meta = {}) => {
    return EmergencySession.findOneAndUpdate(
        { _id: sessionId, 'actions.type': actionType },
        {
            $set: {
                'actions.$.state': state,
                'actions.$.meta': meta,
                'actions.$.lastUpdatedAt': new Date()
            }
        },
        { new: true }
    );
};

/** Push a log message to a specific action's logs array atomically. */
const appendLog = async (sessionId, actionType, msg) => {
    return EmergencySession.findOneAndUpdate(
        { _id: sessionId, 'actions.type': actionType },
        {
            $push: { 'actions.$.logs': { msg, ts: new Date() } },
            $set: { 'actions.$.lastUpdatedAt': new Date() }
        }
    );
};

/** Emit session:update by re-fetching the latest state. */
const emitUpdate = async (io, sessionId) => {
    if (!io) return;
    const session = await EmergencySession.findById(sessionId).lean();
    if (!session) return;
    io.to(`session:${sessionId}`).emit('session:update', {
        sessionId: session._id.toString(),
        status: session.status,
        actions: session.actions,
        contacts: session.contacts,
        lastLocation: session.lastLocation
    });
};

/* ─── Fast2SMS India SMS ──────────────────────────────────────────────── */
const sendSMSFast2SMS = async (phone, message) => {
    const apiKey = process.env.FAST2SMS_API_KEY;
    if (!apiKey || apiKey === 'your_fast2sms_api_key_here') {
        console.warn('[Emergency] FAST2SMS_API_KEY not configured — SMS skipped');
        return { success: false, reason: 'API key not configured' };
    }

    // Fast2SMS requires exactly 10 digits — strip +91, spaces, dashes
    const cleanPhone = phone.replace(/\D/g, '').replace(/^91/, '');
    if (cleanPhone.length !== 10) {
        console.error(`[Emergency] Invalid phone for Fast2SMS: "${phone}" → "${cleanPhone}" (must be 10 digits)`);
        return { success: false, reason: `Invalid phone number: ${phone}` };
    }

    try {
        const res = await axios.post(
            'https://www.fast2sms.com/dev/bulkV2',
            {
                route: 'q',
                message: message.substring(0, 160), // SMS limit
                language: 'english',
                flash: 0,
                numbers: cleanPhone,
            },
            {
                headers: {
                    authorization: apiKey,
                    'Content-Type': 'application/json',
                },
                timeout: 8000,
            }
        );
        console.log(`[Emergency] Fast2SMS sent to ${cleanPhone}:`, JSON.stringify(res.data));
        return { success: true, data: res.data };
    } catch (err) {
        const errBody = err.response?.data;
        console.error(`[Emergency] Fast2SMS error (${err.response?.status}):`, JSON.stringify(errBody) || err.message);
        return { success: false, reason: JSON.stringify(errBody) || err.message };
    }
};

/* ─── Start Session ───────────────────────────────────────────────────── */
const startSession = async (userId, riskLevel, io) => {
    const session = await EmergencySession.create({
        userId,
        riskLevel,
        status: 'active',
        actions: [
            { type: 'LOCATION', state: 'running' },
            { type: 'SMS', state: 'queued' },
            { type: 'EVIDENCE', state: 'queued' },
            { type: 'RESPONDER', state: 'queued' }
        ],
        auditTrail: [{ event: 'SESSION_STARTED', meta: { userId, riskLevel } }]
    });

    // Try to load trusted contacts from VictimProfile
    try {
        const VictimProfile = require('../models/VictimProfile');
        const profile = await VictimProfile.findOne({ userId });
        if (profile?.emergencyContacts?.length) {
            const contacts = profile.emergencyContacts
                .filter(c => c.isSafe !== false) // skip contacts marked as not safe
                .map((c, i) => ({
                    name: c.name,
                    phone: c.phone,
                    relationship: c.relationship,
                    priority: i + 1,
                    notifyVia: 'sms',
                    ackToken: crypto.randomBytes(16).toString('hex'),
                    smsSent: false,
                    smsStatus: 'pending'
                }));
            await EmergencySession.findByIdAndUpdate(session._id, { $set: { contacts } });
            console.log(`[Emergency] Loaded ${contacts.length} trusted contacts for session ${session._id}`);
        } else {
            console.warn(`[Emergency] No emergency contacts found for user ${userId} — SMS will be skipped`);
        }
    } catch (err) {
        console.warn('[Emergency] Could not load VictimProfile contacts:', err.message);
    }

    await emitUpdate(io, session._id);

    // Fire background actions — each re-fetches its own copy, no shared state
    runSMSAction(session._id, io);
    runResponderAction(session._id, io);

    return EmergencySession.findById(session._id);
};

/* ─── SMS Action ──────────────────────────────────────────────────────── */
const runSMSAction = async (sessionId, io) => {
    const session = await EmergencySession.findById(sessionId).lean();
    if (!session || session.status !== 'active') return;

    await setActionState(sessionId, 'SMS', 'running');
    await appendLog(sessionId, 'SMS', 'Initiating SMS blast to trusted contacts');
    await emitUpdate(io, sessionId);

    let anySuccess = false;
    const contacts = session.contacts || [];

    for (const contact of contacts) {
        const appUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const ackUrl = `${appUrl}/emergency/ack/${contact.ackToken}`;
        const message = `🚨 EMERGENCY from ARAM Safety App: Someone you know needs help immediately. Acknowledge: ${ackUrl}  If urgent, call 100.`;

        const result = await sendSMSFast2SMS(contact.phone, message);
        const smsStatus = result.success ? 'sent' : 'failed';

        // Atomic update for this specific contact
        await EmergencySession.updateOne(
            { _id: sessionId, 'contacts.ackToken': contact.ackToken },
            { $set: { 'contacts.$.smsSent': result.success, 'contacts.$.smsStatus': smsStatus } }
        );
        await appendLog(sessionId, 'SMS', `SMS to ${contact.name}: ${result.success ? 'sent ✓' : result.reason}`);
        if (result.success) anySuccess = true;
        await emitUpdate(io, sessionId);
    }

    const finalState = contacts.length === 0 ? 'success' : (anySuccess ? 'success' : 'failed');
    const finalMsg = contacts.length === 0
        ? 'No trusted contacts configured in profile'
        : `Sent to ${contacts.filter(() => anySuccess).length}/${contacts.length} contacts`;

    await setActionState(sessionId, 'SMS', finalState, { summary: finalMsg });
    await appendLog(sessionId, 'SMS', finalMsg);
    await emitUpdate(io, sessionId);

    // Schedule escalation
    const delay = parseInt(process.env.EMERGENCY_ESCALATION_DELAY_MS) || 60000;
    setTimeout(() => escalate(sessionId, io), delay);
};

/* ─── Responder Action ────────────────────────────────────────────────── */
const runResponderAction = async (sessionId, io) => {
    const session = await EmergencySession.findById(sessionId).lean();
    if (!session || session.status !== 'active') return;

    await setActionState(sessionId, 'RESPONDER', 'running');
    await appendLog(sessionId, 'RESPONDER', 'Notifying internal case responders');
    await emitUpdate(io, sessionId);

    // Simulate (extend with real police/NGO API integration)
    await new Promise(r => setTimeout(r, 2000));

    await setActionState(sessionId, 'RESPONDER', 'success', { respondersNotified: 1 });
    await appendLog(sessionId, 'RESPONDER', 'Responder system notified. Awaiting acknowledgement.');
    await EmergencySession.findByIdAndUpdate(sessionId, {
        $push: { auditTrail: { event: 'RESPONDERS_NOTIFIED', ts: new Date() } }
    });
    await emitUpdate(io, sessionId);
};

/* ─── Location Ping ───────────────────────────────────────────────────── */
const saveLocationPing = async (sessionId, lat, lng, accuracy, io) => {
    const session = await EmergencySession.findById(sessionId).lean();
    if (!session || session.status !== 'active') return null;

    const ping = await LocationPing.create({ sessionId, lat, lng, accuracy });

    await EmergencySession.findByIdAndUpdate(sessionId, {
        $set: { lastLocation: { lat, lng, accuracy, timestamp: new Date() } }
    });
    await setActionState(sessionId, 'LOCATION', 'running', { lat, lng, accuracy, lastPing: new Date() });
    await appendLog(sessionId, 'LOCATION', `Ping: ${lat.toFixed(5)}, ${lng.toFixed(5)} ±${Math.round(accuracy)}m`);

    if (io) {
        io.to(`session:${sessionId}`).emit('location:update', {
            sessionId: sessionId.toString(), lat, lng, accuracy, timestamp: ping.timestamp
        });
        await emitUpdate(io, sessionId);
    }

    return ping;
};

/* ─── Escalation Ladder ────────────────────────────────────────────────── */
const escalate = async (sessionId, io) => {
    const session = await EmergencySession.findById(sessionId).lean();
    if (!session || session.status !== 'active') return;

    const unacked = (session.contacts || []).filter(c => !c.ackAt);
    if (unacked.length === 0) return;

    await appendLog(sessionId, 'RESPONDER', `Tier-2 escalation: ${unacked.length} contacts unacknowledged`);
    await EmergencySession.findByIdAndUpdate(sessionId, {
        $push: { auditTrail: { event: 'ESCALATION_TIER_2', ts: new Date(), meta: { count: unacked.length } } }
    });
    await emitUpdate(io, sessionId);

    for (const c of unacked) {
        await sendSMSFast2SMS(c.phone, `🔴 URGENT FOLLOW-UP from ARAM: No confirmation received. Please respond immediately or call 100.`);
    }
};

/* ─── Acknowledge ──────────────────────────────────────────────────────── */
const acknowledgeAlert = async (ackToken, io) => {
    const session = await EmergencySession.findOne({ 'contacts.ackToken': ackToken });
    if (!session) return null;

    const contact = session.contacts.find(c => c.ackToken === ackToken);
    if (!contact || contact.ackAt) return { session, contact };

    await EmergencySession.updateOne(
        { _id: session._id, 'contacts.ackToken': ackToken },
        {
            $set: { 'contacts.$.ackAt': new Date(), 'contacts.$.smsStatus': 'acknowledged' },
            $push: { auditTrail: { event: 'CONTACT_ACKNOWLEDGED', ts: new Date(), meta: { name: contact.name } } }
        }
    );
    await appendLog(session._id, 'SMS', `Contact ${contact.name} acknowledged ✅`);
    await emitUpdate(io, session._id);

    const updated = await EmergencySession.findById(session._id).lean();
    return { session: updated, contact };
};

/* ─── Cancel Session ───────────────────────────────────────────────────── */
const cancelSession = async (sessionId, pin, bcrypt, io) => {
    const session = await EmergencySession.findById(sessionId).lean();
    if (!session || session.status !== 'active') return { ok: false, reason: 'Session not active' };

    if (session.safetyPinHash) {
        const match = await bcrypt.compare(String(pin || ''), session.safetyPinHash);
        if (!match) return { ok: false, reason: 'Incorrect PIN' };
    }

    await EmergencySession.findByIdAndUpdate(sessionId, {
        $set: { status: 'resolved', endedAt: new Date() },
        $push: { auditTrail: { event: 'SESSION_RESOLVED', ts: new Date(), meta: { by: 'user' } } }
    });
    await setActionState(sessionId, 'LOCATION', 'success');
    await emitUpdate(io, sessionId);

    return { ok: true };
};

module.exports = {
    startSession, saveLocationPing, acknowledgeAlert,
    cancelSession, escalate, emitUpdate
};
