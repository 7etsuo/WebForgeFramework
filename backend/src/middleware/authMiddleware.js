const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');
const logger = require('../utils/logger');

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtAccessSecret);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = {
      id: user._id,
      username: user.username,
      role: user.role
    };
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = authMiddleware;
