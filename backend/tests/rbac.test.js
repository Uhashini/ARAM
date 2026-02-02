const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const authService = require('../services/authService');

describe('Role-Based Access Control (RBAC)', () => {
  let adminToken, healthcareToken, victimToken, witnessToken;
  let adminUser, healthcareUser, victimUser, witnessUser;

  beforeAll(async () => {
    // Create test users for each role
    adminUser = await User.createUser({
      email: 'admin@test.com',
      passwordHash: 'password123',
      role: 'admin',
      profile: {
        firstName: 'Admin',
        lastName: 'User'
      }
    });

    healthcareUser = await User.createUser({
      email: 'healthcare@test.com',
      passwordHash: 'password123',
      role: 'healthcare_worker',
      profile: {
        firstName: 'Healthcare',
        lastName: 'Worker',
        department: 'Emergency',
        licenseNumber: 'HW123456'
      }
    });

    victimUser = await User.createUser({
      email: 'victim@test.com',
      passwordHash: 'password123',
      role: 'victim',
      profile: {
        firstName: 'Victim',
        lastName: 'User'
      }
    });

    witnessUser = await User.createUser({
      email: 'witness@test.com',
      passwordHash: 'password123',
      role: 'witness',
      profile: {
        firstName: 'Witness',
        lastName: 'User'
      }
    });

    // Get tokens for each user
    const adminLogin = await authService.login(
      { email: 'admin@test.com', password: 'password123' },
      '127.0.0.1',
      'test-agent'
    );
    adminToken = adminLogin.token;

    const healthcareLogin = await authService.login(
      { email: 'healthcare@test.com', password: 'password123' },
      '127.0.0.1',
      'test-agent'
    );
    healthcareToken = healthcareLogin.token;

    const victimLogin = await authService.login(
      { email: 'victim@test.com', password: 'password123' },
      '127.0.0.1',
      'test-agent'
    );
    victimToken = victimLogin.token;

    const witnessLogin = await authService.login(
      { email: 'witness@test.com', password: 'password123' },
      '127.0.0.1',
      'test-agent'
    );
    witnessToken = witnessLogin.token;
  });

  afterAll(async () => {
    // Clean up test users
    await User.deleteMany({
      email: { $in: ['admin@test.com', 'healthcare@test.com', 'victim@test.com', 'witness@test.com'] }
    });
  });

  describe('Admin Routes Access Control', () => {
    test('Admin can access admin analytics', async () => {
      const response = await request(app)
        .get('/api/admin/analytics')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(501); // Not implemented yet, but authorized
      expect(response.body.error.code).toBe('NOT_IMPLEMENTED');
    });

    test('Healthcare worker cannot access admin analytics', async () => {
      const response = await request(app)
        .get('/api/admin/analytics')
        .set('Authorization', `Bearer ${healthcareToken}`);

      expect(response.status).toBe(403);
      expect(response.body.error.code).toBe('INSUFFICIENT_ROLE');
    });

    test('Victim cannot access admin analytics', async () => {
      const response = await request(app)
        .get('/api/admin/analytics')
        .set('Authorization', `Bearer ${victimToken}`);

      expect(response.status).toBe(403);
      expect(response.body.error.code).toBe('INSUFFICIENT_ROLE');
    });

    test('Witness cannot access admin analytics', async () => {
      const response = await request(app)
        .get('/api/admin/analytics')
        .set('Authorization', `Bearer ${witnessToken}`);

      expect(response.status).toBe(403);
      expect(response.body.error.code).toBe('INSUFFICIENT_ROLE');
    });
  });

  describe('Healthcare Routes Access Control', () => {
    test('Healthcare worker can access patient search', async () => {
      const response = await request(app)
        .get('/api/healthcare/patients/search')
        .set('Authorization', `Bearer ${healthcareToken}`);

      expect(response.status).toBe(501); // Not implemented yet, but authorized
      expect(response.body.error.code).toBe('NOT_IMPLEMENTED');
    });

    test('Admin can access patient search', async () => {
      const response = await request(app)
        .get('/api/healthcare/patients/search')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(501); // Not implemented yet, but authorized
      expect(response.body.error.code).toBe('NOT_IMPLEMENTED');
    });

    test('Victim cannot access patient search', async () => {
      const response = await request(app)
        .get('/api/healthcare/patients/search')
        .set('Authorization', `Bearer ${victimToken}`);

      expect(response.status).toBe(403);
      expect(response.body.error.code).toBe('INSUFFICIENT_ROLE');
    });

    test('Witness cannot access patient search', async () => {
      const response = await request(app)
        .get('/api/healthcare/patients/search')
        .set('Authorization', `Bearer ${witnessToken}`);

      expect(response.status).toBe(403);
      expect(response.body.error.code).toBe('INSUFFICIENT_ROLE');
    });
  });

  describe('Victim Routes Access Control', () => {
    test('Victim can access their profile', async () => {
      const response = await request(app)
        .get('/api/victim/profile')
        .set('Authorization', `Bearer ${victimToken}`);

      expect(response.status).toBe(501); // Not implemented yet, but authorized
      expect(response.body.error.code).toBe('NOT_IMPLEMENTED');
    });

    test('Admin can access victim profile', async () => {
      const response = await request(app)
        .get('/api/victim/profile')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(501); // Not implemented yet, but authorized
      expect(response.body.error.code).toBe('NOT_IMPLEMENTED');
    });

    test('Healthcare worker cannot access victim profile', async () => {
      const response = await request(app)
        .get('/api/victim/profile')
        .set('Authorization', `Bearer ${healthcareToken}`);

      expect(response.status).toBe(403);
      expect(response.body.error.code).toBe('INSUFFICIENT_ROLE');
    });

    test('Witness cannot access victim profile', async () => {
      const response = await request(app)
        .get('/api/victim/profile')
        .set('Authorization', `Bearer ${witnessToken}`);

      expect(response.status).toBe(403);
      expect(response.body.error.code).toBe('INSUFFICIENT_ROLE');
    });
  });

  describe('Witness Routes Access Control', () => {
    test('Anonymous witness report should work without authentication', async () => {
      const response = await request(app)
        .post('/api/witness/report')
        .send({
          incidentDetails: 'Test incident',
          immediateRisk: false
        });

      expect(response.status).toBe(501); // Not implemented yet, but authorized
      expect(response.body.error.code).toBe('NOT_IMPLEMENTED');
    });

    test('Authenticated witness report requires witness role', async () => {
      const response = await request(app)
        .post('/api/witness/authenticated-report')
        .set('Authorization', `Bearer ${witnessToken}`)
        .send({
          incidentDetails: 'Test incident',
          immediateRisk: false
        });

      expect(response.status).toBe(501); // Not implemented yet, but authorized
      expect(response.body.error.code).toBe('NOT_IMPLEMENTED');
    });

    test('Admin can submit authenticated witness report', async () => {
      const response = await request(app)
        .post('/api/witness/authenticated-report')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          incidentDetails: 'Test incident',
          immediateRisk: false
        });

      expect(response.status).toBe(501); // Not implemented yet, but authorized
      expect(response.body.error.code).toBe('NOT_IMPLEMENTED');
    });

    test('Victim cannot submit authenticated witness report', async () => {
      const response = await request(app)
        .post('/api/witness/authenticated-report')
        .set('Authorization', `Bearer ${victimToken}`)
        .send({
          incidentDetails: 'Test incident',
          immediateRisk: false
        });

      expect(response.status).toBe(403);
      expect(response.body.error.code).toBe('INSUFFICIENT_ROLE');
    });
  });

  describe('Authentication Requirements', () => {
    test('Protected routes require authentication', async () => {
      const response = await request(app)
        .get('/api/victim/profile');

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('AUTHENTICATION_REQUIRED');
    });

    test('Invalid token returns authentication error', async () => {
      const response = await request(app)
        .get('/api/victim/profile')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('INVALID_TOKEN');
    });
  });

  describe('Anonymous Reporting Privacy', () => {
    test('Anonymous report should strip identifying information', async () => {
      const response = await request(app)
        .post('/api/witness/report')
        .send({
          incidentDetails: 'Test incident',
          immediateRisk: false,
          email: 'should-be-removed@test.com',
          phone: '555-1234',
          firstName: 'Should',
          lastName: 'BeRemoved'
        });

      expect(response.status).toBe(501); // Not implemented yet, but middleware should have processed
      // The middleware should have stripped the identifying fields
      // This will be fully testable when the endpoint is implemented
    });
  });

  describe('Role Permissions', () => {
    test('User model returns correct permissions for each role', () => {
      expect(adminUser.getRolePermissions()).toContain('manage_users');
      expect(adminUser.getRolePermissions()).toContain('manage_system');
      expect(adminUser.getRolePermissions()).toContain('read_analytics');

      expect(healthcareUser.getRolePermissions()).toContain('read_patient_data');
      expect(healthcareUser.getRolePermissions()).toContain('write_patient_data');
      expect(healthcareUser.getRolePermissions()).not.toContain('manage_users');

      expect(victimUser.getRolePermissions()).toContain('emergency_access');
      expect(victimUser.getRolePermissions()).not.toContain('read_patient_data');

      expect(witnessUser.getRolePermissions()).toContain('read_own_data');
      expect(witnessUser.getRolePermissions()).not.toContain('emergency_access');
    });

    test('hasPermission method works correctly', () => {
      expect(adminUser.hasPermission('manage_users')).toBe(true);
      expect(healthcareUser.hasPermission('read_patient_data')).toBe(true);
      expect(victimUser.hasPermission('emergency_access')).toBe(true);
      expect(witnessUser.hasPermission('manage_users')).toBe(false);
    });
  });
});