require('dotenv').config({ path: __dirname + '/.env' })

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const passport = require('passport');
require('./passport');

// Import auth routes
const authRoutes = require('./auth');

const app = express();

// =========== MIDDLEWARE ===========

// Logging FIRST
app.use((req, res, next) => {
  console.log(`[LOG] ${req.method} ${req.path}`);
  next();
});

// CORS
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/i.test(origin);
    if (isLocalhost) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Cookie parsing
app.use(cookieParser());

// Passport init
app.use(passport.initialize());

// Body parsing
app.use(express.json());

// =========== ROUTES ===========

// Health check
app.get('/', (req, res) => {
  console.log('[HANDLER] GET / called');
  res.json({ status: 'ok', message: 'Backend running' });
});

// Auth routes
console.log('[STARTUP] Mounting auth routes at /auth');
app.use('/auth', authRoutes);
console.log('[STARTUP] Auth routes mounted');

// Dump registered routes for debugging
if (app && app._router && app._router.stack) {
  console.log('[ROUTES] Registered routes:');
  app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
      const methods = Object.keys(r.route.methods).join(',');
      console.log(`  ${methods.toUpperCase()} ${r.route.path}`);
    }
  });
}

// Protected API route example
const authMiddleware = require('./middleware/middleware/authMiddleware');
app.get('/api/profile', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// Serve frontend static files
const frontendPath = path.join(__dirname, '../../dist');
console.log('[STARTUP] Serving frontend from:', frontendPath);
app.use(express.static(frontendPath));

// SPA fallback - serve index.html for all non-API routes
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// =========== SERVER START ===========
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`[STARTUP] Backend running on http://localhost:${PORT}`);
});
