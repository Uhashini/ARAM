const mongoose = require('mongoose');

const victimReportSchema = new mongoose.Schema({
    // A. Basic Intake & Status
    reportId: {
        type: String,
        unique: true,
        default: function () {
            return 'V-RPT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
        }
    },
    status: {
        type: String,
        enum: ['draft', 'submitted', 'received', 'processing', 'action_taken', 'closed'],
        default: 'submitted'
    },
    submissionDate: {
        type: Date,
        default: Date.now
    },

    // B. Personal Details
    personalDetails: {
        name: { type: String, required: true }, // Can be alias
        age: Number,
        gender: String,
        phone: String,
        email: String,
        address: String, // Current safe location or home
        safeContact: {
            name: String,
            phone: String,
            relation: String,
            safeTimeToCall: String
        },
        preferredLanguage: String,
        disabilityStatus: {
            hasDisability: { type: Boolean, default: false },
            details: String
        }
    },

    // C. Abuse Details
    incidentDetails: {
        abuseTypes: [{
            type: String,
            enum: ['physical', 'emotional', 'sexual', 'financial', 'verbal', 'digital', 'stalking', 'dowry-related']
        }],
        frequency: {
            type: String,
            enum: ['one-time', 'occasional', 'regular', 'daily']
        },
        startDate: Date,
        lastIncidentDate: Date,
        description: { type: String, required: true } // "What happened?"
    },

    // D. Perpetrator Details
    perpetrator: {
        name: String,
        relationship: {
            type: String,
            enum: ['husband', 'partner', 'in-laws', 'parent', 'sibling', 'other']
        },
        livesWithVictim: Boolean,
        substanceAbuse: { type: Boolean, default: false },
        hasWeaponAccess: { type: Boolean, default: false }
    },

    // E. Medical & Injury
    medical: {
        hasInjuries: { type: Boolean, default: false },
        injuryCreate: String, // Description of injuries
        needImmediateHelp: { type: Boolean, default: false },
        isPregnant: { type: Boolean, default: false },
        hospitalVisit: {
            visited: Boolean,
            hospitalName: String,
            medicalReportUrl: String
        }
    },

    // F. Children / Dependents
    children: {
        hasChildren: { type: Boolean, default: false },
        count: Number,
        details: [{
            age: Number,
            gender: String,
            isAlsoAbused: { type: Boolean, default: false }
        }]
    },

    // G. Evidence
    evidence: [{
        fileUrl: String,
        fileType: String,
        fileHash: String, // SHA-256 for tamper proofing
        uploadedAt: { type: Date, default: Date.now }
    }],

    // H. Risk Assessment (Auto-calculated + Self-reported)
    riskAssessment: {
        score: {
            type: String,
            enum: ['LOW', 'MEDIUM', 'HIGH', 'EXTREME'],
            default: 'LOW'
        },
        indicators: {
            threatToKill: Boolean,
            strangulationIndex: Boolean,
            weaponUse: Boolean,
            escalatingViolence: Boolean,
            suicideThreats: Boolean // By perpetrator or victim
        }
    },

    // I. Routing & Interventions (System Output)
    routing: {
        destinations: [{
            type: String,
            enum: ['Police', 'Hospital', 'Counselor', 'Shelter', 'LegalAid', 'OneStopCentre']
        }],
        assignedAgencies: [{
            agencyId: String,
            name: String,
            status: { type: String, default: 'pending' }, // pending, accepted, rejected
            contact: String
        }],
        priorityLevel: { type: String, enum: ['P1', 'P2', 'P3'], default: 'P3' }
    },

    // J. User Link (Optional)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
}, {
    timestamps: true
});

// Indexes for quick lookup
victimReportSchema.index({ 'riskAssessment.score': 1 });
victimReportSchema.index({ 'personalDetails.phone': 1 });
victimReportSchema.index({ reportId: 1 });

module.exports = mongoose.model('VictimReport', victimReportSchema);
