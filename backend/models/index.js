// Central export file for all database models
// This file provides a single point of import for all models

const User = require('./User');
const Session = require('./Session');
const Patient = require('./Patient');
const VictimProfile = require('./VictimProfile');
const WitnessReport = require('./WitnessReport');
const ScreeningResponse = require('./ScreeningResponse');
const SafetyPlan = require('./SafetyPlan');
const JournalEntry = require('./JournalEntry');
const Referral = require('./Referral');
const Analytics = require('./Analytics');
const Report = require('./Report');
const Content = require('./Content');

module.exports = {
  User,
  Session,
  Patient,
  VictimProfile,
  WitnessReport,
  ScreeningResponse,
  SafetyPlan,
  JournalEntry,
  Referral,
  Analytics,
  Report,
  Content
};