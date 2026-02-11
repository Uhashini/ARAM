const mongoose = require('mongoose');

const witnessReportSchema = new mongoose.Schema({
  // A. Report Metadata
  reportId: {
    type: String,
    unique: true,
    default: function () {
      return 'W-FIR-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
    }
  },
  reporterMode: {
    type: String,
    enum: ['witness', 'victim', 'hospital', 'ngo'],
    required: true,
  },
  privacyMode: {
    type: String,
    enum: ['identified', 'confidential', 'anonymous'],
    default: 'anonymous',
  },

  // B. Incident Details
  incidentDescription: {
    type: String,
    required: false,
  },
  abuseType: [{
    type: String,
    enum: ['physical', 'emotional', 'sexual', 'financial', 'verbal', 'dowry-related'],
  }],
  frequency: {
    type: String,
    enum: ['first-time', 'repeated', 'ongoing'],
  },
  location: {
    type: String, // Basic address
    required: false,
  },
  locationCoordinates: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  dateTime: {
    type: Date,
    required: false,
  },

  // C. Victim Details
  victim: {
    name: String,
    gender: String,
    age: Number,
    phone: String,
    address: String,
    maritalStatus: String,
    relationshipToAccused: String,
    childrenInvolved: {
      hasChildren: Boolean,
      details: String
    },
    isPregnant: {
      type: Boolean,
      default: false
    }
  },

  // D. Accused Details
  accused: {
    name: String,
    gender: String,
    ageApprox: String,
    relationshipToVictim: {
      type: String,
      enum: ['', 'husband', 'in-laws', 'partner', 'relative', 'other']
    },
    occupation: String,
    substanceAbuse: {
      type: String,
      enum: ['yes', 'no', 'unknown']
    },
    hasWeapon: {
      type: String,
      enum: ['yes', 'no', 'unknown']
    }
  },

  // E. Witness Details (Reporter)
  witness: {
    name: String,
    phone: String,
    address: String,
    relationshipToVictim: String,
    email: String
  },

  // G. Injury & Medical Info
  medical: {
    hasVisibleInjuries: { type: Boolean, default: false },
    injuryType: [String], // Bruises, Burns, etc.
    hospitalTreated: { type: Boolean, default: false },
    hospitalName: String
  },

  // H. Evidence Uploads
  evidence: [{
    fileUrl: String,
    fileType: String,
    fileHash: String,
    uploadedAt: { type: Date, default: Date.now }
  }],

  // I. Immediate Risk Assessment
  riskAssessment: {
    isVictimInImmediateDanger: Boolean,
    isAccusedNearby: Boolean,
    areChildrenAtRisk: Boolean,
    hasSuicideThreats: Boolean,
    riskScore: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'EMERGENCY'],
      default: 'LOW'
    }
  },

  // J. Consent & Legal
  consent: {
    isInformationTrue: { type: Boolean, required: true },
    understandsFalseReporting: { type: Boolean, required: true },
    consentsToPoliceContact: { type: Boolean, default: false },
    digitalSignature: String
  },

  // System Fields
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'action_taken', 'closed'],
    default: 'pending',
  },
  suggestedLegalSections: [String], // IPC 498A, etc.
  assignedPoliceStation: {
    name: String,
    address: String,
    distance: String, // in km
    coordinates: {
      lat: Number,
      lng: Number
    },
    phone: String,
    source: String // 'osm', 'fallback', 'error_fallback'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

witnessReportSchema.index({ locationCoordinates: '2dsphere' });
witnessReportSchema.index({ reportId: 1 });

module.exports = mongoose.model('WitnessReport', witnessReportSchema);