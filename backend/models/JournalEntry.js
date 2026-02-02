const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
  victimId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VictimProfile',
    required: [true, 'Victim ID is required']
  },
  entryDate: {
    type: Date,
    required: [true, 'Entry date is required'],
    default: Date.now,
    validate: {
      validator: function(value) {
        return value <= new Date();
      },
      message: 'Entry date cannot be in the future'
    }
  },
  moodRating: {
    type: Number,
    required: [true, 'Mood rating is required'],
    min: [1, 'Mood rating must be between 1 and 10'],
    max: [10, 'Mood rating must be between 1 and 10']
  },
  painLevel: {
    type: Number,
    required: [true, 'Pain level is required'],
    min: [0, 'Pain level must be between 0 and 10'],
    max: [10, 'Pain level must be between 0 and 10']
  },
  sleepQuality: {
    type: Number,
    required: [true, 'Sleep quality is required'],
    min: [1, 'Sleep quality must be between 1 and 10'],
    max: [10, 'Sleep quality must be between 1 and 10']
  },
  sleepHours: {
    type: Number,
    min: [0, 'Sleep hours cannot be negative'],
    max: [24, 'Sleep hours cannot exceed 24']
  },
  incidentOccurred: {
    type: Boolean,
    required: [true, 'Incident occurrence status is required'],
    default: false
  },
  incidentDetails: {
    type: String,
    maxlength: [2000, 'Incident details cannot exceed 2000 characters'],
    required: function() {
      return this.incidentOccurred;
    }
  },
  incidentSeverity: {
    type: Number,
    min: [1, 'Incident severity must be between 1 and 5'],
    max: [5, 'Incident severity must be between 1 and 5'],
    required: function() {
      return this.incidentOccurred;
    }
  },
  emotionalState: [{
    type: String,
    enum: [
      'happy',
      'sad',
      'angry',
      'anxious',
      'fearful',
      'hopeful',
      'frustrated',
      'overwhelmed',
      'numb',
      'confused',
      'grateful',
      'lonely',
      'empowered',
      'helpless',
      'other'
    ]
  }],
  physicalSymptoms: [{
    type: String,
    enum: [
      'headache',
      'fatigue',
      'muscle-tension',
      'stomach-issues',
      'sleep-problems',
      'appetite-changes',
      'dizziness',
      'chest-pain',
      'shortness-of-breath',
      'trembling',
      'sweating',
      'nausea',
      'back-pain',
      'joint-pain',
      'other'
    ]
  }],
  copingStrategies: [{
    strategy: {
      type: String,
      required: true,
      maxlength: [200, 'Coping strategy cannot exceed 200 characters']
    },
    effectiveness: {
      type: Number,
      min: [1, 'Effectiveness rating must be between 1 and 5'],
      max: [5, 'Effectiveness rating must be between 1 and 5']
    }
  }],
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  isPrivate: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  location: {
    type: String,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  weatherMood: {
    type: String,
    enum: ['sunny', 'cloudy', 'rainy', 'stormy', 'foggy', 'other']
  }
}, {
  timestamps: true
});

// Indexes for performance
journalEntrySchema.index({ victimId: 1, entryDate: -1 });
journalEntrySchema.index({ entryDate: -1 });
journalEntrySchema.index({ incidentOccurred: 1 });
journalEntrySchema.index({ moodRating: 1 });
journalEntrySchema.index({ painLevel: 1 });
journalEntrySchema.index({ isPrivate: 1 });

// Virtual for overall wellbeing score
journalEntrySchema.virtual('wellbeingScore').get(function() {
  // Calculate a composite wellbeing score (0-100)
  const moodScore = (this.moodRating / 10) * 40; // 40% weight
  const sleepScore = (this.sleepQuality / 10) * 30; // 30% weight
  const painScore = ((10 - this.painLevel) / 10) * 30; // 30% weight (inverted)
  
  return Math.round(moodScore + sleepScore + painScore);
});

