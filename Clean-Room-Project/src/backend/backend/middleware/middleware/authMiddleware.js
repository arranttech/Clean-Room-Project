const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    console.log('[AUTH] req exists:', !!req);
    console.log('[AUTH] req.cookies exists:', !!req.cookies);
    // Try to get token from cookies first, then from Authorization header
    let token = req.cookies?.token;
    console.log('[AUTH] Token from cookies:', !!token);
    
    if (!token) {
      // Try Authorization header (Bearer token)
      const authHeader = req.headers?.authorization;
      console.log('[AUTH] Authorization header:', !!authHeader);
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
        console.log('[AUTH] Token extracted from Authorization header');
      }
    }

    if (!token) {
      console.log('[AUTH] No token found - returning 401');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    console.log('[AUTH] Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[AUTH] Token verified successfully');
    req.user = decoded;
    next();
  } catch (err) {
    console.log('[AUTH] Error in middleware:', err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};
