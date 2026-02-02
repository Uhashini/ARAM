const mongoose = require('mongoose');

const witnessReportSchema = new mongoose.Schema({
  incidentDescription: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: false,
  },
  dateTime: {
    type: Date,
    required: false,
  },
  witnessRelationship: {
    type: String,
    required: false, // "neighbor", "friend", etc.
  },
  severityLevel: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  immediateRisk: {
    type: Boolean,
    default: false,
  },
  actionsTaken: {
    type: String,
    required: false,
  },
  optionalContact: {
    name: String,
    phone: String,
    email: String,
    preferredContact: {
      type: String,
      enum: ['phone', 'email'],
      default: 'phone',
    }
  },
  provideContact: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'action_taken', 'closed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('WitnessReport', witnessReportSchema);