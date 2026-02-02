const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  contentId: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      return 'CNT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
  },
  title: {
    type: String,
    required: [true, 'Content title is required'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: [true, 'Content slug is required'],
    unique: true,
    lowercase: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },
  type: {
    type: String,
    required: [true, 'Content type is required'],
    enum: [
      'educational-article',
      'safety-guide',
      'resource-directory',
      'faq',
      'legal-information',
      'emergency-procedures',
      'support-services',
      'self-help-tools',
      'training-material',
      'policy-document',
      'form-template',
      'other'
    ]
  },
  category: {
    type: String,
    required: [true, 'Content category is required'],
    enum: [
      'domestic-violence',
      'sexual-assault',
      'stalking',
      'emotional-abuse',
      'financial-abuse',
      'safety-planning',
      'legal-rights',
      'healthcare',
      'mental-health',
      'children-safety',
      'elder-abuse',
      'lgbtq-resources',
      'cultural-specific',
      'emergency-response',
      'prevention',
      'recovery',
      'other'
    ]
  },
  content: {
    summary: {
      type: String,
      maxlength: [500, 'Summary cannot exceed 500 characters']
    },
    body: {
      type: String,
      required: [true, 'Content body is required']
    },
    keyPoints: [{
      type: String,
      maxlength: [200, 'Key point cannot exceed 200 characters']
    }],
    actionItems: [{
      action: {
        type: String,
        required: true,
        maxlength: [200, 'Action item cannot exceed 200 characters']
      },
      priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
      },
      timeframe: {
        type: String,
        enum: ['immediate', 'short-term', 'long-term'],
        default: 'short-term'
      }
    }],
    resources: [{
      title: {
        type: String,
        required: true,
        maxlength: [200, 'Resource title cannot exceed 200 characters']
      },
      type: {
        type: String,
        enum: ['link', 'phone', 'email', 'address', 'document', 'video', 'other'],
        required: true
      },
      value: {
        type: String,
        required: true,
        maxlength: [500, 'Resource value cannot exceed 500 characters']
      },
      description: {
        type: String,
        maxlength: [300, 'Resource description cannot exceed 300 characters']
      },
      isEmergency: {
        type: Boolean,
        default: false
      },
      isAvailable24Hours: {
        type: Boolean,
        default: false
      }
    }],
    warningNotices: [{
      type: {
        type: String,
        enum: ['safety', 'legal', 'medical', 'general'],
        required: true
      },
      message: {
        type: String,
        required: true,
        maxlength: [500, 'Warning message cannot exceed 500 characters']
      },
      severity: {
        type: String,
        enum: ['info', 'warning', 'danger', 'critical'],
        default: 'warning'
      }
    }]
  },
  metadata: {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Content author is required']
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: {
      type: Date
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    version: {
      type: String,
      default: '1.0'
    },
    tags: [{
      type: String,
      maxlength: [50, 'Tag cannot exceed 50 characters']
    }],
    keywords: [{
      type: String,
      maxlength: [50, 'Keyword cannot exceed 50 characters']
    }],
    language: {
      type: String,
      default: 'en',
      maxlength: [10, 'Language code cannot exceed 10 characters']
    },
    readingLevel: {
      type: String,
      enum: ['elementary', 'middle-school', 'high-school', 'college', 'graduate'],
      default: 'high-school'
    },
    estimatedReadTime: {
      type: Number, // in minutes
      min: [1, 'Estimated read time must be at least 1 minute']
    }
  },
  accessibility: {
    targetAudience: [{
      type: String,
      enum: ['victims', 'witnesses', 'healthcare-workers', 'administrators', 'general-public', 'professionals']
    }],
    userRoles: [{
      type: String,
      enum: ['witness', 'victim', 'healthcare_worker', 'admin']
    }],
    departments: [{
      type: String,
      maxlength: [100, 'Department name cannot exceed 100 characters']
    }],
    isPublic: {
      type: Boolean,
      default: false
    },
    requiresAuthentication: {
      type: Boolean,
      default: true
    },
    sensitivityLevel: {
      type: String,
      enum: ['public', 'internal', 'confidential', 'restricted'],
      default: 'internal'
    }
  },
  localization: {
    isTranslated: {
      type: Boolean,
      default: false
    },
    availableLanguages: [{
      language: {
        type: String,
        required: true,
        maxlength: [10, 'Language code cannot exceed 10 characters']
      },
      contentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content'
      },
      translatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      translatedAt: {
        type: Date
      },
      reviewStatus: {
        type: String,
        enum: ['pending', 'approved', 'needs-revision'],
        default: 'pending'
      }
    }],
    culturalAdaptations: [{
      culture: {
        type: String,
        required: true,
        maxlength: [50, 'Culture identifier cannot exceed 50 characters']
      },
      adaptations: {
        type: String,
        maxlength: [1000, 'Cultural adaptations cannot exceed 1000 characters']
      },
      adaptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }]
  },
  workflow: {
    status: {
      type: String,
      enum: ['draft', 'pending-review', 'approved', 'published', 'archived', 'needs-revision'],
      default: 'draft'
    },
    publishedAt: {
      type: Date
    },
    scheduledPublishAt: {
      type: Date
    },
    expiresAt: {
      type: Date
    },
    approvalRequired: {
      type: Boolean,
      default: true
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: {
      type: Date
    },
    rejectionReason: {
      type: String,
      maxlength: [500, 'Rejection reason cannot exceed 500 characters']
    }
  },
  analytics: {
    viewCount: {
      type: Number,
      default: 0,
      min: [0, 'View count cannot be negative']
    },
    uniqueViewers: {
      type: Number,
      default: 0,
      min: [0, 'Unique viewers cannot be negative']
    },
    averageTimeSpent: {
      type: Number, // in seconds
      default: 0,
      min: [0, 'Average time spent cannot be negative']
    },
    lastViewedAt: {
      type: Date
    },
    popularityScore: {
      type: Number,
      default: 0,
      min: [0, 'Popularity score cannot be negative']
    },
    feedback: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: {
        type: Number,
        min: [1, 'Rating must be between 1 and 5'],
        max: [5, 'Rating must be between 1 and 5']
      },
      comment: {
        type: String,
        maxlength: [500, 'Feedback comment cannot exceed 500 characters']
      },
      isHelpful: {
        type: Boolean
      },
      submittedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  emergency: {
    isEmergencyContent: {
      type: Boolean,
      default: false
    },
    emergencyLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    },
    immediateAction: {
      type: String,
      maxlength: [200, 'Immediate action cannot exceed 200 characters']
    },
    emergencyContacts: [{
      name: {
        type: String,
        required: true,
        maxlength: [100, 'Emergency contact name cannot exceed 100 characters']
      },
      phone: {
        type: String,
        required: true,
        match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
      },
      type: {
        type: String,
        enum: ['hotline', 'police', 'medical', 'shelter', 'legal', 'other'],
        required: true
      },
      isAvailable24Hours: {
        type: Boolean,
        default: false
      }
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for performance
contentSchema.index({ contentId: 1 });
contentSchema.index({ slug: 1 });
contentSchema.index({ type: 1, category: 1 });
contentSchema.index({ 'workflow.status': 1 });
contentSchema.index({ 'accessibility.targetAudience': 1 });
contentSchema.index({ 'accessibility.userRoles': 1 });
contentSchema.index({ 'metadata.tags': 1 });
contentSchema.index({ 'metadata.keywords': 1 });
contentSchema.index({ 'emergency.isEmergencyContent': 1 });
contentSchema.index({ isActive: 1 });
contentSchema.index({ createdAt: -1 });

// Pre-save middleware to generate slug if not provided
contentSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  
  // Calculate estimated read time (average 200 words per minute)
  if (this.content.body && !this.metadata.estimatedReadTime) {
    const wordCount = this.content.body.split(/\s+/).length;
    this.metadata.estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200));
  }
  
  next();
});

