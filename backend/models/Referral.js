const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referralId: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      return 'REF-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
  },
  // Reference to either patient or victim profile
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  },
  victimId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VictimProfile'
  },
  referringUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Referring user is required']
  },
  referralType: {
    type: String,
    required: [true, 'Referral type is required'],
    enum: ['counseling', 'legal', 'shelter', 'medical', 'financial', 'support-group', 'emergency', 'other']
  },
  serviceProvider: {
    name: {
      type: String,
      required: [true, 'Service provider name is required'],
      maxlength: [200, 'Service provider name cannot exceed 200 characters']
    },
    type: {
      type: String,
      required: [true, 'Service provider type is required'],
      enum: ['ngo', 'government', 'private', 'hospital', 'clinic', 'legal-aid', 'shelter', 'hotline']
    },
    contactInfo: {
      phone: {
        type: String,
        required: [true, 'Service provider phone is required'],
        match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
      },
      email: {
        type: String,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
      },
      address: {
        street: {
          type: String,
          maxlength: [200, 'Street address cannot exceed 200 characters']
        },
        city: {
          type: String,
          maxlength: [100, 'City cannot exceed 100 characters']
        },
        state: {
          type: String,
          maxlength: [50, 'State cannot exceed 50 characters']
        },
        zipCode: {
          type: String,
          match: [/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code']
        }
      },
      website: {
        type: String,
        maxlength: [200, 'Website URL cannot exceed 200 characters']
      }
    },
    specialties: [{
      type: String,
      enum: [
        'domestic-violence',
        'sexual-assault',
        'trauma-counseling',
        'family-therapy',
        'legal-advocacy',
        'emergency-shelter',
        'transitional-housing',
        'financial-assistance',
        'child-services',
        'substance-abuse',
        'mental-health',
        'medical-care',
        'immigration',
        'disability-services',
        'elder-abuse',
        'lgbtq-services',
        'other'
      ]
    }],
    availability: {
      type: String,
      enum: ['24-7', 'business-hours', 'weekdays', 'weekends', 'by-appointment', 'emergency-only'],
      default: 'by-appointment'
    },
    languages: [{
      type: String,
      maxlength: [50, 'Language cannot exceed 50 characters']
    }],
    capacity: {
      type: String,
      enum: ['available', 'limited', 'waitlist', 'full'],
      default: 'available'
    }
  },
  urgencyLevel: {
    type: String,
    required: [true, 'Urgency level is required'],
    enum: ['low', 'medium', 'high', 'emergency'],
    default: 'medium'
  },
  referralReason: {
    type: String,
    required: [true, 'Referral reason is required'],
    maxlength: [1000, 'Referral reason cannot exceed 1000 characters']
  },
  riskFactors: [{
    type: String,
    enum: [
      'immediate-danger',
      'escalating-violence',
      'weapons-present',
      'threats-made',
      'substance-abuse',
      'mental-health-crisis',
      'pregnancy',
      'children-at-risk',
      'financial-dependency',
      'isolation',
      'immigration-status',
      'disability',
      'elder-abuse',
      'other'
    ]
  }],
  patientConsent: {
    type: Boolean,
    required: [true, 'Patient consent status is required'],
    default: false
  },
  consentDate: {
    type: Date,
    required: function() {
      return this.patientConsent;
    }
  },
  consentMethod: {
    type: String,
    enum: ['verbal', 'written', 'electronic'],
    required: function() {
      return this.patientConsent;
    }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in-progress', 'completed', 'declined', 'cancelled', 'no-show'],
    default: 'pending'
  },
  appointmentDetails: {
    scheduledDate: {
      type: Date
    },
    scheduledTime: {
      type: String,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter time in HH:MM format']
    },
    location: {
      type: String,
      maxlength: [200, 'Location cannot exceed 200 characters']
    },
    appointmentType: {
      type: String,
      enum: ['in-person', 'phone', 'video', 'home-visit'],
      default: 'in-person'
    },
    notes: {
      type: String,
      maxlength: [500, 'Appointment notes cannot exceed 500 characters']
    },
    confirmationSent: {
      type: Boolean,
      default: false
    },
    reminderSent: {
      type: Boolean,
      default: false
    }
  },
  outcome: {
    attended: {
      type: Boolean
    },
    attendanceDate: {
      type: Date
    },
    serviceReceived: {
      type: Boolean
    },
    followUpNeeded: {
      type: Boolean,
      default: false
    },
    followUpDate: {
      type: Date
    },
    satisfaction: {
      type: Number,
      min: [1, 'Satisfaction rating must be between 1 and 5'],
      max: [5, 'Satisfaction rating must be between 1 and 5']
    },
    notes: {
      type: String,
      maxlength: [1000, 'Outcome notes cannot exceed 1000 characters']
    },
    nextSteps: {
      type: String,
      maxlength: [500, 'Next steps cannot exceed 500 characters']
    },
    barriers: [{
      type: String,
      enum: [
        'transportation',
        'childcare',
        'work-schedule',
        'language-barrier',
        'cultural-barrier',
        'fear-safety',
        'financial',
        'insurance',
        'documentation',
        'disability-access',
        'technology',
        'other'
      ]
    }]
  },
  followUpReferrals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Referral'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  internalNotes: {
    type: String,
    maxlength: [1000, 'Internal notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Indexes for performance
referralSchema.index({ referralId: 1 });
referralSchema.index({ patientId: 1, createdAt: -1 });
referralSchema.index({ victimId: 1, createdAt: -1 });
referralSchema.index({ referringUserId: 1, createdAt: -1 });
referralSchema.index({ referralType: 1 });
referralSchema.index({ urgencyLevel: 1 });
referralSchema.index({ status: 1 });
referralSchema.index({ 'appointmentDetails.scheduledDate': 1 });
referralSchema.index({ createdAt: -1 });

// Validation to ensure either patientId or victimId is provided
referralSchema.pre('validate', function(next) {
  if (!this.patientId && !this.victimId) {
    next(new Error('Either patientId or victimId must be provided'));
  } else if (this.patientId && this.victimId) {
    next(new Error('Cannot have both patientId and victimId'));
  } else {
    next();
  }
});

// Method to check if referral is overdue
referralSchema.methods.isOverdue = function() {
  if (!this.appointmentDetails.scheduledDate) return false;
  
  const now = new Date();
  const scheduled = new Date(this.appointmentDetails.scheduledDate);
  
  return scheduled < now && ['pending', 'accepted'].includes(this.status);
};

// Method to get days until appointment
referralSchema.methods.getDaysUntilAppointment = function() {
  if (!this.appointmentDetails.scheduledDate) return null;
  
  const now = new Date();
  const scheduled = new Date(this.appointmentDetails.scheduledDate);
  const diffTime = scheduled - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Method to schedule appointment
referralSchema.methods.scheduleAppointment = function(appointmentData) {
  this.appointmentDetails = {
    ...this.appointmentDetails,
    ...appointmentData
  };
  
  if (this.status === 'pending') {
    this.status = 'accepted';
  }
  
  return this.save();
};

// Method to update status
referralSchema.methods.updateStatus = function(newStatus, notes) {
  this.status = newStatus;
  
  if (notes) {
    this.internalNotes = (this.internalNotes || '') + '\n' + 
      `[${new Date().toISOString()}] Status changed to ${newStatus}: ${notes}`;
  }
  
  return this.save();
};

// Method to record outcome
referralSchema.methods.recordOutcome = function(outcomeData) {
  this.outcome = {
    ...this.outcome,
    ...outcomeData
  };
  
  if (outcomeData.attended !== undefined) {
    this.status = outcomeData.attended ? 'completed' : 'no-show';
  }
  
  return this.save();
};

// Static method to find urgent referrals
referralSchema.statics.findUrgent = function() {
  return this.find({
    urgencyLevel: { $in: ['high', 'emergency'] },
    status: { $in: ['pending', 'accepted'] },
    isActive: true
  }).populate('patientId victimId referringUserId')
    .sort({ urgencyLevel: -1, createdAt: 1 });
};

// Static method to find overdue referrals
referralSchema.statics.findOverdue = function() {
  return this.find({
    'appointmentDetails.scheduledDate': { $lt: new Date() },
    status: { $in: ['pending', 'accepted'] },
    isActive: true
  }).populate('patientId victimId referringUserId')
    .sort({ 'appointmentDetails.scheduledDate': 1 });
};

// Static method to find referrals by service type
referralSchema.statics.findByServiceType = function(serviceType) {
  return this.find({
    referralType: serviceType,
    isActive: true
  }).sort({ createdAt: -1 });
};

// Static method to get referral statistics
referralSchema.statics.getReferralStatistics = function(startDate, endDate) {
  const matchStage = {
    isActive: true,
    createdAt: {
      $gte: startDate || new Date(0),
      $lte: endDate || new Date()
    }
  };
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalReferrals: { $sum: 1 },
        completedReferrals: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        pendingReferrals: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        urgentReferrals: {
          $sum: { $cond: [{ $in: ['$urgencyLevel', ['high', 'emergency']] }, 1, 0] }
        },
        referralTypeDistribution: { $push: '$referralType' },
        averageSatisfaction: { $avg: '$outcome.satisfaction' }
      }
    }
  ]);
};

// Static method to find referrals needing follow-up
referralSchema.statics.findNeedingFollowUp = function() {
  return this.find({
    'outcome.followUpNeeded': true,
    'outcome.followUpDate': { $lte: new Date() },
    status: 'completed',
    isActive: true
  }).populate('patientId victimId referringUserId')
    .sort({ 'outcome.followUpDate': 1 });
};

module.exports = mongoose.model('Referral', referralSchema);