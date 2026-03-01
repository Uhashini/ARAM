const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.NODE_ENV === 'test'
      ? process.env.MONGODB_TEST_URI
      : process.env.MONGODB_URI;

    console.log('--- DB Connection Debug ---');
    console.log('NODE_ENV:', process.env.NODE_ENV);

    if (mongoURI) {
      const sanitized = mongoURI.replace(/:([^@]+)@/, ':****@');
      console.log('Connecting to:', sanitized);
    } else {
      console.error('ERROR: MONGODB_URI is not defined in environment variables');
    }

    // Using tlsAllowInvalidCertificates: true to bypass TLS handshake issues (SSL alert number 80)
    // common in environments with restricted outbound proxies or local network interference.
    const conn = await mongoose.connect(mongoURI, {
      tlsAllowInvalidCertificates: true
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('DATABASE CONNECTION ERROR FULL DETAILS:');
    console.error('Name:', error.name);
    console.error('Message:', error.message);
    if (error.code) console.error('Code:', error.code);
    process.exit(1);
  }
};

module.exports = connectDB;