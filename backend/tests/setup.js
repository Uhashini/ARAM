// Test setup file
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost:27017/ipv_intervention_system_test';
process.env.JWT_SECRET = 'test_jwt_secret';
process.env.JWT_REFRESH_SECRET = 'test_jwt_refresh_secret';

// Mock MongoDB connection for tests
jest.mock('../config/database', () => {
  return jest.fn(() => {
    console.log('Mock MongoDB connection for tests');
  });
});