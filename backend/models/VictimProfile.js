const mongoose = require('mongoose');

const victimProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  demographics: {
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [13, 'Age must be at least 13'],
      max: [120, 'Age must be less than 120']
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: ['female', 'male', 'non-binary', 'prefer-not-to-say', 'other']
    },
    ethnicity: {
      type: String,
      enum: [
        'american-indian-alaska-native',
        'asian',
        'black-african-american',
        'hispanic-latino',
        'native-hawaiian-pacific-islander',
        'white',
        'multiracial',
        'prefer-not-to-say',
        'other'
      ]
    },
    education: {
      type: String,
      enum: [
        'less-than-high-school',
        'high-school-diploma',
        'some-college',
        'associates-degree',
        'bachelors-degree',
        'masters-degree',
        'doctoral-degree',
        'prefer-not-to-say'
      ]
    },
    employment: {
      type: String,
      enum: [
        'employed-full-time',
        'employed-part-time',
        'unemployed',
        'student',
        'retired',
        'disabled',
        'homemaker',
        'prefer-not-to-say'
      ]
    },
    hasChildren: {
      type: Boolean,
      default: false
    },
    childrenAges: [{
      type: Number,
      min: [0, 'Child age cannot be negative'],
      max: [25, 'Child age cannot exceed 25']
    }]
  },
  contactInfo: {
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
    },
    alternatePhone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    address: {
      street: {
        type: String,
        trim: true,
        maxlength: [200, 'Street address cannot exceed 200 characters']
      },
      city: {
        type: String,
        trim: true,
        maxlength: [100, 'City cannot exceed 100 characters']
      },
      state: {
        type: String,
        trim: true,
        maxlength: [50, 'State cannot exceed 50 characters']
      },
      zipCode: {
        type: String,
        trim: true,
        match: [/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code']
      }
    }
  },
  emergencyContacts: [{
    name: {
      type: String,
      required: [true, 'Emergency contact name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    relationship: {
      type: String,
      required: [true, 'Relationship is required'],
      enum: ['family', 'friend', 'coworker', 'neighbor', 'professional', 'other'],
      maxlength: [50, 'Relationship cannot exceed 50 characters']
    },
    phone: {
      type: String,
      required: [true, 'Emergency contact phone is required'],
      trim: true,
      match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
    },
    isSafe: {
      type: Boolean,
      required: true,
      default: true
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters']
    }
  }],
  currentRiskLevel: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'LOW'
  },
  riskHistory: [{
    level: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    assessmentDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    assessmentType: {
      type: String,
      enum: ['self-screening', 'clinical', 'ai-assessment'],
      required: true
    },
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters']
    }
  }],
  lastScreeningDate: {
    type: Date
  },
  safetyPlanActive: {
    type: Boolean,
    default: false
  },
  consentToContact: {
    type: Boolean,
    default: false
  },
  preferredContactMethod: {
    type: String,
    enum: ['phone', 'email', 'text', 'secure-message'],
    default: 'secure-message'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for performance
victimProfileSchema.index({ userId: 1 });
victimProfileSchema.index({ currentRiskLevel: 1 });
victimProfileSchema.index({ lastScreeningDate: -1 });
victimProfileSchema.index({ isActive: 1 });
victimProfileSchema.index({ 'demographics.age': 1 });

// Method to update risk level
victimProfileSchema.methods.updateRiskLevel = function(newLevel, score, assessmentType, notes) {
  this.currentRiskLevel = newLevel;
  this.lastScreeningDate = new Date();
  
  this.riskHistory.push({
    level: newLevel,
    score: score,
    assessmentDate: new Date(),
    assessmentType: assessmentType,
    notes: notes
  });
  
  return this.save();
};

// Method to get latest risk assessment
victimProfileSchema.methods.getLatestRiskAssessment = function() {
  if (this.riskHistory.length === 0) return null;
  
  return this.riskHistory.sort((a, b) => b.assessmentDate - a.assessmentDate)[0];
};

// Method to check if screening is overdue
victimProfileSchema.methods.isScreeningOverdue = function(daysSinceLastScreening = 90) {
  if (!this.lastScreeningDate) return true;
  
  const daysSince = (new Date() - this.lastScreeningDate) / (1000 * 60 * 60 * 24);
  return daysSince > daysSinceLastScreening;
};

// Method to get risk trend
victimProfileSchema.methods.getRiskTrend = function() {
  if (this.riskHistory.length < 2) return 'insufficient-data';
  
  const recent = this.riskHistory.slice(-3).sort((a, b) => a.assessmentDate - b.assessmentDate);
  const riskValues = { 'LOW': 1, 'MEDIUM': 2, 'HIGH': 3 };
  
  const values = recent.map(r => riskValues[r.level]);
  const isIncreasing = values.every((val, i) => i === 0 || val >= values[i - 1]);
  const isDecreasing = values.every((val, i) => i === 0 || val <= values[i - 1]);
  
  if (isIncreasing && values[0] !== values[values.length - 1]) return 'increasing';
  if (isDecreasing && values[0] !== values[values.length - 1]) return 'decreasing';
  return 'stable';
};

// Method to add emergency contact
victimProfileSchema.methods.addEmergencyContact = function(contactData) {
  this.emergencyContacts.push(contactData);
  return this.save();
};

// Method to remove emergency contact
victimProfileSchema.methods.removeEmergencyContact = function(contactId) {
  this.emergencyContacts.id(contactId).remove();
  return this.save();
};

// Static method to find high-risk profiles
victimProfileSchema.statics.findHighRisk = function() {
  return this.find({ 
    currentRiskLevel: 'HIGH',
    isActive: true 
  }).populate('userId', 'email profile.firstName profile.lastName');
};

// Static method to find profiles needing screening
victimProfileSchema.statics.findNeedingScreening = function(daysSinceLastScreening = 90) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysSinceLastScreening);
  
  return this.find({
    $or: [
      { lastScreeningDate: { $lt: cutoffDate } },
      { lastScreeningDate: { $exists: false } }
    ],
    isActive: true
  }).populate('userId', 'email profile.firstName profile.lastName');
};

// Static method to get demographics summary
victimProfileSchema.statics.getDemographicsSummary = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        totalProfiles: { $sum: 1 },
        averageAge: { $avg: '$demographics.age' },
        genderDistribution: {
          $push: '$demographics.gender'
        },
        riskLevelDistribution: {
          $push: '$currentRiskLevel'
        }
      }
    }
  ]);
};

module.exports = mongoose.model('VictimProfile', victimProfileSchema);