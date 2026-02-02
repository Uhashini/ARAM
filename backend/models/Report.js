const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      return 'RPT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
  },
  reportType: {
    type: String,
    required: [true, 'Report type is required'],
    enum: [
      'analytics-summary',
      'screening-report',
      'referral-report',
      'safety-plan-report',
      'compliance-report',
      'nabh-report',
      'patient-summary',
      'department-report',
      'trend-analysis',
      'custom-report'
    ]
  },
  title: {
    type: String,
    required: [true, 'Report title is required'],
    maxlength: [200, 'Report title cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Report description cannot exceed 1000 characters']
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Report generator is required']
  },
  parameters: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    filters: {
      departments: [{
        type: String,
        maxlength: [100, 'Department name cannot exceed 100 characters']
      }],
      riskLevels: [{
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH']
      }],
      userRoles: [{
        type: String,
        enum: ['witness', 'victim', 'healthcare_worker', 'admin']
      }],
      screeningTypes: [{
        type: String,
        enum: ['WHO', 'HITS', 'WAST', 'PVS', 'AAS', 'clinical-assessment']
      }],
      referralTypes: [{
        type: String,
        enum: ['counseling', 'legal', 'shelter', 'medical', 'financial', 'support-group', 'emergency', 'other']
      }],
      includeAnonymous: {
        type: Boolean,
        default: true
      },
      includeCharts: {
        type: Boolean,
        default: true
      },
      includeRawData: {
        type: Boolean,
        default: false
      }
    },
    customFilters: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  content: {
    executiveSummary: {
      type: String,
      maxlength: [2000, 'Executive summary cannot exceed 2000 characters']
    },
    keyFindings: [{
      finding: {
        type: String,
        required: true,
        maxlength: [500, 'Finding cannot exceed 500 characters']
      },
      impact: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
      },
      recommendation: {
        type: String,
        maxlength: [500, 'Recommendation cannot exceed 500 characters']
      }
    }],
    sections: [{
      title: {
        type: String,
        required: true,
        maxlength: [200, 'Section title cannot exceed 200 characters']
      },
      content: {
        type: String,
        required: true
      },
      charts: [{
        type: {
          type: String,
          enum: ['bar', 'line', 'pie', 'doughnut', 'scatter', 'area'],
          required: true
        },
        title: {
          type: String,
          required: true,
          maxlength: [200, 'Chart title cannot exceed 200 characters']
        },
        data: {
          type: mongoose.Schema.Types.Mixed,
          required: true
        },
        options: {
          type: mongoose.Schema.Types.Mixed
        }
      }],
      tables: [{
        title: {
          type: String,
          required: true,
          maxlength: [200, 'Table title cannot exceed 200 characters']
        },
        headers: [{
          type: String,
          required: true,
          maxlength: [100, 'Table header cannot exceed 100 characters']
        }],
        rows: [[{
          type: mongoose.Schema.Types.Mixed
        }]]
      }],
      order: {
        type: Number,
        required: true,
        min: [1, 'Section order must be at least 1']
      }
    }],
    recommendations: [{
      priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        required: true
      },
      category: {
        type: String,
        enum: ['process-improvement', 'training', 'resource-allocation', 'policy-change', 'technology', 'other'],
        required: true
      },
      description: {
        type: String,
        required: true,
        maxlength: [1000, 'Recommendation description cannot exceed 1000 characters']
      },
      expectedOutcome: {
        type: String,
        maxlength: [500, 'Expected outcome cannot exceed 500 characters']
      },
      timeframe: {
        type: String,
        enum: ['immediate', 'short-term', 'medium-term', 'long-term'],
        default: 'medium-term'
      },
      assignedTo: {
        type: String,
        maxlength: [100, 'Assigned to cannot exceed 100 characters']
      }
    }],
    appendices: [{
      title: {
        type: String,
        required: true,
        maxlength: [200, 'Appendix title cannot exceed 200 characters']
      },
      content: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: ['data-tables', 'methodology', 'definitions', 'references', 'other'],
        default: 'other'
      }
    }]
  },
  metadata: {
    totalRecords: {
      type: Number,
      default: 0,
      min: [0, 'Total records cannot be negative']
    },
    dataQuality: {
      completeness: {
        type: Number,
        min: [0, 'Completeness cannot be negative'],
        max: [100, 'Completeness cannot exceed 100']
      },
      accuracy: {
        type: Number,
        min: [0, 'Accuracy cannot be negative'],
        max: [100, 'Accuracy cannot exceed 100']
      },
      timeliness: {
        type: Number,
        min: [0, 'Timeliness cannot be negative'],
        max: [100, 'Timeliness cannot exceed 100']
      }
    },
    processingTime: {
      type: Number, // in milliseconds
      min: [0, 'Processing time cannot be negative']
    },
    version: {
      type: String,
      default: '1.0'
    },
    tags: [{
      type: String,
      maxlength: [50, 'Tag cannot exceed 50 characters']
    }]
  },
  format: {
    type: String,
    enum: ['pdf', 'html', 'json', 'csv', 'excel'],
    default: 'pdf'
  },
  filePath: {
    type: String,
    maxlength: [500, 'File path cannot exceed 500 characters']
  },
  fileSize: {
    type: Number, // in bytes
    min: [0, 'File size cannot be negative']
  },
  status: {
    type: String,
    enum: ['generating', 'completed', 'failed', 'archived'],
    default: 'generating'
  },
  error: {
    message: {
      type: String,
      maxlength: [1000, 'Error message cannot exceed 1000 characters']
    },
    stack: {
      type: String
    },
    timestamp: {
      type: Date
    }
  },
  accessControl: {
    isPublic: {
      type: Boolean,
      default: false
    },
    allowedRoles: [{
      type: String,
      enum: ['witness', 'victim', 'healthcare_worker', 'admin']
    }],
    allowedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    allowedDepartments: [{
      type: String,
      maxlength: [100, 'Department name cannot exceed 100 characters']
    }]
  },
  compliance: {
    isNABHCompliant: {
      type: Boolean,
      default: false
    },
    complianceChecks: [{
      requirement: {
        type: String,
        required: true,
        maxlength: [200, 'Compliance requirement cannot exceed 200 characters']
      },
      status: {
        type: String,
        enum: ['passed', 'failed', 'not-applicable'],
        required: true
      },
      notes: {
        type: String,
        maxlength: [500, 'Compliance notes cannot exceed 500 characters']
      }
    }],
    auditTrail: [{
      action: {
        type: String,
        enum: ['generated', 'viewed', 'downloaded', 'shared', 'archived'],
        required: true
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      ipAddress: {
        type: String
      },
      userAgent: {
        type: String
      }
    }]
  },
  scheduledGeneration: {
    isScheduled: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly']
    },
    nextGenerationDate: {
      type: Date
    },
    lastGenerationDate: {
      type: Date
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for performance
reportSchema.index({ reportId: 1 });
reportSchema.index({ reportType: 1, createdAt: -1 });
reportSchema.index({ generatedBy: 1, createdAt: -1 });
reportSchema.index({ status: 1 });
reportSchema.index({ 'parameters.startDate': 1, 'parameters.endDate': 1 });
reportSchema.index({ 'scheduledGeneration.nextGenerationDate': 1 });
reportSchema.index({ isActive: 1 });

// Method to mark report as completed
reportSchema.methods.markCompleted = function(filePath, fileSize) {
  this.status = 'completed';
  this.filePath = filePath;
  this.fileSize = fileSize;
  
  // Add audit trail entry
  this.compliance.auditTrail.push({
    action: 'generated',
    userId: this.generatedBy,
    timestamp: new Date()
  });
  
  return this.save();
};

// Method to mark report as failed
reportSchema.methods.markFailed = function(error) {
  this.status = 'failed';
  this.error = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date()
  };
  
  return this.save();
};

// Method to add audit trail entry
reportSchema.methods.addAuditEntry = function(action, userId, ipAddress, userAgent) {
  this.compliance.auditTrail.push({
    action: action,
    userId: userId,
    timestamp: new Date(),
    ipAddress: ipAddress,
    userAgent: userAgent
  });
  
  return this.save();
};

// Method to check access permissions
reportSchema.methods.hasAccess = function(user) {
  // Public reports are accessible to all
  if (this.accessControl.isPublic) return true;
  
  // Check if user is explicitly allowed
  if (this.accessControl.allowedUsers.includes(user._id)) return true;
  
  // Check if user's role is allowed
  if (this.accessControl.allowedRoles.includes(user.role)) return true;
  
  // Check if user's department is allowed
  if (user.profile.department && 
      this.accessControl.allowedDepartments.includes(user.profile.department)) {
    return true;
  }
  
  // Report generator always has access
  if (this.generatedBy.equals(user._id)) return true;
  
  return false;
};

// Method to schedule next generation
reportSchema.methods.scheduleNext = function() {
  if (!this.scheduledGeneration.isScheduled || !this.scheduledGeneration.frequency) {
    return;
  }
  
  const now = new Date();
  let nextDate = new Date(now);
  
  switch (this.scheduledGeneration.frequency) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'quarterly':
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
  }
  
  this.scheduledGeneration.nextGenerationDate = nextDate;
  this.scheduledGeneration.lastGenerationDate = now;
  
  return this.save();
};

