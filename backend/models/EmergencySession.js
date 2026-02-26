const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['LOCATION', 'SMS', 'EVIDENCE', 'RESPONDER'],
        required: true
    },
    state: {
        type: String,
        enum: ['queued', 'running', 'success', 'failed', 'retrying'],
        default: 'queued'
    },
    retryCount: { type: Number, default: 0 },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
    logs: [{ msg: String, ts: { type: Date, default: Date.now } }],
    lastUpdatedAt: { type: Date, default: Date.now }
});

const contactSchema = new mongoose.Schema({
    name: String,
    phone: String,
    priority: { type: Number, default: 1 },
    notifyVia: { type: String, enum: ['sms', 'whatsapp', 'call'], default: 'sms' },
    ackToken: String,
    ackAt: Date,
    smsSent: { type: Boolean, default: false },
    smsStatus: { type: String, default: 'pending' } // pending / sent / delivered / failed
});

const emergencySessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'resolved'],
        default: 'active'
    },
    riskLevel: { type: String, default: 'UNKNOWN' },
    safetyPinHash: { type: String }, // bcrypt hash
    actions: [actionSchema],
    contacts: [contactSchema],
    lastLocation: {
        lat: Number, lng: Number,
        accuracy: Number,
        timestamp: Date
    },
    startedAt: { type: Date, default: Date.now },
    endedAt: Date,
    auditTrail: [{ event: String, ts: { type: Date, default: Date.now }, meta: mongoose.Schema.Types.Mixed }]
}, { timestamps: true });

module.exports = mongoose.model('EmergencySession', emergencySessionSchema);
