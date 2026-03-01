const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['victim', 'witness', 'healthcare', 'admin'],
    default: 'victim',
  },
  organization: {
    type: String,
    required: function () { return this.role === 'healthcare'; }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  riskAssessment: {
    level: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', null], default: null },
    score: { type: Number, default: 0 },
    lastChecked: { type: Date }
  },
  evidenceLockerPin: {
    type: String,
    default: null
  }
});

// Encrypt password and evidenceLockerPin using bcrypt
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  if (this.isModified('evidenceLockerPin') && this.evidenceLockerPin) {
    const salt = await bcrypt.genSalt(10);
    this.evidenceLockerPin = await bcrypt.hash(this.evidenceLockerPin, salt);
  }

  next();
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Match user entered pin to hashed pin in database
userSchema.methods.matchLockerPin = async function (enteredPin) {
  if (!this.evidenceLockerPin) return false;
  return await bcrypt.compare(enteredPin, this.evidenceLockerPin);
};

module.exports = mongoose.model('User', userSchema);