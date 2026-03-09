const mongoose = require('mongoose');

const systemReportSchema = new mongoose.Schema({
    reportId: {
        type: String,
        required: true,
        unique: true,
        default: function () {
            return 'RPT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
        }
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['analytics', 'user_activity', 'compliance', 'risk_trends'],
        required: true
    },
    format: {
        type: String,
        enum: ['PDF', 'CSV', 'JSON'],
        default: 'PDF'
    },
    generatedBy: {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: String
    },
    filters: {
        startDate: Date,
        endDate: Date,
        region: String,
        riskLevel: String
    },
    fileUrl: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['generating', 'completed', 'failed'],
        default: 'completed'
    }
}, {
    timestamps: true
});

systemReportSchema.index({ createdAt: -1 });
systemReportSchema.index({ type: 1 });

module.exports = mongoose.model('SystemReport', systemReportSchema);
