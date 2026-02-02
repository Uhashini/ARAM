const mongoose = require('mongoose');

const riskAssessmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    score: {
        type: Number,
        required: true,
    },
    level: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH'],
        required: true,
    },
    answers: {
        type: mongoose.Schema.Types.Mixed, // Storing raw answers flexible
    },
    isReferred: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('RiskAssessment', riskAssessmentSchema);
