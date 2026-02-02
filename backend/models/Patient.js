const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: [true, 'Patient ID is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Patient ID cannot exceed 50 characters']
  },
  demographics: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
      validate: {
        validator: function(value) {
          const today = new Date();
          const age = today.getFullYear() - value.getFullYear();
          return age >= 0 && age <= 120;
        },
        message: 'Date of birth must result in a valid age'
      }
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
    preferredLanguage: {
      type: String,
      default: 'english',
      maxlength: [50, 'Preferred language cannot exceed 50 characters']
    }
  },
  contactInfo: {
    phone: {
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
    },
    emergencyContact: {
      name: {
        type: String,
        trim: true,
        maxlength: [100, 'Emergency contact name cannot exceed 100 characters']
      },
      relationship: {
        type: String,
        trim: true,
        maxlength: [50, 'Relationship cannot exceed 50 characters']
      },
      phone: {
        type: String,
        trim: true,
        match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
      }
    }
  },
  medicalInfo: {
    allergies: [{
      type: String,
      trim: true,
      maxlength: [100, 'Allergy description cannot exceed 100 characters']
    }],
    medications: [{
      name: {
        type: String,
        required: true,
        trim: true,
        maxlength: [100, 'Medication name cannot exceed 100 characters']
      },
      dosage: {
        type: String,
        trim: true,
        maxlength: [50, 'Dosage cannot exceed 50 characters']
      },
      frequency: {
        type: String,
        trim: true,
        maxlength: [50, 'Frequency cannot exceed 50 characters']
      }
    }],
    medicalHistory: [{
      condition: {
        type: String,
        required: true,
        trim: true,
        maxlength: [200, 'Medical condition cannot exceed 200 characters']
      },
      diagnosisDate: {
        type: Date
      },
      status: {
        type: String,
        enum: ['active', 'resolved', 'chronic', 'managed'],
        default: 'active'
      },
      notes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters']
      }
    }],
    primaryPhysician: {
      name: {
        type: String,
        trim: true,
        maxlength: [100, 'Physician name cannot exceed 100 characters']
      },
      department: {
        type: String,
        trim: true,
        maxlength: [100, 'Department cannot exceed 100 characters']
      },
      phone: {
        type: String,
        trim: true,
        match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
      }
    }
  },
  ipvHistory: {
    hasHistory: {
      type: Boolean,
      default: false
    },
    firstScreeningDate: {
      type: Date
    },
    lastScreeningDate: {
      type: Date
    },
    highestRiskLevel: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'LOW'
    },
    totalScreenings: {
      type: Number,
      default: 0,
      min: [0, 'Total screenings cannot be negative']
    },
    positiveScreenings: {
      type: Number,
      default: 0,
      min: [0, 'Positive screenings cannot be negative']
    },
    lastPositiveScreening: {
      type: Date
    },
    interventionsProvided: [{
      type: {
        type: String,
        enum: ['counseling', 'safety-planning', 'referral', 'medical-care', 'documentation'],
        required: true
      },
      date: {
        type: Date,
        required: true,
        default: Date.now
      },
      provider: {
        type: String,
        required: true,
        maxlength: [100, 'Provider name cannot exceed 100 characters']
      },
      notes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters']
      }
    }]
  },
  consentStatus: {
    screeningConsent: {
      type: Boolean,
      default: false
    },
    dataSharingConsent: {
      type: Boolean,
      default: false
    },
    followUpConsent: {
      type: Boolean,
      default: false
    },
    consentDate: {
      type: Date
    },
    consentWithdrawnDate: {
      type: Date
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastVisitDate: {
    type: Date
  },
  notes: [{
    content: {
      type: String,
      required: true,
      maxlength: [1000, 'Note content cannot exceed 1000 characters']
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: String,
      enum: ['general', 'ipv-related', 'medical', 'behavioral', 'safety'],
      default: 'general'
    },
    isConfidential: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes for performance
patientSchema.index({ patientId: 1 });
patientSchema.index({ 'demographics.lastName': 1, 'demographics.firstName': 1 });
patientSchema.index({ 'demographics.dateOfBirth': 1 });
patientSchema.index({ 'ipvHistory.hasHistory': 1 });
patientSchema.index({ 'ipvHistory.lastScreeningDate': -1 });
patientSchema.index({ 'ipvHistory.highestRiskLevel': 1 });
patientSchema.index({ isActive: 1 });
patientSchema.index({ lastVisitDate: -1 });

// Virtual for patient age
patientSchema.virtual('age').get(function() {
  if (!this.demographics.dateOfBirth) return null;
  
  const today = new Date();
  const birthDate = new Date(this.demographics.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Virtual for full name
patientSchema.virtual('fullName').get(function() {
  return `${this.demographics.firstName} ${this.demographics.lastName}`;
});

// Method to update IPV screening history
patientSchema.methods.updateIPVScreening = function(riskLevel, isPositive, providerId) {
  this.ipvHistory.hasHistory = true;
  this.ipvHistory.lastScreeningDate = new Date();
  this.ipvHistory.totalScreenings += 1;
  
  if (!this.ipvHistory.firstScreeningDate) {
    this.ipvHistory.firstScreeningDate = new Date();
  }
  
  if (isPositive) {
    this.ipvHistory.positiveScreenings += 1;
    this.ipvHistory.lastPositiveScreening = new Date();
  }
  
  // Update highest risk level if current is higher
  const riskLevels = { 'LOW': 1, 'MEDIUM': 2, 'HIGH': 3 };
  const currentHighest = riskLevels[this.ipvHistory.highestRiskLevel] || 0;
  const newRisk = riskLevels[riskLevel] || 0;
  
  if (newRisk > currentHighest) {
    this.ipvHistory.highestRiskLevel = riskLevel;
  }
  
  return this.save();
};

// Method to add intervention
patientSchema.methods.addIntervention = function(type, provider, notes) {
  this.ipvHistory.interventionsProvided.push({
    type: type,
    date: new Date(),
    provider: provider,
    notes: notes
  });
  
  return this.save();
};

// Method to add note
patientSchema.methods.addNote = function(content, authorId, category = 'general', isConfidential = false) {
  this.notes.push({
    content: content,
    author: authorId,
    category: category,
    isConfidential: isConfidential,
    createdAt: new Date()
  });
  
  return this.save();
};

// Method to check if screening is overdue
patientSchema.methods.isScreeningOverdue = function(daysSinceLastScreening = 365) {
  if (!this.ipvHistory.lastScreeningDate) return true;
  
  const daysSince = (new Date() - this.ipvHistory.lastScreeningDate) / (1000 * 60 * 60 * 24);
  return daysSince > daysSinceLastScreening;
};

// Method to get screening frequency
patientSchema.methods.getScreeningFrequency = function() {
  if (this.ipvHistory.totalScreenings === 0) return 0;
  
  const firstScreening = this.ipvHistory.firstScreeningDate;
  const lastScreening = this.ipvHistory.lastScreeningDate;
  
  if (!firstScreening || !lastScreening) return 0;
  
  const daysBetween = (lastScreening - firstScreening) / (1000 * 60 * 60 * 24);
  return daysBetween > 0 ? this.ipvHistory.totalScreenings / (daysBetween / 365) : 0;
};

// Static method to search patients
patientSchema.statics.searchPatients = function(searchTerm) {
  const regex = new RegExp(searchTerm, 'i');
  
  return this.find({
    $or: [
      { patientId: regex },
      { 'demographics.firstName': regex },
      { 'demographics.lastName': regex },
      { 'contactInfo.email': regex }
    ],
    isActive: true
  }).sort({ 'demographics.lastName': 1, 'demographics.firstName': 1 });
};

// Static method to find patients with IPV history
patientSchema.statics.findWithIPVHistory = function() {
  return this.find({ 
    'ipvHistory.hasHistory': true,
    isActive: true 
  }).sort({ 'ipvHistory.lastScreeningDate': -1 });
};

// Static method to find high-risk patients
patientSchema.statics.findHighRisk = function() {
  return this.find({ 
    'ipvHistory.highestRiskLevel': 'HIGH',
    isActive: true 
  }).sort({ 'ipvHistory.lastPositiveScreening': -1 });
};

// Static method to find patients needing screening
patientSchema.statics.findNeedingScreening = function(daysSinceLastScreening = 365) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysSinceLastScreening);
  
  return this.find({
    $or: [
      { 'ipvHistory.lastScreeningDate': { $lt: cutoffDate } },
      { 'ipvHistory.lastScreeningDate': { $exists: false } }
    ],
    isActive: true
  }).sort({ 'demographics.lastName': 1, 'demographics.firstName': 1 });
};

// Static method to get IPV statistics
patientSchema.statics.getIPVStatistics = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        totalPatients: { $sum: 1 },
        patientsWithIPVHistory: {
          $sum: { $cond: ['$ipvHistory.hasHistory', 1, 0] }
        },
        totalScreenings: { $sum: '$ipvHistory.totalScreenings' },
        totalPositiveScreenings: { $sum: '$ipvHistory.positiveScreenings' },
        highRiskPatients: {
          $sum: { $cond: [{ $eq: ['$ipvHistory.highestRiskLevel', 'HIGH'] }, 1, 0] }
        },
        mediumRiskPatients: {
          $sum: { $cond: [{ $eq: ['$ipvHistory.highestRiskLevel', 'MEDIUM'] }, 1, 0] }
        },
        lowRiskPatients: {
          $sum: { $cond: [{ $eq: ['$ipvHistory.highestRiskLevel', 'LOW'] }, 1, 0] }
        }
      }
    }
  ]);
};

module.exports = mongoose.model('Patient', patientSchema);