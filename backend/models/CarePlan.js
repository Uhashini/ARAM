const mongoose = require('mongoose');

const carePlanSchema = new mongoose.Schema({
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
    diagnosis: {
        type: String,
        required: [true, 'Diagnosis is required'],
        trim: true,
        maxlength: [500, 'Diagnosis cannot exceed 500 characters']
    },
    goals: [{
        description: { type: String, required: true, trim: true },
        targetDate: { type: Date },
        status: { type: String, enum: ['pending', 'in-progress', 'achieved', 'revised'], default: 'pending' }
    }],
    interventions: [{
        type: { type: String, required: true, enum: ['counseling', 'safety-planning', 'medical-care', 'referral', 'follow-up', 'documentation', 'other'] },
        description: { type: String, required: true, trim: true },
        frequency: { type: String, enum: ['once', 'daily', 'weekly', 'bi-weekly', 'monthly', 'as-needed'], default: 'as-needed' },
        status: { type: String, enum: ['planned', 'active', 'completed', 'cancelled'], default: 'planned' }
    }],
    followUpDate: { type: Date },
    status: { type: String, enum: ['active', 'completed', 'on-hold', 'cancelled'], default: 'active' },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    notes: { type: String, maxlength: [2000, 'Notes cannot exceed 2000 characters'] },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

carePlanSchema.index({ patientId: 1, createdAt: -1 });
carePlanSchema.index({ healthcareWorkerId: 1 });
carePlanSchema.index({ status: 1 });

module.exports = mongoose.model('CarePlan', carePlanSchema);
