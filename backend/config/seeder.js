const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User, Content } = require('../models');

// Seed data for initial system setup
const seedData = {
  // Default admin user
  adminUser: {
    email: 'admin@ipvsystem.com',
    passwordHash: 'AdminPassword123!', // Will be hashed
    role: 'admin',
    profile: {
      firstName: 'System',
      lastName: 'Administrator'
    },
    permissions: [
      'read_own_data',
      'write_own_data',
      'read_patient_data',
      'write_patient_data',
      'read_reports',
      'write_reports',
      'read_analytics',
      'write_analytics',
      'manage_users',
      'manage_system'
    ],
    isActive: true
  },

  // Sample healthcare worker
  healthcareWorker: {
    email: 'doctor@hospital.com',
    passwordHash: 'Doctor123!', // Will be hashed
    role: 'healthcare_worker',
    profile: {
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      phone: '+1-555-0123',
      department: 'Emergency Medicine',
      licenseNumber: 'MD123456'
    },
    permissions: [
      'read_own_data',
      'write_own_data',
      'read_patient_data',
      'write_patient_data',
      'read_reports',
      'write_reports'
    ],
    isActive: true
  },

  // Essential content items
  essentialContent: [
    {
      title: 'Immediate Safety Planning',
      slug: 'immediate-safety-planning',
      type: 'safety-guide',
      category: 'safety-planning',
      content: {
        summary: 'Essential steps for creating an immediate safety plan when facing intimate partner violence.',
        body: `# Immediate Safety Planning

If you are in immediate danger, call 911 or your local emergency number.

## Quick Safety Steps:

1. **Trust your instincts** - If you feel unsafe, you probably are
2. **Have a safety plan** - Know where you can go and who you can call
3. **Keep important items ready** - ID, money, medications, keys
4. **Tell someone you trust** - Let them know about your situation
5. **Document incidents** - Keep records in a safe place

## Emergency Contacts:
- National Domestic Violence Hotline: 1-800-799-7233
- Crisis Text Line: Text HOME to 741741
- Local Emergency: 911

Remember: You are not alone, and help is available.`,
        keyPoints: [
          'Trust your instincts about danger',
          'Have an escape plan ready',
          'Keep emergency items accessible',
          'Build a support network',
          'Document incidents safely'
        ],
        actionItems: [
          {
            action: 'Identify safe places to go in an emergency',
            priority: 'high',
            timeframe: 'immediate'
          },
          {
            action: 'Memorize important phone numbers',
            priority: 'high',
            timeframe: 'immediate'
          },
          {
            action: 'Prepare an emergency bag',
            priority: 'medium',
            timeframe: 'short-term'
          }
        ],
        resources: [
          {
            title: 'National Domestic Violence Hotline',
            type: 'phone',
            value: '1-800-799-7233',
            description: '24/7 confidential support',
            isEmergency: true,
            isAvailable24Hours: true
          }
        ]
      },
      metadata: {
        tags: ['safety', 'emergency', 'planning', 'domestic-violence'],
        keywords: ['safety plan', 'emergency', 'domestic violence', 'help'],
        language: 'en',
        readingLevel: 'high-school'
      },
      accessibility: {
        targetAudience: ['victims', 'general-public'],
        userRoles: ['victim', 'witness'],
        isPublic: true,
        requiresAuthentication: false,
        sensitivityLevel: 'public'
      },
      workflow: {
        status: 'published',
        publishedAt: new Date(),
        approvalRequired: false
      },
      emergency: {
    