// Method to increment view count
contentSchema.methods.incrementViews = function(userId) {
  this.analytics.viewCount += 1;
  this.analytics.lastViewedAt = new Date();
  
  // Track unique viewers (simplified - in production, use more sophisticated tracking)
  if (userId) {
    this.analytics.uniqueViewers += 1;
  }
  
  return this.save();
};

// Method to add feedback
contentSchema.methods.addFeedback = function(userId, rating, comment, isHelpful) {
  this.analytics.feedback.push({
    userId: userId,
    rating: rating,
    comment: comment,
    isHelpful: isHelpful,
    submittedAt: new Date()
  });
  
  // Recalculate popularity score
  this.calculatePopularityScore();
  
  return this.save();
};

// Method to calculate popularity score
contentSchema.methods.calculatePopularityScore = function() {
  const viewWeight = 0.3;
  const ratingWeight = 0.4;
  const recencyWeight = 0.3;
  
  // Normalize view count (log scale)
  const viewScore = Math.log(this.analytics.viewCount + 1) * 10;
  
  // Calculate average rating
  const ratings = this.analytics.feedback.filter(f => f.rating).map(f => f.rating);
  const avgRating = ratings.length > 0 ? 
    ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;
  const ratingScore = avgRating * 20; // Scale to 0-100
  
  // Calculate recency score (newer content gets higher score)
  const daysSinceCreation = (new Date() - this.createdAt) / (1000 * 60 * 60 * 24);
  const recencyScore = Math.max(0, 100 - (daysSinceCreation / 30) * 10); // Decay over 30 days
  
  this.analytics.popularityScore = 
    (viewScore * viewWeight) + 
    (ratingScore * ratingWeight) + 
    (recencyScore * recencyWeight);
  
  return this.analytics.popularityScore;
};

