const mongoose = require('mongoose');

const safetyPlanSchema = new mongoose.Schema({
  victimId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VictimProfile',
    required: [true, 'Victim ID is required']
  },
  planVersion: {
    type: Number,
    required: [true, 'Plan version is required'],
    default: 1,
    min: [1, 'Plan version must be at least 1']
  },
  emergencyContacts: [{
    name: {
      type: String,
      required: [true, 'Emergency contact name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    phone: {
      type: String,
      required: [true, 'Emergency contact phone is required'],
      trim: true,
      match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
    },
    relationship: {
      type: String,
      required: [true, 'Relationship is required'],
      enum: ['family', 'friend', 'coworker', 'neighbor', 'professional', 'hotline', 'other'],
      maxlength: [50, 'Relationship cannot exceed 50 characters']
    },
    priority: {
      type: Number,
      required: [true, 'Priority is required'],
      min: [1, 'Priority must be at least 1'],
      max: [10, 'Priority cannot exceed 10']
    },
    isSafe: {
      type: Boolean,
      required: true,
      default: true
    },
    notes: {
      type: String,
      maxlength: [300, 'Notes cannot exceed 300 characters']
    }
  }],
  safeLocations: [{
    name: {
      type: String,
      required: [true, 'Safe location name is required'],
      trim: true,
      maxlength: [100, 'Location name cannot exceed 100 characters']
    },
    address: {
      type: String,
      required: [true, 'Safe location address is required'],
      trim: true,
      maxlength: [200, 'Address cannot exceed 200 characters']
    },
    contactPerson: {
      type: String,
      trim: true,
      maxlength: [100, 'Contact person name cannot exceed 100 characters']
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
    },
    accessInstructions: {
      type: String,
      maxlength: [300, 'Access instructions cannot exceed 300 characters']
    },
    notes: {
      type: String,
      maxlength: [300, 'Notes cannot exceed 300 characters']
    },
    isAvailable24Hours: {
      type: Boolean,
      default: false
    },
    requiresAdvanceNotice: {
      type: Boolean,
      default: false
    }
  }],
  importantDocuments: [{
    documentType: {
      type: String,
      required: [true, 'Document type is required'],
      enum: [
        'identification',
        'social-security-card',
        'birth-certificate',
        'passport',
        'drivers-license',
        'insurance-cards',
        'medical-records',
        'financial-documents',
        'legal-documents',
        'restraining-order',
        'custody-papers',
        'immigration-papers',
        'other'
      ]
    },
    location: {
      type: String,
      required: [true, 'Document location is required'],
      trim: true,
      maxlength: [200, 'Location cannot exceed 200 characters']
    },
    copies: {
      type: String,
      enum: ['none', 'physical-copy', 'digital-copy', 'both'],
      default: 'none'
    },
    copyLocation: {
      type: String,
      trim: true,
      maxlength: [200, 'Copy location cannot exceed 200 characters']
    },
    notes: {
      type: String,
      maxlength: [300, 'Notes cannot exceed 300 characters']
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    }
  }],
  childSafety: [{
    childAge: {
      type: Number,
      required: [true, 'Child age is required'],
      min: [0, 'Child age cannot be negative'],
      max: [25, 'Child age cannot exceed 25']
    },
    childName: {
      type: String,
      trim: true,
      maxlength: [50, 'Child name cannot exceed 50 characters']
    },
    schoolInfo: {
      schoolName: {
        type: String,
        trim: true,
        maxlength: [100, 'School name cannot exceed 100 characters']
      },
      schoolPhone: {
        type: String,
        trim: true,
        match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
      },
      emergencyContact: {
        type: String,
        trim: true,
        maxlength: [100, 'Emergency contact cannot exceed 100 characters']
      }
    },
    safetyInstructions: {
      type: String,
      maxlength: [500, 'Safety instructions cannot exceed 500 characters']
    },
    emergencyContact: {
      name: {
        type: String,
        trim: true,
        maxlength: [100, 'Emergency contact name cannot exceed 100 characters']
      },
      phone: {
        type: String,
        trim: true,
        match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
      },
      relationship: {
        type: String,
        trim: true,
        maxlength: [50, 'Relationship cannot exceed 50 characters']
      }
    },
    specialNeeds: {
      type: String,
      maxlength: [300, 'Special needs cannot exceed 300 characters']
    }
  }],
  emergencyBag: [{
    item: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      maxlength: [100, 'Item name cannot exceed 100 characters']
    },
    category: {
      type: String,
      enum: [
        'clothing',
        'personal-items',
        'medications',
        'documents',
        'money',
        'keys',
        'electronics',
        'children-items',
        'other'
      ],
      default: 'other'
    },
    location: {
      type: String,
      trim: true,
      maxlength: [200, 'Location cannot exceed 200 characters']
    },
    notes: {
      type: String,
      maxlength: [200, 'Notes cannot exceed 200 characters']
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    isPacked: {
      type: Boolean,
      default: false
    }
  }],
  warningSignsAndTriggers: [{
    type: String,
    required: [true, 'Warning sign is required'],
    trim: true,
    maxlength: [200, 'Warning sign cannot exceed 200 characters']
  }],
  copingStrategies: [{
    strategy: {
      type: String,
      required: [true, 'Coping strategy is required'],
      trim: true,
      maxlength: [200, 'Strategy cannot exceed 200 characters']
    },
    category: {
      type: String,
      enum: [
        'breathing-exercises',
        'physical-activity',
        'social-support',
        'professional-help',
        'self-care',
        'distraction',
        'grounding-techniques',
        'other'
      ],
      default: 'other'
    },
    effectiveness: {
      type: Number,
      min: [1, 'Effectiveness rating must be between 1 and 5'],
      max: [5, 'Effectiveness rating must be between 1 and 5']
    }
  }],
  safetySteps: {
    beforeIncident: [{
      step: {
        type: String,
        required: true,
        maxlength: [300, 'Safety step cannot exceed 300 characters']
      },
      priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
      }
    }],
    duringIncident: [{
      step: {
        type: String,
        required: true,
        maxlength: [300, 'Safety step cannot exceed 300 characters']
      },
      priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'high'
      }
    }],
    afterIncident: [{
      step: {
        type: String,
        required: true,
        maxlength: [300, 'Safety step cannot exceed 300 characters']
      },
      priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
      }
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastReviewedDate: {
    type: Date
  },
  nextReviewDate: {
    type: Date
  },
  reviewNotes: {
    type: String,
    maxlength: [1000, 'Review notes cannot exceed 1000 characters']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for performance
safetyPlanSchema.index({ victimId: 1, planVersion: -1 });
safetyPlanSchema.index({ isActive: 1 });
safetyPlanSchema.index({ nextReviewDate: 1 });
safetyPlanSchema.index({ createdAt: -1 });

// Pre-save middleware to increment version for existing victim
safetyPlanSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Find the latest version for this victim
    const latestPlan = await this.constructor.findOne(
      { victimId: this.victimId },
      {},
      { sort: { planVersion: -1 } }
    );
    
    if (latestPlan) {
      this.planVersion = latestPlan.planVersion + 1;
      // Deactivate previous version
      await this.constructor.updateMany(
        { victimId: this.victimId, _id: { $ne: this._id } },
        { $set: { isActive: false } }
      );
    }
    
    // Set next review date (3 months from creation)
    if (!this.nextReviewDate) {
      this.nextReviewDate = new Date();
      this.nextReviewDate.setMonth(this.nextReviewDate.getMonth() + 3);
    }
  }
  
  next();
});

