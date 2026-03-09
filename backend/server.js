const express = require('express');
const http = require('http');
const { Server: SocketIOServer } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/database');

const app = express();
const server = http.createServer(app); // Wrap Express in http.Server for Socket.io

// ── Socket.io ──────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001'
].filter(Boolean);

const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Store io on app for use inside routes
app.set('io', io);

io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  // Client joins a session room to receive live updates
  socket.on('join:session', (sessionId) => {
    socket.join(`session:${sessionId}`);
    console.log(`[Socket.io] ${socket.id} joined session:${sessionId}`);
  });

  socket.on('leave:session', (sessionId) => {
    socket.leave(`session:${sessionId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// Rate limiting — emergency routes get a separate generous limit
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
const emergencyLimiter = rateLimit({ windowMs: 60 * 1000, max: 120 }); // 120 req/min for pings

app.use('/api/', limiter);
app.use('/api/emergency', emergencyLimiter);

// CORS
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request ID
const { addRequestId } = require('./middleware/auth');
app.use(addRequestId);

// ── API Routes ─────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    socketConnections: io.engine.clientsCount
  });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/witness', require('./routes/witnessRoutes'));
app.use('/api/journal', require('./routes/journalRoutes'));
app.use('/api/victim', require('./routes/victimRoutes'));
app.use('/api/emergency', require('./routes/emergencyRoutes'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  const error = {
    code: err.code || 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected error occurred',
    timestamp: new Date().toISOString(),
    requestId: req.id || 'unknown'
  };
  if (process.env.NODE_ENV === 'development') error.details = err.stack;
  res.status(err.statusCode || 500).json({ error });
});

// 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: 'The requested resource was not found', timestamp: new Date().toISOString() }
  });
});

// ── Start Server ───────────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  console.log(`Socket.io ready`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => { console.log('Process terminated'); });
});

module.exports = { app, io };