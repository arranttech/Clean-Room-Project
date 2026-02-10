const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const router = express.Router();

// Helper function to decode JWT without verification (for ID tokens)
const decodeGoogleToken = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const decoded = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
    return decoded;
  } catch (err) {
    console.error('Token decode error:', err);
    return null;
  }
};

// Google Sign-In endpoint (for frontend Google button)
router.post('/google-login', (req, res) => {
  try {
    console.log('Backend: /google-login endpoint called');
    const { credential } = req.body;

    console.log('Backend: Received credential:', !!credential);

    if (!credential) {
      return res.status(400).json({ message: 'Missing credential' });
    }

    // Decode the Google ID token
    const decoded = decodeGoogleToken(credential);
    
    console.log('Backend: Decoded token:', decoded ? 'success' : 'failed');

    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Extract user info from Google token
    const user = {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name
    };

    console.log('Backend: User extracted:', user.email);

    // Create JWT token for our app
    const expiresIn = process.env.JWT_EXPIRES_IN || '20m';
    console.log('Signing token with expiresIn:', expiresIn);
    const token = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn,
    });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false
    });

    console.log('Backend: Sending success response');
    res.json({ message: 'Google login successful', token, user });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ message: 'Google login failed' });
  }
});

// Basic email/password login endpoint
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    // For testing purposes - in production, validate credentials against database
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = {
      id: '1',
      email: email,
      name: email.split('@')[0]
    };

    const token = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false
    });

    res.json({ message: 'Login successful', token, user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

const isAllowedReturnTo = (value) => {
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) return false;
    return /^(localhost|127\.0\.0\.1)$/i.test(url.hostname);
  } catch (err) {
    return false;
  }
};

const encodeState = (value) => Buffer.from(value, 'utf8').toString('base64url');
const decodeState = (value) => {
  try {
    return Buffer.from(value, 'base64url').toString('utf8');
  } catch (err) {
    return null;
  }
};

router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(500).json({ message: 'Google OAuth not configured' });
  }

  const returnTo = req.query.returnTo;
  if (returnTo && !isAllowedReturnTo(returnTo)) {
    return res.status(400).json({ message: 'Invalid returnTo' });
  }

  const authOptions = {
    scope: ['profile', 'email'],
    session: false,
  };

  if (returnTo) {
    authOptions.state = encodeState(returnTo);
  }

  return passport.authenticate('google', authOptions)(req, res, next);
});

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const user = {
      id: req.user.googleId || req.user.id,
      email: req.user.email || (req.user.emails && req.user.emails[0] && req.user.emails[0].value),
      name: req.user.name || req.user.displayName
    };

    const token = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false
    });

    const stateValue = req.query.state ? decodeState(req.query.state) : null;
    const returnTo = stateValue && isAllowedReturnTo(stateValue) ? stateValue : null;
    const targetUrl = returnTo ? new URL(returnTo) : new URL('/', `http://${req.get('host')}`);
    targetUrl.searchParams.set('token', token);

    res.redirect(targetUrl.toString());
  }
);

module.exports = router;