// Method to check if content is accessible to user
contentSchema.methods.isAccessibleTo = function(user) {
  // Check if content is published
  if (this.workflow.status !== 'published') return false;
  
  // Check if content is active
  if (!this.isActive) return false;
  
  // Check expiration
  if (this.workflow.expiresAt && this.workflow.expiresAt < new Date()) return false;
  
  // Check public access
  if (this.accessibility.isPublic) return true;
  
  // Check authentication requirement
  if (this.accessibility.requiresAuthentication && !user) return false;
  
  // Check user role access
  if (this.accessibility.userRoles.length > 0 && 
      !this.accessibility.userRoles.includes(user.role)) return false;
  
  // Check department access
  if (this.accessibility.departments.length > 0 && 
      !this.accessibility.departments.includes(user.profile.department)) return false;
  
  return true;
};

// Method to publish content
contentSchema.methods.publish = function(publishedBy) {
  this.workflow.status = 'published';
  this.workflow.publishedAt = new Date();
  this.workflow.approvedBy = publishedBy;
  this.workflow.approvedAt = new Date();
  
  return this.save();
};

// Method to archive content
contentSchema.methods.archive = function() {
  this.workflow.status = 'archived';
  this.isActive = false;
  
  return this.save();
};

// Static method to find content by category
contentSchema.statics.findByCategory = function(category, userRole) {
  const query = {
    category: category,
    'workflow.status': 'published',
    isActive: true
  };
  
  if (userRole) {
    query['accessibility.userRoles'] = userRole;
  }
  
  return this.find(query).sort({ 'analytics.popularityScore': -1, createdAt: -1 });
};

// Static method to find emergency content
contentSchema.statics.findEmergencyContent = function() {
  return this.find({
    'emergency.isEmergencyContent': true,
    'workflow.status': 'published',
    isActive: true
  }).sort({ 'emergency.emergencyLevel': -1, 'analytics.popularityScore': -1 });
};

// Static method to search content
contentSchema.statics.searchContent = function(searchTerm, filters = {}) {
  const query = {
    'workflow.status': 'published',
    isActive: true,
    $or: [
      { title: { $regex: searchTerm, $options: 'i' } },
      { 'content.body': { $regex: searchTerm, $options: 'i' } },
      { 'metadata.tags': { $regex: searchTerm, $options: 'i' } },
      { 'metadata.keywords': { $regex: searchTerm, $options: 'i' } }
    ]
  };
  
  // Apply filters
  if (filters.type) query.type = filters.type;
  if (filters.category) query.category = filters.category;
  if (filters.userRole) query['accessibility.userRoles'] = filters.userRole;
  if (filters.language) query['metadata.language'] = filters.language;
  
  return this.find(query).sort({ 'analytics.popularityScore': -1, createdAt: -1 });
};

// Static method to get popular content
contentSchema.statics.getPopularContent = function(limit = 10) {
  return this.find({
    'workflow.status': 'published',
    isActive: true
  }).sort({ 'analytics.popularityScore': -1 })
    .limit(limit);
};

// Static method to get content statistics
contentSchema.statics.getContentStatistics = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        totalContent: { $sum: 1 },
        publishedContent: {
          $sum: { $cond: [{ $eq: ['$workflow.status', 'published'] }, 1, 0] }
        },
        draftContent: {
          $sum: { $cond: [{ $eq: ['$workflow.status', 'draft'] }, 1, 0] }
        },
        emergencyContent: {
          $sum: { $cond: ['$emergency.isEmergencyContent', 1, 0] }
        },
        totalViews: { $sum: '$analytics.viewCount' },
        averageRating: { $avg: '$analytics.feedback.rating' },
        contentByType: { $push: '$type' },
        contentByCategory: { $push: '$category' }
      }
    }
  ]);
};

module.exports = mongoose.model('Content', contentSchema);