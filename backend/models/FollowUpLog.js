const mongoose = require('mongoose');

const followUpLogSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: [true, 'Patient ID is required']
    },
    healthcareWorkerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Healthcare worker ID is required']
    },
    carePlanId: { type: mongoose.Schema.Types.ObjectId, ref: 'CarePlan' },
    followUpDate: { type: Date, required: [true, 'Follow-up date is required'] },
    followUpType: {
        type: String,
        required: [true, 'Follow-up type is required'],
        enum: ['in-person', 'phone', 'video', 'home-visit', 'email']
    },
    status: { type: String, enum: ['scheduled', 'completed', 'missed', 'cancelled', 'rescheduled'], default: 'scheduled' },
    outcome: { type: String, maxlength: [1000, 'Outcome cannot exceed 1000 characters'] },
    notes: { type: String, maxlength: [2000, 'Notes cannot exceed 2000 characters'] },
    nextFollowUpDate: { type: Date },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

followUpLogSchema.index({ patientId: 1, followUpDate: -1 });
followUpLogSchema.index({ healthcareWorkerId: 1 });
followUpLogSchema.index({ carePlanId: 1 });

module.exports = mongoose.model('FollowUpLog', followUpLogSchema);