// Method to check if plan needs review
safetyPlanSchema.methods.needsReview = function() {
  if (!this.nextReviewDate) return true;
  return new Date() > this.nextReviewDate;
};

// Method to mark plan as reviewed
safetyPlanSchema.methods.markAsReviewed = function(reviewNotes, nextReviewMonths = 3) {
  this.lastReviewedDate = new Date();
  this.nextReviewDate = new Date();
  this.nextReviewDate.setMonth(this.nextReviewDate.getMonth() + nextReviewMonths);
  
  if (reviewNotes) {
    this.reviewNotes = reviewNotes;
  }
  
  return this.save();
};

// Method to get completion percentage
safetyPlanSchema.methods.getCompletionPercentage = function() {
  let totalSections = 0;
  let completedSections = 0;
  
  // Check each section
  const sections = [
    'emergencyContacts',
    'safeLocations',
    'importantDocuments',
    'emergencyBag',
    'warningSignsAndTriggers',
    'copingStrategies'
  ];
  
  sections.forEach(section => {
    totalSections++;
    if (this[section] && this[section].length > 0) {
      completedSections++;
    }
  });
  
  // Check safety steps
  totalSections += 3; // before, during, after
  if (this.safetySteps.beforeIncident && this.safetySteps.beforeIncident.length > 0) completedSections++;
  if (this.safetySteps.duringIncident && this.safetySteps.duringIncident.length > 0) completedSections++;
  if (this.safetySteps.afterIncident && this.safetySteps.afterIncident.length > 0) completedSections++;
  
  return Math.round((completedSections / totalSections) * 100);
};

