const mongoose = require('mongoose');

const locationPingSchema = new mongoose.Schema({
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmergencySession', required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    accuracy: { type: Number }, // metres
    timestamp: { type: Date, default: Date.now }
});

// TTL index — auto-delete pings older than 7 days
locationPingSchema.index({ timestamp: 1 }, { expireAfterSeconds: 604800 });
locationPingSchema.index({ sessionId: 1, timestamp: -1 });

module.exports = mongoose.model('LocationPing', locationPingSchema);
