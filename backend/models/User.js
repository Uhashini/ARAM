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
    enum: ['victim', 'witness', 'healthcare_worker', 'admin'],
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
  }
});

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
  const salt = await bcrypt.genSalt(rounds);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);