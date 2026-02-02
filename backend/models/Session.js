const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  refreshToken: {
    type: String,
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // MongoDB TTL index for automatic cleanup
  },
  isActive: {
    type: Boolean,
    default: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for performance
sessionSchema.index({ userId: 1, isActive: 1 });
sessionSchema.index({ token: 1 });
sessionSchema.index({ refreshToken: 1 });
sessionSchema.index({ expiresAt: 1 });

// Method to check if session is valid
sessionSchema.methods.isValid = function() {
  return this.isActive && this.expiresAt > new Date();
};

// Method to deactivate session
sessionSchema.methods.deactivate = function() {
  this.isActive = false;
  return this.save();
};

// Method to update last activity
sessionSchema.methods.updateActivity = function() {
  this.lastActivity = new Date();
  return this.save();
};

// Static method to cleanup expired sessions
sessionSchema.statics.cleanupExpired = function() {
  return this.deleteMany({
    $or: [
      { expiresAt: { $lt: new Date() } },
      { isActive: false }
    ]
  });
};

// Static method to deactivate all user sessions
sessionSchema.statics.deactivateUserSessions = function(userId) {
  return this.updateMany(
    { userId: userId },
    { $set: { isActive: false } }
  );
};

// Static method to find active session by token
sessionSchema.statics.findActiveByToken = function(token) {
  return this.findOne({
    token: token,
    isActive: true,
    expiresAt: { $gt: new Date() }
  }).populate('userId');
};

// Static method to find active session by refresh token
sessionSchema.statics.findActiveByRefreshToken = function(refreshToken) {
  return this.findOne({
    refreshToken: refreshToken,
    isActive: true,
    expiresAt: { $gt: new Date() }
  }).populate('userId');
};

module.exports = mongoose.model('Session', sessionSchema);