// Method to get mood trend
journalEntrySchema.methods.getMoodTrend = async function(days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const entries = await this.constructor.find({
    victimId: this.victimId,
    entryDate: { $gte: startDate },
    _id: { $ne: this._id }
  }).sort({ entryDate: 1 });
  
  if (entries.length < 2) return 'insufficient-data';
  
  const moodValues = entries.map(entry => entry.moodRating);
  const trend = moodValues[moodValues.length - 1] - moodValues[0];
  
  if (trend > 1) return 'improving';
  if (trend < -1) return 'declining';
  return 'stable';
};

// Method to check for concerning patterns
journalEntrySchema.methods.checkConcerningPatterns = async function() {
  const recentEntries = await this.constructor.find({
    victimId: this.victimId,
    entryDate: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
  }).sort({ entryDate: -1 });
  
  const concerns = [];
  
  // Check for consistently low mood
  const lowMoodEntries = recentEntries.filter(entry => entry.moodRating <= 3);
  if (lowMoodEntries.length >= 3) {
    concerns.push('consistently-low-mood');
  }
  
  // Check for high pain levels
  const highPainEntries = recentEntries.filter(entry => entry.painLevel >= 7);
  if (highPainEntries.length >= 2) {
    concerns.push('persistent-high-pain');
  }
  
  // Check for poor sleep quality
  const poorSleepEntries = recentEntries.filter(entry => entry.sleepQuality <= 3);
  if (poorSleepEntries.length >= 3) {
    concerns.push('poor-sleep-pattern');
  }
  
  // Check for frequent incidents
  const incidentEntries = recentEntries.filter(entry => entry.incidentOccurred);
  if (incidentEntries.length >= 2) {
    concerns.push('frequent-incidents');
  }
  
  return concerns;
};

// Method to get summary statistics
journalEntrySchema.methods.getSummaryStats = async function(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const entries = await this.constructor.find({
    victimId: this.victimId,
    entryDate: { $gte: startDate }
  });
  
  if (entries.length === 0) return null;
  
  const stats = {
    totalEntries: entries.length,
    averageMood: entries.reduce((sum, entry) => sum + entry.moodRating, 0) / entries.length,
    averagePain: entries.reduce((sum, entry) => sum + entry.painLevel, 0) / entries.length,
    averageSleep: entries.reduce((sum, entry) => sum + entry.sleepQuality, 0) / entries.length,
    incidentCount: entries.filter(entry => entry.incidentOccurred).length,
    mostCommonEmotions: this.getMostCommonItems(entries.flatMap(entry => entry.emotionalState)),
    mostCommonSymptoms: this.getMostCommonItems(entries.flatMap(entry => entry.physicalSymptoms))
  };
  
  return stats;
};

// Helper method to get most common items
journalEntrySchema.methods.getMostCommonItems = function(items) {
  const frequency = {};
  items.forEach(item => {
    frequency[item] = (frequency[item] || 0) + 1;
  });
  
  return Object.entries(frequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([item, count]) => ({ item, count }));
};

// Static method to find entries by date range
journalEntrySchema.statics.findByDateRange = function(victimId, startDate, endDate) {
  return this.find({
    victimId: victimId,
    entryDate: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ entryDate: -1 });
};

// Static method to find entries with incidents
journalEntrySchema.statics.findWithIncidents = function(victimId) {
  return this.find({
    victimId: victimId,
    incidentOccurred: true
  }).sort({ entryDate: -1 });
};

// Static method to get mood analytics
journalEntrySchema.statics.getMoodAnalytics = function(victimId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        victimId: new mongoose.Types.ObjectId(victimId),
        entryDate: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$entryDate" }
        },
        averageMood: { $avg: "$moodRating" },
        averagePain: { $avg: "$painLevel" },
        averageSleep: { $avg: "$sleepQuality" },
        incidentCount: {
          $sum: { $cond: ["$incidentOccurred", 1, 0] }
        }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

// Static method to find concerning entries
journalEntrySchema.statics.findConcerningEntries = function(days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.find({
    entryDate: { $gte: startDate },
    $or: [
      { moodRating: { $lte: 3 } },
      { painLevel: { $gte: 7 } },
      { sleepQuality: { $lte: 3 } },
      { incidentOccurred: true }
    ]
  }).populate('victimId').sort({ entryDate: -1 });
};

module.exports = mongoose.model('JournalEntry', journalEntrySchema);