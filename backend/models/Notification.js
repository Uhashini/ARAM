const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['info', 'warning', 'alert', 'system'],
        default: 'info'
    },
    category: {
        type: String,
        enum: ['risk', 'report', 'system', 'content', 'user'],
        default: 'system'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    metadata: {
        link: String,
        reportId: String,
        severity: String
    }
}, {
    timestamps: true
});

notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
