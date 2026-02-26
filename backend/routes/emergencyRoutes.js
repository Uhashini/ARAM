const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { authenticate } = require('../middleware/auth');
const EmergencySession = require('../models/EmergencySession');
const LocationPing = require('../models/LocationPing');
const {
    startSession, saveLocationPing, acknowledgeAlert,
    cancelSession
} = require('../services/emergencyService');

// ── Get io from app (set in server.js) ─────────────────────────────────
const getIO = (req) => req.app.get('io');

/**
 * POST /api/emergency/start
 * Protected. Creates an EmergencySession and starts background actions.
 */
router.post('/start', authenticate, async (req, res) => {
    try {
        const io = getIO(req);
        const { riskLevel = 'HIGH' } = req.body;
        const session = await startSession(req.user.userId, riskLevel, io);

        res.status(201).json({
            ok: true,
            sessionId: session._id,
            status: session.status,
            actions: session.actions
        });
    } catch (err) {
        console.error('[Emergency] start error:', err);
        res.status(500).json({ ok: false, error: err.message });
    }
});

/**
 * POST /api/emergency/:id/location
 * Protected. Accepts a GPS ping from the frontend.
 */
router.post('/:id/location', authenticate, async (req, res) => {
    try {
        const io = getIO(req);
        const { lat, lng, accuracy } = req.body;

        if (lat == null || lng == null) {
            return res.status(400).json({ ok: false, error: 'lat and lng required' });
        }

        const ping = await saveLocationPing(req.params.id, lat, lng, accuracy ?? 0, io);
        if (!ping) {
            return res.status(404).json({ ok: false, error: 'Session not found or not active' });
        }

        res.json({ ok: true, ping: { lat, lng, accuracy, timestamp: ping.timestamp } });
    } catch (err) {
        console.error('[Emergency] location error:', err);
        res.status(500).json({ ok: false, error: err.message });
    }
});

/**
 * POST /api/emergency/:id/cancel
 * Protected. PIN-verified session resolution.
 */
router.post('/:id/cancel', authenticate, async (req, res) => {
    try {
        const io = getIO(req);
        const { pin } = req.body;
        const result = await cancelSession(req.params.id, pin, bcrypt, io);

        if (!result.ok) {
            return res.status(400).json({ ok: false, error: result.reason });
        }

        res.json({ ok: true, message: 'Emergency session resolved.' });
    } catch (err) {
        console.error('[Emergency] cancel error:', err);
        res.status(500).json({ ok: false, error: err.message });
    }
});

/**
 * GET /api/emergency/ack/:token
 * Public. Trusted contact acknowledges the alert via SMS link.
 */
router.get('/ack/:token', async (req, res) => {
    try {
        const io = getIO(req);
        const result = await acknowledgeAlert(req.params.token, io);

        if (!result) {
            return res.status(404).send(`
        <html><body style="font-family:sans-serif;text-align:center;padding:60px">
          <h2>⚠️ Link expired or already acknowledged.</h2>
        </body></html>
      `);
        }

        res.send(`
      <html><body style="font-family:sans-serif;text-align:center;padding:60px;background:#f0fdf4">
        <h2 style="color:#166534">✅ Acknowledgement Received</h2>
        <p>Thank you, <strong>${result.contact.name}</strong>. The ARAM system has been notified that you are responding.</p>
        <p>Please contact the person in need immediately and, if required, call <strong>100</strong>.</p>
      </body></html>
    `);
    } catch (err) {
        console.error('[Emergency] ack error:', err);
        res.status(500).send('An error occurred.');
    }
});

/**
 * GET /api/emergency/:id
 * Protected. Returns the current session state (for reconnects).
 */
router.get('/:id', authenticate, async (req, res) => {
    try {
        const session = await EmergencySession.findById(req.params.id);
        if (!session) return res.status(404).json({ ok: false, error: 'Session not found' });

        const pings = await LocationPing.find({ sessionId: req.params.id })
            .sort({ timestamp: -1 })
            .limit(50);

        res.json({ ok: true, session, pings });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

module.exports = router;