// Method to get critical items status
safetyPlanSchema.methods.getCriticalItemsStatus = function() {
  const criticalItems = {
    emergencyContacts: this.emergencyContacts.length > 0,
    safeLocations: this.safeLocations.length > 0,
    importantDocuments: this.importantDocuments.filter(doc => doc.priority === 'critical').length > 0,
    emergencyBag: this.emergencyBag.filter(item => item.priority === 'critical').length > 0,
    duringIncidentSteps: this.safetySteps.duringIncident && this.safetySteps.duringIncident.length > 0
  };
  
  const totalCritical = Object.keys(criticalItems).length;
  const completedCritical = Object.values(criticalItems).filter(Boolean).length;
  
  return {
    total: totalCritical,
    completed: completedCritical,
    percentage: Math.round((completedCritical / totalCritical) * 100),
    items: criticalItems
  };
};

// Method to add emergency contact
safetyPlanSchema.methods.addEmergencyContact = function(contactData) {
  this.emergencyContacts.push(contactData);
  return this.save();
};

// Method to add safe location
safetyPlanSchema.methods.addSafeLocation = function(locationData) {
  this.safeLocations.push(locationData);
  return this.save();
};

// Method to add document
safetyPlanSchema.methods.addDocument = function(documentData) {
  this.importantDocuments.push(documentData);
  return this.save();
};

// Method to add emergency bag item
safetyPlanSchema.methods.addEmergencyBagItem = function(itemData) {
  this.emergencyBag.push(itemData);
  return this.save();
};

// Static method to find active plans for victim
safetyPlanSchema.statics.findActiveForVictim = function(victimId) {
  return this.findOne({ 
    victimId: victimId, 
    isActive: true 
  }).sort({ planVersion: -1 });
};

// Static method to find plans needing review
safetyPlanSchema.statics.findNeedingReview = function() {
  return this.find({
    isActive: true,
    $or: [
      { nextReviewDate: { $lt: new Date() } },
      { nextReviewDate: { $exists: false } }
    ]
  }).populate('victimId');
};

// Static method to get plan statistics
safetyPlanSchema.statics.getPlanStatistics = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        totalPlans: { $sum: 1 },
        plansNeedingReview: {
          $sum: {
            $cond: [
              { $lt: ['$nextReviewDate', new Date()] },
              1,
              0
            ]
          }
        },
        averageEmergencyContacts: { $avg: { $size: '$emergencyContacts' } },
        averageSafeLocations: { $avg: { $size: '$safeLocations' } }
      }
    }
  ]);
};

module.exports = mongoose.model('SafetyPlan', safetyPlanSchema);