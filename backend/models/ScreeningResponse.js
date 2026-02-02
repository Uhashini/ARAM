const mongoose = require('mongoose');

const screeningResponseSchema = new mongoose.Schema({
  // Reference to either victim profile or patient
  victimId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VictimProfile'
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  },
  // Healthcare worker who conducted the screening (for clinical screenings)
  healthcareWorkerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  screeningType: {
    type: String,
    required: [true, 'Screening type is required'],
    enum: ['WHO', 'HITS', 'WAST', 'PVS', 'AAS', 'clinical-assessment']
  },
  responses: [{
    questionId: {
      type: String,
      required: [true, 'Question ID is required']
    },
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      maxlength: [500, 'Question text cannot exceed 500 characters']
    },
    response: {
      type: String,
      required: [true, 'Response is required'],
      maxlength: [1000, 'Response cannot exceed 1000 characters']
    },
    score: {
      type: Number,
      required: [true, 'Score is required'],
      min: [0, 'Score cannot be negative']
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters']
    }
  }],
  totalScore: {
    type: Number,
    required: [true, 'Total score is required'],
    min: [0, 'Total score cannot be negative']
  },
  // Clinical observations (for healthcare worker screenings)
  clinicalObservations: {
    physicalInjuries: [{
      type: String,
      enum: [
        'bruises',
        'cuts',
        'burns',
        'fractures',
        'head-injury',
        'dental-injury',
        'genital-injury',
        'defensive-wounds',
        'pattern-injuries',
        'other'
      ]
    }],
    behavioralIndicators: [{
      type: String,
      enum: [
        'fearful-demeanor',
        'hypervigilance',
        'depression',
        'anxiety',
        'substance-use',
        'suicidal-ideation',
        'social-isolation',
        'frequent-appointments',
        'missed-appointments',
        'partner-accompanies',
        'other'
      ]
    }],
    emotionalState: {
      type: String,
      enum: ['calm', 'anxious', 'depressed', 'fearful', 'angry', 'withdrawn', 'agitated'],
      maxlength: [100, 'Emotional state cannot exceed 100 characters']
    },
    patientDemeanor: {
      type: String,
      maxlength: [500, 'Patient demeanor description cannot exceed 500 characters']
    },
    additionalNotes: {
      type: String,
      maxlength: [1000, 'Additional notes cannot exceed 1000 characters']
    }
  },
  riskAssessment: {
    // AI-based risk assessment
    aiRiskLevel: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH']
    },
    aiProbability: {
      type: Number,
      min: [0, 'AI probability must be between 0 and 1'],
      max: [1, 'AI probability must be between 0 and 1']
    },
    aiConfidence: {
      type: Number,
      min: [0, 'AI confidence must be between 0 and 1'],
      max: [1, 'AI confidence must be between 0 and 1']
    },
    aiExplanation: {
      type: String,
      maxlength: [1000, 'AI explanation cannot exceed 1000 characters']
    },
    aiModelVersion: {
      type: String,
      maxlength: [50, 'AI model version cannot exceed 50 characters']
    },
    
    // WHO-based risk assessment (fallback)
    whoRiskLevel: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH']
    },
    whoScore: {
      type: Number,
      min: [0, 'WHO score cannot be negative']
    },
    whoExplanation: {
      type: String,
      maxlength: [1000, 'WHO explanation cannot exceed 1000 characters']
    },
    
    // Clinical override (for healthcare workers)
    clinicalOverride: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH']
    },
    clinicalOverrideReason: {
      type: String,
      maxlength: [500, 'Clinical override reason cannot exceed 500 characters']
    },
    
    // Final risk level (considering all factors)
    finalRiskLevel: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      required: [true, 'Final risk level is required']
    },
    
    // Risk factors identified
    riskFactors: [{
      factor: {
        type: String,
        required: true,
        enum: [
          'physical-violence',
          'sexual-violence',
          'emotional-abuse',
          'financial-control',
          'isolation',
          'threats',
          'stalking',
          'weapon-access',
          'substance-abuse',
          'pregnancy',
          'children-present',
          'escalating-violence',
          'previous-separation',
          'mental-health-issues',
          'unemployment',
          'other'
        ]
      },
      severity: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: true
      },
      description: {
        type: String,
        maxlength: [200, 'Risk factor description cannot exceed 200 characters']
      }
    }]
  },
  recommendedActions: [{
    action: {
      type: String,
      required: true,
      enum: [
        'safety-planning',
        'counseling-referral',
        'legal-referral',
        'shelter-referral',
        'medical-care',
        'follow-up-screening',
        'emergency-intervention',
        'documentation',
        'support-group',
        'other'
      ]
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      required: true
    },
    description: {
      type: String,
      maxlength: [300, 'Action description cannot exceed 300 characters']
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedDate: {
      type: Date
    },
    completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: {
    type: Date
  },
  followUpCompleted: {
    type: Boolean,
    default: false
  },
  followUpNotes: {
    type: String,
    maxlength: [1000, 'Follow-up notes cannot exceed 1000 characters']
  },
  completedAt: {
    type: Date,
    required: [true, 'Completion date is required'],
    default: Date.now
  },
  isValid: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for performance
screeningResponseSchema.index({ victimId: 1, completedAt: -1 });
screeningResponseSchema.index({ patientId: 1, completedAt: -1 });
screeningResponseSchema.index({ healthcareWorkerId: 1, completedAt: -1 });
screeningResponseSchema.index({ screeningType: 1 });
screeningResponseSchema.index({ 'riskAssessment.finalRiskLevel': 1 });
screeningResponseSchema.index({ completedAt: -1 });
screeningResponseSchema.index({ followUpRequired: 1, followUpDate: 1 });

// Validation to ensure either victimId or patientId is provided
screeningResponseSchema.pre('validate', function(next) {
  if (!this.victimId && !this.patientId) {
    next(new Error('Either victimId or patientId must be provided'));
  } else if (this.victimId && this.patientId) {
    next(new Error('Cannot have both victimId and patientId'));
  } else {
    next();
  }
});

// Method to calculate risk score based on responses
screeningResponseSchema.methods.calculateRiskScore = function() {
  return this.responses.reduce((total, response) => total + response.score, 0);
};

// Method to determine if screening indicates positive IPV
screeningResponseSchema.methods.isPositiveScreening = function() {
  // Different thresholds for different screening types
  const thresholds = {
    'WHO': 2,
    'HITS': 10,
    'WAST': 3,
    'PVS': 2,
    'AAS': 3,
    'clinical-assessment': 5
  };
  
  const threshold = thresholds[this.screeningType] || 2;
  return this.totalScore >= threshold;
};

// Method to get severity level
screeningResponseSchema.methods.getSeverityLevel = function() {
  const score = this.totalScore;
  const type = this.screeningType;
  
  // Define severity ranges for different screening types
  const severityRanges = {
    'WHO': { low: [0, 1], medium: [2, 3], high: [4, Infinity] },
    'HITS': { low: [0, 9], medium: [10, 15], high: [16, Infinity] },
    'WAST': { low: [0, 2], medium: [3, 5], high: [6, Infinity] },
    'PVS': { low: [0, 1], medium: [2, 4], high: [5, Infinity] },
    'AAS': { low: [0, 2], medium: [3, 5], high: [6, Infinity] },
    'clinical-assessment': { low: [0, 4], medium: [5, 8], high: [9, Infinity] }
  };
  
  const ranges = severityRanges[type] || severityRanges['WHO'];
  
  if (score >= ranges.low[0] && score <= ranges.low[1]) return 'LOW';
  if (score >= ranges.medium[0] && score <= ranges.medium[1]) return 'MEDIUM';
  return 'HIGH';
};

// Method to add recommended action
screeningResponseSchema.methods.addRecommendedAction = function(action, priority, description) {
  this.recommendedActions.push({
    action: action,
    priority: priority,
    description: description
  });
  
  return this.save();
};

// Method to complete recommended action
screeningResponseSchema.methods.completeAction = function(actionId, completedBy) {
  const action = this.recommendedActions.id(actionId);
  if (action) {
    action.completed = true;
    action.completedDate = new Date();
    action.completedBy = completedBy;
  }
  
  return this.save();
};

// Method to schedule follow-up
screeningResponseSchema.methods.scheduleFollowUp = function(followUpDate, notes) {
  this.followUpRequired = true;
  this.followUpDate = followUpDate;
  if (notes) {
    this.followUpNotes = notes;
  }
  
  return this.save();
};

// Static method to find screenings by risk level
screeningResponseSchema.statics.findByRiskLevel = function(riskLevel) {
  return this.find({ 
    'riskAssessment.finalRiskLevel': riskLevel,
    isValid: true 
  }).sort({ completedAt: -1 });
};

// Static method to find screenings needing follow-up
screeningResponseSchema.statics.findNeedingFollowUp = function() {
  return this.find({
    followUpRequired: true,
    followUpCompleted: false,
    followUpDate: { $lte: new Date() },
    isValid: true
  }).populate('victimId patientId healthcareWorkerId');
};

// Static method to get screening statistics
screeningResponseSchema.statics.getScreeningStatistics = function(startDate, endDate) {
  const matchStage = {
    isValid: true,
    completedAt: {
      $gte: startDate || new Date(0),
      $lte: endDate || new Date()
    }
  };
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalScreenings: { $sum: 1 },
        positiveScreenings: {
          $sum: {
            $cond: [
              { $gte: ['$totalScore', 2] }, // Assuming WHO threshold
              1,
              0
            ]
          }
        },
        riskLevelDistribution: {
          $push: '$riskAssessment.finalRiskLevel'
        },
        screeningTypeDistribution: {
          $push: '$screeningType'
        },
        averageScore: { $avg: '$totalScore' }
      }
    }
  ]);
};

// Static method to find recent high-risk screenings
screeningResponseSchema.statics.findRecentHighRisk = function(days = 7) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return this.find({
    'riskAssessment.finalRiskLevel': 'HIGH',
    completedAt: { $gte: cutoffDate },
    isValid: true
  }).populate('victimId patientId healthcareWorkerId')
    .sort({ completedAt: -1 });
};

module.exports = mongoose.model('ScreeningResponse', screeningResponseSchema);