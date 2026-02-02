const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  snapshotDate: {
    type: Date,
    required: [true, 'Snapshot date is required'],
    default: Date.now
  },
  timeframe: {
    type: String,
    required: [true, 'Timeframe is required'],
    enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly']
  },
  period: {
    start: {
      type: Date,
      required: [true, 'Period start date is required']
    },
    end: {
      type: Date,
      required: [true, 'Period end date is required']
    }
  },
  metrics: {
    // User and Profile Metrics
    totalUsers: {
      type: Number,
      default: 0,
      min: [0, 'Total users cannot be negative']
    },
    activeUsers: {
      type: Number,
      default: 0,
      min: [0, 'Active users cannot be negative']
    },
    newUsers: {
      type: Number,
      default: 0,
      min: [0, 'New users cannot be negative']
    },
    usersByRole: {
      witnesses: { type: Number, default: 0 },
      victims: { type: Number, default: 0 },
      healthcareWorkers: { type: Number, default: 0 },
      admins: { type: Number, default: 0 }
    },
    
    // Screening Metrics
    totalScreenings: {
      type: Number,
      default: 0,
      min: [0, 'Total screenings cannot be negative']
    },
    newScreenings: {
      type: Number,
      default: 0,
      min: [0, 'New screenings cannot be negative']
    },
    positiveScreenings: {
      type: Number,
      default: 0,
      min: [0, 'Positive screenings cannot be negative']
    },
    screeningsByType: {
      WHO: { type: Number, default: 0 },
      HITS: { type: Number, default: 0 },
      WAST: { type: Number, default: 0 },
      PVS: { type: Number, default: 0 },
      AAS: { type: Number, default: 0 },
      clinicalAssessment: { type: Number, default: 0 }
    },
    riskLevelDistribution: {
      low: { type: Number, default: 0 },
      medium: { type: Number, default: 0 },
      high: { type: Number, default: 0 }
    },
    averageRiskScore: {
      type: Number,
      default: 0,
      min: [0, 'Average risk score cannot be negative']
    },
    
    // Witness Report Metrics
    totalWitnessReports: {
      type: Number,
      default: 0,
      min: [0, 'Total witness reports cannot be negative']
    },
    newWitnessReports: {
      type: Number,
      default: 0,
      min: [0, 'New witness reports cannot be negative']
    },
    urgentReports: {
      type: Number,
      default: 0,
      min: [0, 'Urgent reports cannot be negative']
    },
    reportsByStatus: {
      submitted: { type: Number, default: 0 },
      reviewed: { type: Number, default: 0 },
      escalated: { type: Number, default: 0 },
      resolved: { type: Number, default: 0 }
    },
    
    // Referral Metrics
    totalReferrals: {
      type: Number,
      default: 0,
      min: [0, 'Total referrals cannot be negative']
    },
    newReferrals: {
      type: Number,
      default: 0,
      min: [0, 'New referrals cannot be negative']
    },
    completedReferrals: {
      type: Number,
      default: 0,
      min: [0, 'Completed referrals cannot be negative']
    },
    pendingReferrals: {
      type: Number,
      default: 0,
      min: [0, 'Pending referrals cannot be negative']
    },
    referralsByType: {
      counseling: { type: Number, default: 0 },
      legal: { type: Number, default: 0 },
      shelter: { type: Number, default: 0 },
      medical: { type: Number, default: 0 },
      financial: { type: Number, default: 0 },
      supportGroup: { type: Number, default: 0 },
      emergency: { type: Number, default: 0 },
      other: { type: Number, default: 0 }
    },
    averageReferralCompletionTime: {
      type: Number, // in days
      default: 0
    },
    
    // Safety Plan Metrics
    totalSafetyPlans: {
      type: Number,
      default: 0,
      min: [0, 'Total safety plans cannot be negative']
    },
    activeSafetyPlans: {
      type: Number,
      default: 0,
      min: [0, 'Active safety plans cannot be negative']
    },
    newSafetyPlans: {
      type: Number,
      default: 0,
      min: [0, 'New safety plans cannot be negative']
    },
    plansNeedingReview: {
      type: Number,
      default: 0,
      min: [0, 'Plans needing review cannot be negative']
    },
    averagePlanCompleteness: {
      type: Number, // percentage
      default: 0,
      min: [0, 'Average plan completeness cannot be negative'],
      max: [100, 'Average plan completeness cannot exceed 100']
    },
    
    // Journal Entry Metrics
    totalJournalEntries: {
      type: Number,
      default: 0,
      min: [0, 'Total journal entries cannot be negative']
    },
    newJournalEntries: {
      type: Number,
      default: 0,
      min: [0, 'New journal entries cannot be negative']
    },
    entriesWithIncidents: {
      type: Number,
      default: 0,
      min: [0, 'Entries with incidents cannot be negative']
    },
    averageMoodRating: {
      type: Number,
      default: 0,
      min: [0, 'Average mood rating cannot be negative'],
      max: [10, 'Average mood rating cannot exceed 10']
    },
    averagePainLevel: {
      type: Number,
      default: 0,
      min: [0, 'Average pain level cannot be negative'],
      max: [10, 'Average pain level cannot exceed 10']
    },
    averageSleepQuality: {
      type: Number,
      default: 0,
      min: [0, 'Average sleep quality cannot be negative'],
      max: [10, 'Average sleep quality cannot exceed 10']
    },
    
    // Department Breakdown (for healthcare settings)
    departmentBreakdown: [{
      department: {
        type: String,
        required: true,
        maxlength: [100, 'Department name cannot exceed 100 characters']
      },
      screenings: {
        type: Number,
        default: 0,
        min: [0, 'Department screenings cannot be negative']
      },
      positiveScreenings: {
        type: Number,
        default: 0,
        min: [0, 'Department positive screenings cannot be negative']
      },
      referrals: {
        type: Number,
        default: 0,
        min: [0, 'Department referrals cannot be negative']
      }
    }]
  },
  trends: {
    userTrend: {
      type: String,
      enum: ['increasing', 'decreasing', 'stable', 'insufficient-data'],
      default: 'insufficient-data'
    },
    screeningTrend: {
      type: String,
      enum: ['increasing', 'decreasing', 'stable', 'insufficient-data'],
      default: 'insufficient-data'
    },
    riskTrend: {
      type: String,
      enum: ['increasing', 'decreasing', 'stable', 'insufficient-data'],
      default: 'insufficient-data'
    },
    referralTrend: {
      type: String,
      enum: ['increasing', 'decreasing', 'stable', 'insufficient-data'],
      default: 'insufficient-data'
    },
    moodTrend: {
      type: String,
      enum: ['improving', 'declining', 'stable', 'insufficient-data'],
      default: 'insufficient-data'
    }
  },
  alerts: [{
    type: {
      type: String,
      enum: [
        'high-risk-increase',
        'screening-decrease',
        'referral-backlog',
        'system-usage-drop',
        'concerning-mood-trend',
        'safety-plan-overdue',
        'other'
      ],
      required: true
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: true
    },
    message: {
      type: String,
      required: true,
      maxlength: [500, 'Alert message cannot exceed 500 characters']
    },
    threshold: {
      type: Number
    },
    actualValue: {
      type: Number
    },
    acknowledged: {
      type: Boolean,
      default: false
    },
    acknowledgedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    acknowledgedAt: {
      type: Date
    }
  }],
  generatedBy: {
    type: String,
    enum: ['system', 'manual', 'scheduled'],
    default: 'system'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for performance
analyticsSchema.index({ snapshotDate: -1 });
analyticsSchema.index({ timeframe: 1, snapshotDate: -1 });
analyticsSchema.index({ 'period.start': 1, 'period.end': 1 });
analyticsSchema.index({ isActive: 1 });

// Method to calculate trend
analyticsSchema.methods.calculateTrend = function(currentValue, previousValue) {
  if (!previousValue || previousValue === 0) return 'insufficient-data';
  
  const percentChange = ((currentValue - previousValue) / previousValue) * 100;
  
  if (percentChange > 5) return 'increasing';
  if (percentChange < -5) return 'decreasing';
  return 'stable';
};

// Method to generate alerts
analyticsSchema.methods.generateAlerts = function() {
  const alerts = [];
  
  // High risk increase alert
  if (this.metrics.riskLevelDistribution.high > 10) {
    alerts.push({
      type: 'high-risk-increase',
      severity: 'high',
      message: `High risk cases have increased to ${this.metrics.riskLevelDistribution.high}`,
      threshold: 10,
      actualValue: this.metrics.riskLevelDistribution.high
    });
  }
  
  // Screening decrease alert
  const screeningRate = this.metrics.newScreenings / Math.max(this.metrics.newUsers, 1);
  if (screeningRate < 0.5) {
    alerts.push({
      type: 'screening-decrease',
      severity: 'medium',
      message: `Screening rate has dropped to ${Math.round(screeningRate * 100)}%`,
      threshold: 50,
      actualValue: Math.round(screeningRate * 100)
    });
  }
  
  // Referral backlog alert
  if (this.metrics.pendingReferrals > 20) {
    alerts.push({
      type: 'referral-backlog',
      severity: 'high',
      message: `Referral backlog has reached ${this.metrics.pendingReferrals} pending referrals`,
      threshold: 20,
      actualValue: this.metrics.pendingReferrals
    });
  }
  
  // Concerning mood trend alert
  if (this.metrics.averageMoodRating < 4) {
    alerts.push({
      type: 'concerning-mood-trend',
      severity: 'medium',
      message: `Average mood rating has dropped to ${this.metrics.averageMoodRating.toFixed(1)}`,
      threshold: 4,
      actualValue: this.metrics.averageMoodRating
    });
  }
  
  this.alerts = alerts;
  return alerts;
};

// Method to acknowledge alert
analyticsSchema.methods.acknowledgeAlert = function(alertId, userId) {
  const alert = this.alerts.id(alertId);
  if (alert) {
    alert.acknowledged = true;
    alert.acknowledgedBy = userId;
    alert.acknowledgedAt = new Date();
  }
  
  return this.save();
};

// Static method to get latest snapshot
analyticsSchema.statics.getLatestSnapshot = function(timeframe) {
  return this.findOne({ 
    timeframe: timeframe,
    isActive: true 
  }).sort({ snapshotDate: -1 });
};

// Static method to get trend data
analyticsSchema.statics.getTrendData = function(timeframe, periods = 12) {
  return this.find({ 
    timeframe: timeframe,
    isActive: true 
  }).sort({ snapshotDate: -1 })
    .limit(periods);
};

// Static method to generate analytics snapshot
analyticsSchema.statics.generateSnapshot = async function(timeframe, startDate, endDate) {
  const User = mongoose.model('User');
  const ScreeningResponse = mongoose.model('ScreeningResponse');
  const WitnessReport = mongoose.model('WitnessReport');
  const Referral = mongoose.model('Referral');
  const SafetyPlan = mongoose.model('SafetyPlan');
  const JournalEntry = mongoose.model('JournalEntry');
  
  // Calculate metrics
  const metrics = {
    // User metrics
    totalUsers: await User.countDocuments({ isActive: true }),
    activeUsers: await User.countDocuments({ 
      isActive: true, 
      lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }),
    newUsers: await User.countDocuments({ 
      createdAt: { $gte: startDate, $lte: endDate }
    }),
    
    // Screening metrics
    totalScreenings: await ScreeningResponse.countDocuments({ isValid: true }),
    newScreenings: await ScreeningResponse.countDocuments({ 
      completedAt: { $gte: startDate, $lte: endDate },
      isValid: true 
    }),
    
    // Witness report metrics
    totalWitnessReports: await WitnessReport.countDocuments(),
    newWitnessReports: await WitnessReport.countDocuments({ 
      createdAt: { $gte: startDate, $lte: endDate }
    }),
    
    // Referral metrics
    totalReferrals: await Referral.countDocuments({ isActive: true }),
    newReferrals: await Referral.countDocuments({ 
      createdAt: { $gte: startDate, $lte: endDate },
      isActive: true 
    }),
    
    // Safety plan metrics
    totalSafetyPlans: await SafetyPlan.countDocuments({ isActive: true }),
    newSafetyPlans: await SafetyPlan.countDocuments({ 
      createdAt: { $gte: startDate, $lte: endDate },
      isActive: true 
    }),
    
    // Journal entry metrics
    totalJournalEntries: await JournalEntry.countDocuments(),
    newJournalEntries: await JournalEntry.countDocuments({ 
      createdAt: { $gte: startDate, $lte: endDate }
    })
  };
  
  // Create and save snapshot
  const snapshot = new this({
    timeframe: timeframe,
    period: { start: startDate, end: endDate },
    metrics: metrics,
    generatedBy: 'system'
  });
  
  // Generate alerts
  snapshot.generateAlerts();
  
  return snapshot.save();
};

module.exports = mongoose.model('Analytics', analyticsSchema);