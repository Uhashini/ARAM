const request = require('supertest');
const app = require('../server');

describe('Server Setup', () => {
  test('Health check endpoint should return 200', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);
    
    expect(response.body.status).toBe('OK');
    expect(response.body.environment).toBeDefined();
    expect(response.body.timestamp).toBeDefined();
  });

  test('404 handler should work for unknown routes', async () => {
    const response = await request(app)
      .get('/api/unknown-route')
      .expect(404);
    
    expect(response.body.error.code).toBe('NOT_FOUND');
    expect(response.body.error.message).toBe('The requested resource was not found');
  });

  test('Auth routes should return not implemented', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .expect(501);
    
    expect(response.body.error.code).toBe('NOT_IMPLEMENTED');
  });

  afterAll(async () => {
    // Close any open handles
    if (app && app.close) {
      await app.close();
    }
  });
});