// Static method to find reports by type
reportSchema.statics.findByType = function(reportType) {
  return this.find({ 
    reportType: reportType,
    isActive: true 
  }).sort({ createdAt: -1 });
};

// Static method to find scheduled reports due for generation
reportSchema.statics.findDueForGeneration = function() {
  return this.find({
    'scheduledGeneration.isScheduled': true,
    'scheduledGeneration.nextGenerationDate': { $lte: new Date() },
    isActive: true
  });
};

// Static method to find reports by user access
reportSchema.statics.findAccessibleByUser = function(user) {
  return this.find({
    $or: [
      { 'accessControl.isPublic': true },
      { 'accessControl.allowedUsers': user._id },
      { 'accessControl.allowedRoles': user.role },
      { 'accessControl.allowedDepartments': user.profile.department },
      { generatedBy: user._id }
    ],
    isActive: true
  }).sort({ createdAt: -1 });
};

// Static method to get report statistics
reportSchema.statics.getReportStatistics = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        totalReports: { $sum: 1 },
        completedReports: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        failedReports: {
          $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
        },
        scheduledReports: {
          $sum: { $cond: ['$scheduledGeneration.isScheduled', 1, 0] }
        },
        reportTypeDistribution: { $push: '$reportType' },
        averageFileSize: { $avg: '$fileSize' },
        averageProcessingTime: { $avg: '$metadata.processingTime' }
      }
    }
  ]);
};

module.exports = mongoose.model('Report', reportSchema);